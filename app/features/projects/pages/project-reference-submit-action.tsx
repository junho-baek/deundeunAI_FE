import { type ActionFunctionArgs, data } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { getProjectByProjectId } from "../queries";
import { saveProjectMessage } from "../queries";
import { upsertShortWorkflowKeyword } from "../short-workflow";

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  const projectId = params.projectId;
  if (!projectId || projectId === "create") {
    return data({ error: "잘못된 프로젝트입니다." }, { status: 400 });
  }

  const { client } = makeSSRClient(request);

  try {
    await getLoggedInUserId(client);

    const formData = await request.formData();
    const referenceRaw = (formData.get("reference") as string | null) ?? "";
    const reference = referenceRaw.trim();

    if (reference.length < 20) {
      return data(
        {
          error: "참고 자료는 최소 20자 이상 입력해주세요.",
        },
        { status: 400 }
      );
    }

    const project = await getProjectByProjectId(client, projectId);
    if (!project) {
      return data({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
    }

    const keyword =
      (project.metadata as Record<string, unknown> | null | undefined)?.keyword;

    const shortWorkflowKeyword = await upsertShortWorkflowKeyword(client, {
      projectRowId: project.id,
      ownerProfileId: project.owner_profile_id,
      keyword: typeof keyword === "string" && keyword.trim().length > 0
        ? keyword
        : project.title,
      reference,
    });

    const updatedMetadata = {
      ...((project.metadata as Record<string, unknown> | null) ?? {}),
      reference,
    };

    await client
      .from("projects")
      .update({
        metadata: updatedMetadata,
        updated_at: new Date().toISOString(),
      })
      .eq("id", project.id);

    await saveProjectMessage(client, {
      projectId,
      role: "user",
      content: reference,
      stepKey: "brief",
      metadata: {
        isReferenceSubmission: true,
        reference,
      },
    });

    await saveProjectMessage(client, {
      projectId,
      role: "assistant",
      content: "참고 자료를 확인했습니다. 카테고리와 이미지 모델을 선택해주세요.",
      stepKey: "brief",
      metadata: {
        acknowledgesReference: true,
      },
    });

    return data({
      success: true,
      reference,
      shortWorkflowKeyword,
    });
  } catch (error) {
    console.error("참고 자료 제출 실패:", error);
    return data(
      {
        error:
          error instanceof Error
            ? error.message
            : "참고 자료 제출에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
