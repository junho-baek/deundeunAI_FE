/**
 * 대사 재생성 Action
 * 대사를 재생성하기 위해 n8n 웹훅을 호출합니다.
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

    // narration 단계를 in_progress로 변경 (재생성 시작)
    await updateProjectStep(client, projectId, "narration", "in_progress", {
      regenerated_at: new Date().toISOString(),
    });

    // n8n 웹훅 재호출 (대사 재생성)
    await triggerProjectStepStartWebhook({
      project_id: projectId,
      step_key: "narration",
      step_status: "in_progress",
      started_at: new Date().toISOString(),
      metadata: {
        action: "regenerate",
      },
    });

    return data({ success: true, message: "대사 재생성이 시작되었습니다." });
  } catch (error) {
    console.error("대사 재생성 실패:", error);
    return data(
      {
        error:
          error instanceof Error
            ? error.message
            : "대사 재생성에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
