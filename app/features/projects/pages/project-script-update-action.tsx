/**
 * 스크립트 수정 Action
 * 스크립트를 수정하고 n8n 웹훅을 재호출합니다.
 */

import { type ActionFunctionArgs, data } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { getProjectByProjectId } from "../queries";
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
    const contentStr = formData.get("content") as string;

    if (!contentStr) {
      return data({ error: "스크립트 내용을 입력해주세요." }, { status: 400 });
    }

    // JSON 배열로 파싱 시도, 실패하면 문자열로 처리
    let content: string | string[];
    try {
      const parsed = JSON.parse(contentStr);
      if (Array.isArray(parsed)) {
        content = parsed;
      } else {
        content = contentStr;
      }
    } catch {
      content = contentStr;
    }

    // 프로젝트 문서 업데이트
    const project = await getProjectByProjectId(client, projectId);
    if (!project) {
      return data({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
    }

    // 기존 문서 찾기 또는 생성
    const { data: existingDoc } = await client
      .from("project_documents")
      .select("id")
      .eq("project_id", project.id)
      .eq("type", "script")
      .single();

    const contentValue = Array.isArray(content)
      ? JSON.stringify(content)
      : content;

    if (existingDoc) {
      // 기존 문서 업데이트
      const { error: updateError } = await client
        .from("project_documents")
        .update({
          content: contentValue,
          content_json: Array.isArray(content) ? content : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingDoc.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      // 새 문서 생성
      const { error: insertError } = await client
        .from("project_documents")
        .insert({
          project_id: project.id,
          type: "script",
          content: contentValue,
          content_json: Array.isArray(content) ? content : null,
          status: "draft",
        });

      if (insertError) {
        throw insertError;
      }
    }

    // script 단계를 in_progress로 변경 (재생성 시작)
    await updateProjectStep(client, projectId, "script", "in_progress", {
      updated_content: contentValue,
      regenerated_at: new Date().toISOString(),
    });

    // n8n 웹훅 재호출 (스크립트 재생성)
    await triggerProjectStepStartWebhook({
      project_id: projectId,
      step_key: "script",
      step_status: "in_progress",
      started_at: new Date().toISOString(),
      metadata: {
        action: "regenerate",
        content: contentValue,
      },
    });

    return data({ success: true, message: "스크립트 수정이 완료되었습니다." });
  } catch (error) {
    console.error("스크립트 수정 실패:", error);
    return data(
      {
        error:
          error instanceof Error
            ? error.message
            : "스크립트 수정에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
