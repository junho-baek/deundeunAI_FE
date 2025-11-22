/**
 * 프로젝트 단계 상태 업데이트를 위한 Action 함수
 * 
 * 이 파일은 프로젝트 단계 상태를 업데이트하기 위한 action 함수를 제공합니다.
 * 프로젝트 ID와 단계 키를 기반으로 상태를 POST하고 업데이트합니다.
 */

import { type ActionFunctionArgs, data } from "react-router";
import { updateProjectStep } from "../queries";
import { makeSSRClient } from "~/lib/supa-client";
import { triggerProjectStepStartWebhook } from "~/lib/n8n-webhook";

export async function updateStepStatusAction({ request, params }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  const { client } = makeSSRClient(request);
  const projectId = params.projectId;
  if (!projectId || projectId === "create") {
    return data({ error: "Invalid project ID" }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const stepKey = formData.get("stepKey") as string;
    const status = formData.get("status") as string;
    const metadataStr = formData.get("metadata");

    if (!stepKey || !status) {
      return data(
        { error: "stepKey and status are required" },
        { status: 400 }
      );
    }

    // 유효한 stepKey인지 확인
    const validStepKeys = [
      "brief",
      "script",
      "narration",
      "images",
      "videos",
      "final",
      "distribution",
    ];
    if (!validStepKeys.includes(stepKey)) {
      return data({ error: "Invalid stepKey" }, { status: 400 });
    }

    // 유효한 status인지 확인
    const validStatuses = ["pending", "in_progress", "blocked", "completed"];
    if (!validStatuses.includes(status)) {
      return data({ error: "Invalid status" }, { status: 400 });
    }

    // metadata 파싱 (선택사항)
    let metadata: Record<string, unknown> | undefined;
    if (metadataStr && typeof metadataStr === "string") {
      try {
        metadata = JSON.parse(metadataStr);
      } catch (e) {
        console.warn("Failed to parse metadata:", e);
      }
    }

    const updatedStep = await updateProjectStep(
      client,
      projectId,
      stepKey as any,
      status as any,
      metadata
    );

    // 단계가 in_progress로 시작될 때 n8n 워크플로우 트리거
    if (status === "in_progress") {
      triggerProjectStepStartWebhook({
        project_id: projectId,
        step_key: stepKey,
        step_status: status,
        started_at: updatedStep.started_at || new Date().toISOString(),
      }).catch((error) => {
        console.error("n8n 웹훅 호출 실패 (상태 업데이트는 계속 진행):", error);
      });
    }

    return data({ success: true, step: updatedStep });
  } catch (error) {
    console.error("프로젝트 단계 상태 업데이트 실패:", error);
    return data(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

