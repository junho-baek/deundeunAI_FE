import { type ActionFunctionArgs, data } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { getProjectByProjectId } from "../queries";
import { updateProjectStep } from "../mutations";
import { saveProjectMessage } from "../queries";
import { triggerProjectStartWebhook } from "~/lib/n8n-webhook";
import { upsertShortWorkflowKeyword } from "../short-workflow";

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

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("form_")) {
        const fieldName = key.replace("form_", "");
        if (!formDataObj[fieldName]) {
          formDataObj[fieldName] = [];
        }
        formDataObj[fieldName].push(value as string);
      }
    }

    const project = await getProjectByProjectId(client, projectId);
    if (!project) {
      return data({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
    }

    const formDataStr = JSON.stringify(formDataObj, null, 2);
    const metadata = (project.metadata ?? {}) as Record<string, unknown>;
    const reference =
      typeof metadata.reference === "string" ? metadata.reference : undefined;
    const workflowStartedAt =
      typeof metadata.workflow_started_at === "string"
        ? (metadata.workflow_started_at as string)
        : undefined;
    const keywordSource =
      typeof metadata.keyword === "string"
        ? metadata.keyword
        : formDataObj.keyword?.[0] || project.title || "";
    const keyword = keywordSource.trim();

    const category = formDataObj.category?.[0];
    const imageModel =
      formDataObj.image_model?.[0] ||
      (typeof metadata.image_model === "string"
        ? (metadata.image_model as string)
        : undefined);

    if (!category || !imageModel) {
      return data(
        { error: "카테고리와 이미지 모델을 모두 선택해주세요." },
        { status: 400 }
      );
    }

    const shortWorkflowKeyword = await upsertShortWorkflowKeyword(client, {
      projectRowId: project.id,
      ownerProfileId: project.owner_profile_id,
      keyword,
      category,
      imageModel,
    });

    const nowIso = new Date().toISOString();
    const updatedMetadata = {
      ...metadata,
      reference,
      category,
      image_model: imageModel,
      formData: formDataObj,
      workflow_started_at: workflowStartedAt ?? nowIso,
    };

    await client
      .from("projects")
      .update({
        metadata: updatedMetadata,
        updated_at: nowIso,
      })
      .eq("id", project.id);

    // 사용자 메시지는 저장하지 않음 (AI가 자동으로 처리)
    // 폼 데이터는 metadata에 저장되어 있으므로 별도 메시지 불필요

    await saveProjectMessage(client, {
      projectId,
      role: "assistant",
      content: "입력해 주신 정보를 확인했습니다. 기획서 작성을 시작하겠습니다.",
      stepKey: "brief",
      metadata: {
        isFormResponse: true,
        formData: formDataObj, // 폼 데이터를 assistant 메시지에 포함
      },
    });

    await updateProjectStep(client, projectId, "brief", "in_progress", {
      formData: formDataObj,
      started_at: nowIso,
    });

    if (!workflowStartedAt) {
      try {
        await triggerProjectStartWebhook({
          project_id: project.project_id,
          project_title: project.title,
          owner_profile_id: project.owner_profile_id,
          status: project.status,
          created_at: project.created_at,
          metadata: {
            ...updatedMetadata,
            formData: formDataObj,
          },
          shortWorkflowKeyword,
        });
        console.log("n8n 프로젝트 시작 웹훅 호출 완료");
      } catch (error) {
        console.error(
          "n8n 프로젝트 시작 웹훅 호출 실패 (폼 제출은 유지):",
          error
        );
        // 웹훅 실패해도 폼 제출은 성공으로 처리
      }
    } else {
      console.log("워크플로우가 이미 시작되어 웹훅 호출을 건너뜁니다.");
    }

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
