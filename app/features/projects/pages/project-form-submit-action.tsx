import { type ActionFunctionArgs, data } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { getProjectByProjectId } from "../queries";
import { updateProjectStep } from "../mutations";
import { saveProjectMessage } from "../queries";
import { triggerProjectStepStartWebhook } from "~/lib/n8n-webhook";
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

    await saveProjectMessage(client, {
      projectId,
      role: "assistant",
      content: "폼 응답을 확인했습니다. 기획서 작성을 시작하겠습니다.",
      stepKey: "brief",
      metadata: {
        isFormResponse: true,
      },
    });

    await updateProjectStep(client, projectId, "brief", "in_progress", {
      formData: formDataObj,
      started_at: new Date().toISOString(),
    });

    await triggerProjectStepStartWebhook({
      project_id: projectId,
      step_key: "brief",
      step_status: "in_progress",
      started_at: new Date().toISOString(),
      metadata: {
        formData: formDataObj,
        shortWorkflowKeyword,
      },
      shortWorkflowKeyword,
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
