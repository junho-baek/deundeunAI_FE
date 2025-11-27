/**
 * 이미지 제출 Action
 * 선택한 이미지들을 제출하고 다음 단계(videos)로 진행합니다.
 */

import { type ActionFunctionArgs, data } from "react-router";
import { z } from "zod";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { updateProjectStep } from "../mutations";
import { triggerShortWorkflowStepFourWebhook } from "~/lib/n8n-webhook";
import { getProjectWorkspaceData, saveStepData } from "../queries";
import { getShortWorkflowJobsByProject } from "../short-workflow";
import type { ShortWorkflowJobRecord } from "../short-workflow";

const formSchema = z.object({
  imageIds: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : undefined;
      } catch {
        return undefined;
      }
    })
    .pipe(z.array(z.coerce.number()).optional()),
});

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  const { client } = makeSSRClient(request);
  const projectId = params.projectId;

  if (!projectId || projectId === "create") {
    return data({ error: "Invalid project ID" }, { status: 400 });
  }

  try {
    await getLoggedInUserId(client);

    const formData = await request.formData();
    const formObject = Object.fromEntries(formData.entries());

    // Zod 스키마로 검증
    const { success, data: validatedData } = formSchema.safeParse(formObject);
    
    if (!success) {
      return data({ error: "잘못된 요청 데이터입니다." }, { status: 400 });
    }

    const selectedImageIds = validatedData.imageIds;

    // 워크스페이스 데이터 조회
    const workspaceData = await getProjectWorkspaceData(client, projectId);
    const projectRowId = workspaceData?.project?.id;
    
    if (!projectRowId) {
      return data(
        { error: "프로젝트 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const imageAssets =
      workspaceData?.mediaAssets?.filter((asset) => asset.type === "image") ||
      [];

    // 선택된 이미지가 있으면 해당 이미지만, 없으면 모든 이미지 저장
    const imagesToSave = selectedImageIds
      ? imageAssets.filter((asset: any) =>
          selectedImageIds?.includes(asset.id)
        )
      : imageAssets;

    // 이미지 데이터를 DB에 저장
    if (imagesToSave.length > 0) {
      await saveStepData(client, {
        projectId,
        stepKey: "images",
        data: {
          mediaAssets: imagesToSave.map((asset: any) => ({
            type: "image" as const,
            sourceUrl: asset.source_url || "",
            previewUrl: asset.preview_url || undefined,
            label: asset.label || undefined,
            timelineLabel: asset.timeline_label || undefined,
            selected: selectedImageIds
              ? selectedImageIds.includes(asset.id)
              : asset.selected || false,
          })),
          metadata: {
            selected_image_ids: selectedImageIds,
          },
        },
      });
    }

    // 기획서 완료 시 선택된 job 찾기 (status가 wait가 아닌 job)
    const { getLoggedInProfileId } = await import("~/features/users/queries");
    const ownerProfileId = await getLoggedInProfileId(client);
    const shortWorkflowJobs = await getShortWorkflowJobsByProject(client, {
      projectRowId,
      ownerProfileId,
      limit: 5,
    });
    const selectedJob = shortWorkflowJobs.find(
      (job) => job.status !== "wait"
    ) as ShortWorkflowJobRecord | undefined;

    // DB 업데이트 먼저 (트랜잭션 순서 개선)
    await updateProjectStep(client, projectId, "images", "completed", {
      selected_image_ids: selectedImageIds,
    });
    await updateProjectStep(client, projectId, "videos", "in_progress");

    // 웹훅 호출 (마지막에, 실패해도 DB는 이미 업데이트됨)
    if (selectedJob) {
      try {
        await triggerShortWorkflowStepFourWebhook(selectedJob);
        console.log("✅ n8n step4 웹훅 호출 완료");
      } catch (error) {
        console.error("❌ n8n step4 웹훅 호출 실패:", error);
      }
    } else {
      console.warn(
        "⚠️ [images-submit] status가 'wait'가 아닌 job을 찾을 수 없어 step4 웹훅을 호출하지 않습니다.",
        { jobsCount: shortWorkflowJobs.length, jobs: shortWorkflowJobs.map(j => ({ id: j.id, status: j.status })) }
      );
    }

    return data({ success: true, message: "이미지가 제출되었습니다." });
  } catch (error) {
    console.error("이미지 제출 실패:", error);
    return data(
      {
        error:
          error instanceof Error
            ? error.message
            : "이미지 제출에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
