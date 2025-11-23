/**
 * 기획서 제출 Action
 * 기획서를 제출하고 다음 단계(script)로 진행합니다.
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

    // 현재 워크스페이스 데이터에서 기획서 내용 가져오기
    const workspaceData = await getProjectWorkspaceData(client, projectId);
    const briefDocument = workspaceData?.documents?.find(
      (doc) => doc.type === "brief"
    );

    // 기획서 데이터를 DB에 저장 (없으면 에러 반환)
    if (!briefDocument?.content) {
      return data(
        { error: "기획서 내용이 없습니다. 먼저 기획서를 생성해주세요." },
        { status: 400 }
      );
    }

    await saveStepData(client, {
      projectId,
      stepKey: "brief",
      data: {
        content: briefDocument.content,
        metadata: {},
      },
    });

    // brief 단계를 completed로 변경
    await updateProjectStep(client, projectId, "brief", "completed");

    // script 단계를 in_progress로 시작
    await updateProjectStep(client, projectId, "script", "in_progress");

    // n8n 웹훅 호출 (스크립트 생성 시작)
    await triggerProjectStepStartWebhook({
      project_id: projectId,
      step_key: "script",
      step_status: "in_progress",
      started_at: new Date().toISOString(),
    });

    return data({ success: true, message: "기획서가 제출되었습니다." });
  } catch (error) {
    console.error("기획서 제출 실패:", error);
    return data(
      {
        error:
          error instanceof Error
            ? error.message
            : "기획서 제출에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
