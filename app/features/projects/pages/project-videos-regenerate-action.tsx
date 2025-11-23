/**
 * 영상 재생성 Action
 * 선택한 영상들을 재생성하기 위해 n8n 웹훅을 호출합니다.
 */

import { type ActionFunctionArgs, data } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { updateProjectStep } from "../mutations";
import { triggerProjectStepStartWebhook } from "~/lib/n8n-webhook";

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
    const videoIdsStr = formData.get("videoIds") as string;

    if (!videoIdsStr) {
      return data({ error: "재생성할 영상을 선택해주세요." }, { status: 400 });
    }

    // 영상 ID 배열 파싱
    let videoIds: number[];
    try {
      videoIds = JSON.parse(videoIdsStr);
      if (!Array.isArray(videoIds)) {
        throw new Error("Invalid videoIds format");
      }
    } catch {
      return data({ error: "잘못된 영상 ID 형식입니다." }, { status: 400 });
    }

    // videos 단계를 in_progress로 변경 (재생성 시작)
    await updateProjectStep(client, projectId, "videos", "in_progress", {
      regenerated_video_ids: videoIds,
      regenerated_at: new Date().toISOString(),
    });

    // n8n 웹훅 재호출 (영상 재생성)
    await triggerProjectStepStartWebhook({
      project_id: projectId,
      step_key: "videos",
      step_status: "in_progress",
      started_at: new Date().toISOString(),
      metadata: {
        action: "regenerate",
        video_ids: videoIds,
      },
    });

    return data({
      success: true,
      message: `${videoIds.length}개의 영상 재생성이 시작되었습니다.`,
    });
  } catch (error) {
    console.error("영상 재생성 실패:", error);
    return data(
      {
        error:
          error instanceof Error
            ? error.message
            : "영상 재생성에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
