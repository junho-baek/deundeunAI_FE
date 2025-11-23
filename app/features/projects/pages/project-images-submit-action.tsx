/**
 * 이미지 제출 Action
 * 선택한 이미지들을 제출하고 다음 단계(videos)로 진행합니다.
 */

import { type ActionFunctionArgs, data } from "react-router";
import { z } from "zod";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { updateProjectStep } from "../mutations";
import { triggerProjectStepStartWebhook } from "~/lib/n8n-webhook";
import { getProjectWorkspaceData, saveStepData } from "../queries";

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

    // 현재 워크스페이스 데이터에서 이미지 자산 가져오기
    const workspaceData = await getProjectWorkspaceData(client, projectId);
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

    // images 단계를 completed로 변경
    await updateProjectStep(client, projectId, "images", "completed", {
      selected_image_ids: selectedImageIds,
    });

    // videos 단계를 in_progress로 시작
    await updateProjectStep(client, projectId, "videos", "in_progress");

    // n8n 웹훅 호출 (영상 생성 시작)
    await triggerProjectStepStartWebhook({
      project_id: projectId,
      step_key: "videos",
      step_status: "in_progress",
      started_at: new Date().toISOString(),
      metadata: {
        selected_image_ids: selectedImageIds,
      },
    });

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
