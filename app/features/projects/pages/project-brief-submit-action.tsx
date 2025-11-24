/**
 * 기획서 제출 Action
 * 기획서를 제출하고 다음 단계(script)로 진행합니다.
 */

import { type ActionFunctionArgs, data } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { updateProjectStep } from "../mutations";
import { triggerShortWorkflowStepTwoWebhook } from "~/lib/n8n-webhook";
import { getProjectWorkspaceData, saveStepData } from "../queries";
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

    const formData = await request.formData();
    const formEntries = Array.from(formData.entries()).reduce<Record<string, unknown>>(
      (acc, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      {}
    );
    const shortWorkflowJobIdRaw = formData.get("shortWorkflowJobId");
    const shortWorkflowJobId =
      typeof shortWorkflowJobIdRaw === "string"
        ? Number(shortWorkflowJobIdRaw)
        : NaN;

    console.log(
      "👉 [Step 1] Parsed ID:",
      shortWorkflowJobId,
      "Type:",
      typeof shortWorkflowJobId,
      "IsFinite:",
      Number.isFinite(shortWorkflowJobId)
    );

    const briefContentFromForm = formData.get("briefContent");
    const normalizedBriefContent =
      typeof briefContentFromForm === "string"
        ? briefContentFromForm.trim()
        : "";

    if (!Number.isFinite(shortWorkflowJobId)) {
      console.warn(
        "[brief-submit] invalid shortWorkflowJobId payload:",
        shortWorkflowJobIdRaw
      );
      console.warn("❌ [Step 1 Fail] ID 유효성 검사 탈락");
      return data(
        {
          error:
            "적용할 기획서를 찾지 못했습니다. 잠시 후 다시 시도하거나 페이지를 새로고침해주세요.",
        },
        { status: 400 }
      );
    }

    // 현재 워크스페이스 데이터에서 기획서 내용 가져오기
    const workspaceData = await getProjectWorkspaceData(client, projectId);
    const projectRowId = workspaceData?.project?.id;
    console.log("👉 [Step 2] Project Row ID:", projectRowId);
    if (!projectRowId) {
      return data(
        { error: "프로젝트 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const briefDocument = workspaceData?.documents?.find(
      (doc) => doc.type === "brief"
    );

    const finalBriefContent =
      normalizedBriefContent.length > 0
        ? normalizedBriefContent
        : briefDocument?.content;

    // 기획서 데이터를 DB에 저장 (없으면 에러 반환)
    if (!finalBriefContent) {
      return data(
        { error: "기획서 내용이 없습니다. 먼저 기획서를 생성해주세요." },
        { status: 400 }
      );
    }

    const { data: jobRecord, error: jobSelectError } = await client
      .from("short_workflow_jobs")
      .select("*")
      .eq("id", shortWorkflowJobId)
      .eq("project_id", projectRowId)
      .single();
    console.log(
      "👉 [Step 3] Job Record Found:",
      jobRecord ? "YES" : "NO",
      jobSelectError ? jobSelectError.message : null
    );

    if (jobSelectError || !jobRecord) {
      return data(
        { error: "선택한 기획서를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const { data: reservedJob, error: jobUpdateError } = await client
      .from("short_workflow_jobs")
      .update({
        status: "reserve",
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobRecord.id)
      .select("*")
      .single();

    if (jobUpdateError || !reservedJob) {
      throw jobUpdateError || new Error("기획서 상태 업데이트에 실패했습니다.");
    }

    triggerShortWorkflowStepTwoWebhook(reservedJob as ShortWorkflowJobRecord).catch(
      (error) => {
        console.error("n8n step2 웹훅 호출 실패:", error);
      }
    );

    await saveStepData(client, {
      projectId,
      stepKey: "brief",
      data: {
        content: finalBriefContent,
        metadata: {},
      },
    });

    // brief 단계를 completed로 변경
    await updateProjectStep(client, projectId, "brief", "completed");

    // script 단계를 in_progress로 시작
    await updateProjectStep(client, projectId, "script", "in_progress");

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
