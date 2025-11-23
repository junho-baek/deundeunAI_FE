/**
 * 프로젝트 배포 Action 함수
 * 프로젝트를 배포하고 상태를 "completed"로 변경합니다.
 */

import { type ActionFunctionArgs, data } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { getProjectByProjectId, getProjectWorkspaceData } from "../queries";
import { updateProject, updateProjectStep } from "../mutations";
import { saveStepData } from "../queries";

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

    // 프로젝트 확인
    const project = await getProjectByProjectId(client, projectId);
    if (!project) {
      return data({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
    }

    // 현재 워크스페이스 데이터에서 최종 비디오 URL 가져오기
    const workspaceData = await getProjectWorkspaceData(client, projectId);
    const finalVideoUrl = workspaceData?.project?.video_url;

    // 최종 비디오 데이터를 DB에 저장
    if (finalVideoUrl) {
      await saveStepData(client, {
        projectId,
        stepKey: "final",
        data: {
          videoUrl: finalVideoUrl,
          metadata: {},
        },
      });
    }

    // final 단계를 completed로 변경
    await updateProjectStep(client, projectId, "final", "completed");

    // distribution 단계를 completed로 변경
    await updateProjectStep(client, projectId, "distribution", "completed");

    // 프로젝트 상태를 "completed"로 변경
    await updateProject(client, projectId, {
      status: "completed",
      published_at: new Date().toISOString(),
    });

    return data({
      success: true,
      message: "프로젝트가 배포되었습니다.",
    });
  } catch (error) {
    console.error("프로젝트 배포 실패:", error);
    return data(
      {
        error:
          error instanceof Error
            ? error.message
            : "프로젝트 배포에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
