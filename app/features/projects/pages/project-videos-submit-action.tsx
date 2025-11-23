/**
 * 영상 제출 Action
 * 선택한 영상을 제출하고 다음 단계(final)로 진행합니다.
 */

import { type ActionFunctionArgs, data } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { updateProjectStep } from "../mutations";
import { triggerProjectStepStartWebhook } from "~/lib/n8n-webhook";
import { getProjectWorkspaceData, saveStepData } from "../queries";

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

    // 현재 워크스페이스 데이터에서 비디오 자산 가져오기
    const workspaceData = await getProjectWorkspaceData(client, projectId);
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

    // videos 단계를 completed로 변경
    await updateProjectStep(client, projectId, "videos", "completed", {
      selected_video_id: selectedVideoId,
    });

    // final 단계를 in_progress로 시작
    await updateProjectStep(client, projectId, "final", "in_progress");

    // n8n 웹훅 호출 (최종 편집 시작)
    await triggerProjectStepStartWebhook({
      project_id: projectId,
      step_key: "final",
      step_status: "in_progress",
      started_at: new Date().toISOString(),
      metadata: {
        selected_video_id: selectedVideoId,
      },
    });

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
