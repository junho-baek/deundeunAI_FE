/**
 * 대사 제출 Action
 * 대사를 제출하고 다음 단계(images)로 진행합니다.
 */

import { type ActionFunctionArgs, data } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { updateProjectStep } from "../mutations";
import { triggerShortWorkflowStepThreeWebhook } from "~/lib/n8n-webhook";
import { getProjectWorkspaceData, getProjectSteps, saveStepData } from "../queries";
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

    const projectSteps = await getProjectSteps(client, projectId);
    const narrationStep = projectSteps.find((step) => step.key === "narration");
    if (narrationStep?.status === "completed") {
      return data({
        success: true,
        alreadyCompleted: true,
        message: "이미 확정된 나레이션입니다.",
      });
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

    // 나레이션 데이터 저장
    const audioSegments = workspaceData?.audioSegments || [];
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
    await updateProjectStep(client, projectId, "narration", "completed");
    await updateProjectStep(client, projectId, "images", "in_progress");

    // 웹훅 호출 (마지막에, 실패해도 DB는 이미 업데이트됨)
    if (selectedJob) {
      try {
        await triggerShortWorkflowStepThreeWebhook(selectedJob);
        console.log("✅ n8n step3 웹훅 호출 완료");
      } catch (error) {
        console.error("❌ n8n step3 웹훅 호출 실패:", error);
        // 웹훅 실패해도 나레이션 제출은 계속 진행
      }
    } else {
      console.warn(
        "⚠️ [narration-submit] status가 'wait'가 아닌 job을 찾을 수 없어 step3 웹훅을 호출하지 않습니다.",
        { jobsCount: shortWorkflowJobs.length, jobs: shortWorkflowJobs.map(j => ({ id: j.id, status: j.status })) }
      );
    }

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
