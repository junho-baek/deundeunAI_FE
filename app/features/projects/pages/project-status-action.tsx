/**
 * 프로젝트 단계 상태 업데이트를 위한 Action 함수
 * 
 * 이 파일은 프로젝트 단계 상태를 업데이트하기 위한 action 함수를 제공합니다.
 * 프로젝트 ID와 단계 키를 기반으로 상태를 POST하고 업데이트합니다.
 */

import { type ActionFunctionArgs, data } from "react-router";
import { updateProjectStep, getProjectByProjectId } from "../queries";
import { makeSSRClient } from "~/lib/supa-client";
import { triggerProjectStepStartWebhook } from "~/lib/n8n-webhook";
import { calculateStepCredits } from "~/features/users/services/credit-calculator";
import { deductCreditsRPC, getCreditBalance } from "~/features/users/queries";

export async function updateStepStatusAction({ request, params }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  const { client } = makeSSRClient(request);
  const projectId = params.projectId;
  if (!projectId || projectId === "create") {
    return data({ error: "Invalid project ID" }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const stepKey = formData.get("stepKey") as string;
    const status = formData.get("status") as string;
    const metadataStr = formData.get("metadata");

    if (!stepKey || !status) {
      return data(
        { error: "stepKey and status are required" },
        { status: 400 }
      );
    }

    // 유효한 stepKey인지 확인
    const validStepKeys = [
      "brief",
      "script",
      "narration",
      "images",
      "videos",
      "final",
      "distribution",
    ];
    if (!validStepKeys.includes(stepKey)) {
      return data({ error: "Invalid stepKey" }, { status: 400 });
    }

    // 유효한 status인지 확인
    const validStatuses = ["pending", "in_progress", "blocked", "completed"];
    if (!validStatuses.includes(status)) {
      return data({ error: "Invalid status" }, { status: 400 });
    }

    // metadata 파싱 (선택사항)
    let metadata: Record<string, unknown> | undefined;
    if (metadataStr && typeof metadataStr === "string") {
      try {
        metadata = JSON.parse(metadataStr);
      } catch (e) {
        console.warn("Failed to parse metadata:", e);
      }
    }

    // 단계가 in_progress로 시작될 때 크레딧 차감
    if (status === "in_progress") {
      // 1. 프로젝트 소유자 확인
      const project = await getProjectByProjectId(client, projectId);
      if (!project) {
        return data({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
      }

      // 2. 필요한 크레딧 계산
      const requiredCredits = calculateStepCredits(
        stepKey as any,
        metadata
      );

      // 3. 현재 크레딧 잔액 확인
      const currentBalance = await getCreditBalance(
        client,
        project.owner_profile_id
      );

      // 4. 크레딧 부족 시 처리
      if (currentBalance === null || currentBalance < requiredCredits) {
        // 후불 크레딧 요청 또는 충전 안내
        const { data: billingPlan } = await client
          .from("profile_billing_plans")
          .select("monthly_credits, credit_overage_rate")
          .eq("profile_id", project.owner_profile_id)
          .single();

        const monthlyCredits = billingPlan?.monthly_credits || 0;
        const hasPostpaidOption = billingPlan?.credit_overage_rate !== null;

        // 후불 옵션이 있으면 후불 요청, 없으면 충전 안내
        if (hasPostpaidOption) {
          // 후불 크레딧 요청
          const { data: postpaidResult, error: postpaidError } = await client.rpc(
            "request_postpaid_credits",
            {
              p_profile_id: project.owner_profile_id,
              p_amount: requiredCredits,
              p_project_id: projectId,
              p_step_key: stepKey,
              p_description: `프로젝트 "${project.title}"의 ${stepKey} 단계 실행을 위한 후불 크레딧 요청`,
              p_metadata: {
                ...metadata,
                project_title: project.title,
                monthly_credits: monthlyCredits,
              },
            }
          );

          if (postpaidError) {
            return data(
              {
                error: "후불 크레딧 요청에 실패했습니다. 크레딧을 충전해주세요.",
                creditBalance: currentBalance,
                requiredCredits,
                rechargeUrl: "/pricing",
              },
              { status: 400 }
            );
          }

          // 후불 요청 성공 시 워크플로우 진행 (크레딧은 나중에 지급)
          // 크레딧 사용 내역 기록 (status: pending)
          await client.from("profile_credit_usages").insert({
            profile_id: project.owner_profile_id,
            project_id: projectId,
            step_key: stepKey,
            credits_used: requiredCredits,
            status: "pending", // 후불 요청 상태
            started_at: new Date().toISOString(),
            metadata: {
              ...metadata,
              postpaid_request: true,
              request_id: postpaidResult?.request_id,
            },
          });
        } else {
          // 후불 옵션이 없으면 충전 안내
          return data(
            {
              error: `크레딧이 부족합니다. 필요: ${requiredCredits}, 보유: ${currentBalance || 0}`,
              creditBalance: currentBalance,
              requiredCredits,
              rechargeUrl: "/pricing",
            },
            { status: 400 }
          );
        }
      } else {
        // 크레딧 충분 시 정상 차감
        const creditResult = await deductCreditsRPC(client, {
          profileId: project.owner_profile_id,
          amount: requiredCredits,
          description: `프로젝트 "${project.title}"의 ${stepKey} 단계 실행`,
          relatedProjectId: projectId,
          relatedStepKey: stepKey,
          metadata: {
            ...metadata,
            project_title: project.title,
          },
        });

        if (!creditResult.success) {
          return data(
            {
              error: creditResult.error || "크레딧 차감에 실패했습니다.",
              creditBalance: creditResult.balance,
              requiredCredits,
            },
            { status: 400 }
          );
        }

        // 크레딧 사용 내역 기록
        await client.from("profile_credit_usages").insert({
          profile_id: project.owner_profile_id,
          project_id: projectId,
          step_key: stepKey,
          credits_used: requiredCredits,
          status: "processing",
          started_at: new Date().toISOString(),
          metadata: {
            ...metadata,
            balance_after: creditResult.balance,
            transaction_id: creditResult.transaction_id,
          },
        });
      }
    }

    const updatedStep = await updateProjectStep(
      client,
      projectId,
      stepKey as any,
      status as any,
      metadata
    );

    // 단계가 in_progress로 시작될 때 n8n 워크플로우 트리거
    if (status === "in_progress") {
      triggerProjectStepStartWebhook({
        project_id: projectId,
        step_key: stepKey,
        step_status: status,
        started_at: updatedStep.started_at || new Date().toISOString(),
      }).catch((error) => {
        console.error("n8n 웹훅 호출 실패 (상태 업데이트는 계속 진행):", error);
      });
    }

    return data({ success: true, step: updatedStep });
  } catch (error) {
    console.error("프로젝트 단계 상태 업데이트 실패:", error);
    return data(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

