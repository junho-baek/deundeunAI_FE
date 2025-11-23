/**
 * 구독 Action 함수
 * 구독 플랜 생성 및 크레딧 지급을 처리합니다.
 */

import { type ActionFunctionArgs, data, redirect } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInProfileId, grantCreditsRPC } from "~/features/users/queries";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "~/lib/supa-client";

// 플랜별 크레딧 설정
const PLAN_CREDITS: Record<string, number> = {
  "시니어 스타터": 0,
  "든든 수익 보장 플랜": 10000, // 매달 10,000 크레딧
  "스튜디오 팀": 50000, // 매달 50,000 크레딧
};

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  const { client } = makeSSRClient(request);

  // 로그인한 사용자의 프로필 ID 가져오기 (인증 체크 포함)
  let profileId: string;
  try {
    profileId = await getLoggedInProfileId(client);
  } catch (error) {
    // getLoggedInProfileId는 redirect를 throw하거나 에러를 throw함
    if (error && typeof error === "object" && "status" in error) {
      throw error; // redirect 에러는 그대로 전파
    }
    // Rate limit 에러인 경우 재시도하지 않도록 처리
    if (error && typeof error === "object" && ("status" in error && (error as any).status === 429 || "code" in error && (error as any).code === "over_request_rate_limit")) {
      console.error("Rate limit 도달 - 프로필 조회 실패:", error);
      return data(
        { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
        { status: 429 }
      );
    }
    return data(
      { error: error instanceof Error ? error.message : "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  try {

    const formData = await request.formData();
    const planName = formData.get("planName") as string;
    const planPrice = formData.get("planPrice") as string;
    const planInterval = formData.get("planInterval") as string || "monthly";

    if (!planName) {
      return data({ error: "플랜 이름이 필요합니다." }, { status: 400 });
    }

    // 크레딧 계산
    const monthlyCredits = PLAN_CREDITS[planName] || 0;

    // 구독 플랜 생성 또는 업데이트
    const { data: existingPlan, error: planError } = await client
      .from("profile_billing_plans")
      .select("*")
      .eq("profile_id", profileId)
      .single();

    if (planError && planError.code !== "PGRST116") {
      console.error("구독 플랜 조회 실패:", planError);
    }

    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1); // 다음 달 갱신일

    if (existingPlan) {
      // 기존 플랜 업데이트
      const { error: updateError } = await client
        .from("profile_billing_plans")
        .update({
          plan_name: planName,
          price_label: planPrice,
          monthly_credits: monthlyCredits,
          renewal_date: renewalDate.toISOString().split("T")[0],
          updated_at: new Date().toISOString(),
        })
        .eq("profile_id", profileId);

      if (updateError) {
        console.error("구독 플랜 업데이트 실패:", updateError);
        return data(
          { error: "구독 플랜 업데이트에 실패했습니다." },
          { status: 500 }
        );
      }
    } else {
      // 새 플랜 생성
      const { error: insertError } = await client
        .from("profile_billing_plans")
        .insert({
          profile_id: profileId,
          plan_name: planName,
          price_label: planPrice,
          monthly_credits: monthlyCredits,
          interval: planInterval as any,
          renewal_date: renewalDate.toISOString().split("T")[0],
        });

      if (insertError) {
        console.error("구독 플랜 생성 실패:", insertError);
        return data(
          { error: "구독 플랜 생성에 실패했습니다." },
          { status: 500 }
        );
      }
    }

    // 크레딧 지급 (매달 지급되는 크레딧)
    if (monthlyCredits > 0) {
      const creditResult = await grantCreditsRPC(client, {
        profileId: profileId,
        amount: monthlyCredits,
        description: `${planName} 구독에 따른 월간 크레딧 지급`,
        metadata: {
          plan_name: planName,
          renewal_date: renewalDate.toISOString(),
          interval: planInterval,
        },
      });

      if (!creditResult.success) {
        console.error("크레딧 지급 실패:", creditResult.error);
        // 크레딧 지급 실패해도 구독은 성공으로 처리 (나중에 수동 지급 가능)
      }
    }

    // 프로필의 크레딧 월간 지급량 업데이트
    await client
      .from("profiles")
      .update({
        credit_monthly_amount: monthlyCredits,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId);

    // 성공 시 대시보드로 리다이렉트
    return redirect("/my/dashboard");
  } catch (error) {
    console.error("구독 처리 중 오류:", error);
    return data(
      {
        error:
          error instanceof Error
            ? error.message
            : "구독 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

