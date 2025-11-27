/**
 * 유튜브 업로드 Action
 * 유튜브 업로드를 요청하고 step6 웹훅을 호출합니다.
 */

import { type ActionFunctionArgs, data } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { triggerShortWorkflowStepSixWebhook } from "~/lib/n8n-webhook";
import { getProjectWorkspaceData } from "../queries";
import { getShortWorkflowJobsByProject } from "../short-workflow";
import type { ShortWorkflowJobRecord } from "../short-workflow";

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

    // 워크스페이스 데이터 조회
    const workspaceData = await getProjectWorkspaceData(client, projectId);
    const projectRowId = workspaceData?.project?.id;
    
    if (!projectRowId) {
      return data(
        { error: "프로젝트 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 기획서 완료 시 선택된 job 찾기 (status가 wait가 아닌 job)
    const { getLoggedInProfileId } = await import("~/features/users/queries");
    const ownerProfileId = await getLoggedInProfileId(client);
    const shortWorkflowJobs = await getShortWorkflowJobsByProject(client, {
      projectRowId,
      ownerProfileId,
      limit: 5,
    });
    const selectedJob = shortWorkflowJobs.find(
      (job) => job.status !== "wait"
    ) as ShortWorkflowJobRecord | undefined;

    // 웹훅 호출
    if (selectedJob) {
      try {
        await triggerShortWorkflowStepSixWebhook(selectedJob);
        console.log("✅ n8n step6 웹훅 호출 완료");
      } catch (error) {
        console.error("❌ n8n step6 웹훅 호출 실패:", error);
        return data(
          {
            error: "유튜브 업로드 요청에 실패했습니다.",
          },
          { status: 500 }
        );
      }
    } else {
      console.warn(
        "⚠️ [youtube-upload] status가 'wait'가 아닌 job을 찾을 수 없어 step6 웹훅을 호출하지 않습니다.",
        { jobsCount: shortWorkflowJobs.length, jobs: shortWorkflowJobs.map(j => ({ id: j.id, status: j.status })) }
      );
      return data(
        {
          error: "업로드할 영상을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    return data({ success: true, message: "유튜브 업로드가 요청되었습니다." });
  } catch (error) {
    console.error("유튜브 업로드 요청 실패:", error);
    return data(
      {
        error:
          error instanceof Error ? error.message : "유튜브 업로드 요청에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

