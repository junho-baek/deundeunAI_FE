/**
 * 폼 제출 Action
 * ChatInitForm에서 제출된 폼 데이터를 처리하고 기획서 생성을 시작합니다.
 */

import { type ActionFunctionArgs, data, redirect } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { getProjectByProjectId } from "../queries";
import { updateProjectStep } from "../mutations";
import { saveProjectMessage } from "../queries";
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
    const formDataObj: Record<string, string[]> = {};
    
    // FormData에서 폼 응답 데이터 추출
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("form_")) {
        const fieldName = key.replace("form_", "");
        if (!formDataObj[fieldName]) {
          formDataObj[fieldName] = [];
        }
        formDataObj[fieldName].push(value as string);
      }
    }

    // 프로젝트 확인
    const project = await getProjectByProjectId(client, projectId);
    if (!project) {
      return data({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
    }

    // 폼 응답 메시지 저장
    const formDataStr = JSON.stringify(formDataObj, null, 2);
    await saveProjectMessage(client, {
      projectId,
      role: "user",
      content: `폼 응답:\n${formDataStr}`,
      stepKey: "brief",
      metadata: {
        formData: formDataObj,
        isFormResponse: true,
      },
    });

    // 에이전트 응답 메시지 저장
    await saveProjectMessage(client, {
      projectId,
      role: "agent",
      content: "폼 응답을 확인했습니다. 기획서 작성을 시작하겠습니다.",
      stepKey: "brief",
      metadata: {
        isFormResponse: true,
      },
    });

    // brief 단계를 in_progress로 시작
    await updateProjectStep(client, projectId, "brief", "in_progress", {
      formData: formDataObj,
      started_at: new Date().toISOString(),
    });

    // n8n 웹훅 호출 (기획서 생성 시작)
    await triggerProjectStepStartWebhook({
      project_id: projectId,
      step_key: "brief",
      step_status: "in_progress",
      started_at: new Date().toISOString(),
      metadata: {
        formData: formDataObj,
      },
    });

    return data({ success: true, message: "폼이 제출되었습니다." });
  } catch (error) {
    console.error("폼 제출 실패:", error);
    return data(
      {
        error:
          error instanceof Error
            ? error.message
            : "폼 제출에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

