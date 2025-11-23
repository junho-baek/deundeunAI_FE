/**
 * 스크립트 제출 Action
 * 스크립트를 제출하고 다음 단계(narration)로 진행합니다.
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

    // 현재 워크스페이스 데이터에서 대본 내용 가져오기
    const workspaceData = await getProjectWorkspaceData(client, projectId);
    const scriptDocument = workspaceData?.documents?.find(
      (doc) => doc.type === "script"
    );

    // 대본 데이터를 DB에 저장
    if (scriptDocument) {
      const contentJson = scriptDocument.content_json || [];
      // content가 있으면 단락으로 분리
      const paragraphs =
        contentJson.length > 0
          ? contentJson
          : scriptDocument.content
          ? scriptDocument.content.split("\n\n").filter((p) => p.trim())
          : [];

      await saveStepData(client, {
        projectId,
        stepKey: "script",
        data: {
          content: scriptDocument.content || undefined,
          contentJson: paragraphs.length > 0 ? paragraphs : undefined,
          metadata: {},
        },
      });
    }

    // script 단계를 completed로 변경
    await updateProjectStep(client, projectId, "script", "completed");

    // narration 단계를 in_progress로 시작
    await updateProjectStep(client, projectId, "narration", "in_progress");

    // n8n 웹훅 호출 (대사 생성 시작)
    await triggerProjectStepStartWebhook({
      project_id: projectId,
      step_key: "narration",
      step_status: "in_progress",
      started_at: new Date().toISOString(),
    });

    return data({ success: true, message: "스크립트가 제출되었습니다." });
  } catch (error) {
    console.error("스크립트 제출 실패:", error);
    return data(
      {
        error:
          error instanceof Error
            ? error.message
            : "스크립트 제출에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
