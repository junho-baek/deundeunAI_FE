/**
 * 기획서 제출 Action
 * 기획서를 제출하고 다음 단계(script)로 진행합니다.
 */

import { type ActionFunctionArgs, data } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { updateProjectStep } from "../mutations";
import { triggerShortWorkflowStepTwoWebhook } from "~/lib/n8n-webhook";
import { getProjectWorkspaceData, getProjectSteps, saveStepData } from "../queries";
import type { ShortWorkflowJobRecord } from "../short-workflow";
import {
  briefFormValuesFromFormData,
  briefFormValuesToMetadata,
  buildBriefMarkdownFromFields,
  deriveBriefFormValuesFromJob,
  emptyProjectBriefFormValues,
} from "../utils/brief-form";

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
    const requestFormValues = briefFormValuesFromFormData(formData);
    const hasCustomFormPayload = Object.values(requestFormValues).some((value) =>
      typeof value === "number"
        ? Number.isFinite(value)
        : Boolean(value && value.toString().trim())
    );

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

    const projectSteps = await getProjectSteps(client, projectId);
    const briefStep = projectSteps.find((step) => step.key === "brief");
    if (briefStep?.status === "completed") {
      console.log("⚠️ [brief-submit] 기획서가 이미 완료되어 있습니다. 웹훅을 호출하지 않습니다.", {
        briefStatus: briefStep.status,
        narrationStatus: projectSteps.find((step) => step.key === "narration")?.status,
      });
      return data({
        success: true,
        alreadyCompleted: true,
        message: "이미 확정된 기획서입니다.",
      });
    }

    const briefDocument = workspaceData?.documents?.find(
      (doc) => doc.type === "brief"
    );

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

    const jobFormValues =
      deriveBriefFormValuesFromJob(reservedJob as ShortWorkflowJobRecord) ??
      emptyProjectBriefFormValues;
    const formValuesForStorage = hasCustomFormPayload
      ? requestFormValues
      : jobFormValues;
    const metadataPayload = briefFormValuesToMetadata(formValuesForStorage);
    const generatedBriefContent = buildBriefMarkdownFromFields(
      formValuesForStorage
    );
    const finalBriefContent =
      normalizedBriefContent && normalizedBriefContent.length > 0
        ? normalizedBriefContent
        : generatedBriefContent || briefDocument?.content || "";

    if (!finalBriefContent || !finalBriefContent.trim()) {
      return data(
        { error: "기획서 내용이 없습니다. 먼저 기획서를 생성해주세요." },
        { status: 400 }
      );
    }

    // DB 업데이트 먼저 (트랜잭션 순서 개선)
    await saveStepData(client, {
      projectId,
      stepKey: "brief",
      data: {
        content: finalBriefContent,
        metadata: metadataPayload,
      },
    });
    await updateProjectStep(client, projectId, "brief", "completed");
    await updateProjectStep(client, projectId, "narration", "in_progress");

    // 웹훅 호출 (마지막에, 실패해도 DB는 이미 업데이트됨)
    try {
      console.log("👉 [brief-submit] step2 웹훅 호출 시작:", {
        jobId: reservedJob.id,
        jobStatus: reservedJob.status,
      });
      await triggerShortWorkflowStepTwoWebhook(reservedJob as ShortWorkflowJobRecord);
      console.log("✅ [brief-submit] step2 웹훅 호출 완료");
    } catch (error) {
      console.error("❌ [brief-submit] n8n step2 웹훅 호출 실패:", error);
      // 웹훅 실패해도 DB는 이미 업데이트되었으므로 계속 진행
    }

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
