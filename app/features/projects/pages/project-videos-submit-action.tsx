/**
 * 영상 제출 Action
 * 선택한 영상을 제출하고 다음 단계(final)로 진행합니다.
 */

import { type ActionFunctionArgs, data } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { updateProjectStep } from "../mutations";
import { triggerShortWorkflowStepFiveWebhook } from "~/lib/n8n-webhook";
import { getProjectWorkspaceData, saveStepData } from "../queries";
import { getShortWorkflowJobsByProject } from "../short-workflow";
import type { ShortWorkflowJobRecord } from "../short-workflow";

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
    const videoIdStr = formData.get("videoId") as string;

    // 영상 ID 파싱 (선택사항)
    let selectedVideoId: number | undefined;
    if (videoIdStr) {
      try {
        selectedVideoId = parseInt(videoIdStr, 10);
        if (isNaN(selectedVideoId)) {
          selectedVideoId = undefined;
        }
      } catch {
        // 파싱 실패 시 무시
      }
    }

    // 워크스페이스 데이터 조회 (한 번만)
    const workspaceData = await getProjectWorkspaceData(client, projectId);
    const projectRowId = workspaceData?.project?.id;
    
    if (!projectRowId) {
      return data(
        { error: "프로젝트 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const videoAssets =
      workspaceData?.mediaAssets?.filter((asset) => asset.type === "video") ||
      [];

    // 선택된 비디오가 있으면 해당 비디오만, 없으면 모든 비디오 저장
    const videosToSave = selectedVideoId
      ? videoAssets.filter((asset: any) => asset.id === selectedVideoId)
      : videoAssets;

    // 비디오 데이터를 DB에 저장
    if (videosToSave.length > 0) {
      await saveStepData(client, {
        projectId,
        stepKey: "videos",
        data: {
          mediaAssets: videosToSave.map((asset: any) => ({
            type: "video" as const,
            sourceUrl: asset.source_url || "",
            previewUrl: asset.preview_url || undefined,
            label: asset.label || undefined,
            timelineLabel: asset.timeline_label || undefined,
            selected: selectedVideoId
              ? asset.id === selectedVideoId
              : asset.selected || false,
          })),
          metadata: {
            selected_video_id: selectedVideoId,
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
    await updateProjectStep(client, projectId, "videos", "completed", {
      selected_video_id: selectedVideoId,
    });
    await updateProjectStep(client, projectId, "final", "in_progress");

    // 웹훅 호출 (마지막에, 실패해도 DB는 이미 업데이트됨)
    if (selectedJob) {
      try {
        await triggerShortWorkflowStepFiveWebhook(selectedJob);
        console.log("✅ n8n step5 웹훅 호출 완료");
      } catch (error) {
        console.error("❌ n8n step5 웹훅 호출 실패:", error);
      }
    } else {
      console.warn(
        "⚠️ [videos-submit] status가 'wait'가 아닌 job을 찾을 수 없어 step5 웹훅을 호출하지 않습니다.",
        { jobsCount: shortWorkflowJobs.length, jobs: shortWorkflowJobs.map(j => ({ id: j.id, status: j.status })) }
      );
    }

    return data({ success: true, message: "영상이 제출되었습니다." });
  } catch (error) {
    console.error("영상 제출 실패:", error);
    return data(
      {
        error:
          error instanceof Error ? error.message : "영상 제출에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
