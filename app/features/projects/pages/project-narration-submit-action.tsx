/**
 * 대사 제출 Action
 * 대사를 제출하고 다음 단계(images)로 진행합니다.
 */

import { type ActionFunctionArgs, data } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { updateProjectStep } from "../mutations";
import { triggerProjectStepStartWebhook } from "~/lib/n8n-webhook";
import { getProjectWorkspaceData, getProjectSteps, saveStepData } from "../queries";

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

    const projectSteps = await getProjectSteps(client, projectId);
    const narrationStep = projectSteps.find((step) => step.key === "narration");
    if (narrationStep?.status === "completed") {
      return data({
        success: true,
        alreadyCompleted: true,
        message: "이미 확정된 나레이션입니다.",
      });
    }

    // 현재 워크스페이스 데이터에서 나레이션 오디오 세그먼트 가져오기
    const workspaceData = await getProjectWorkspaceData(client, projectId);
    const audioSegments = workspaceData?.audioSegments || [];

    // 나레이션 데이터를 DB에 저장
    if (audioSegments.length > 0) {
      await saveStepData(client, {
        projectId,
        stepKey: "narration",
        data: {
          audioSegments: audioSegments.map((seg: any) => ({
            label: seg.label || seg.timeline_label || "",
            audioUrl: seg.audio_url || "",
            durationMs: seg.duration_ms || undefined,
          })),
          metadata: {},
        },
      });
    }

    // narration 단계를 completed로 변경
    await updateProjectStep(client, projectId, "narration", "completed");

    // images 단계를 in_progress로 시작
    await updateProjectStep(client, projectId, "images", "in_progress");

    // n8n 웹훅 호출 (이미지 생성 시작)
    await triggerProjectStepStartWebhook({
      project_id: projectId,
      step_key: "images",
      step_status: "in_progress",
      started_at: new Date().toISOString(),
    });

    return data({ success: true, message: "대사가 제출되었습니다." });
  } catch (error) {
    console.error("대사 제출 실패:", error);
    return data(
      {
        error:
          error instanceof Error ? error.message : "대사 제출에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
