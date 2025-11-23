import { z } from "zod";
import { redirect } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import type { Route } from "./+types/social-complete-page";

export const meta: Route.MetaFunction = () => {
  return [{ title: "소셜 로그인 완료 - 든든AI" }];
};

// 지원하는 소셜 프로바이더
const paramsSchema = z.object({
  provider: z.enum(["google", "kakao", "github"]),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  // 1. provider 파라미터 검증
  const { success } = paramsSchema.safeParse(params);
  if (!success) {
    // 잘못된 provider인 경우 로그인 페이지로 리다이렉트
    return redirect("/auth/login");
  }

  // 2. URL에서 인증 코드 추출
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  // OAuth 에러가 있는 경우
  if (error) {
    console.error("OAuth 에러:", error, errorDescription);
    // 에러와 함께 로그인 페이지로 리다이렉트
    return redirect(`/auth/login?error=${encodeURIComponent(error)}`);
  }

  // 인증 코드가 없는 경우
  if (!code) {
    console.error("인증 코드가 없습니다.");
    return redirect("/auth/login?error=no_code");
  }

  // 3. SSR 클라이언트 생성 (쿠키 처리 포함)
  const { client, headers } = makeSSRClient(request);

  // 4. 인증 코드를 세션으로 교환
  try {
    const { data, error: exchangeError } =
      await client.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error(`[${params.provider}] 세션 교환 실패:`, exchangeError);
      console.error("에러 상세:", {
        message: exchangeError.message,
        status: exchangeError.status,
        provider: params.provider,
        code: code ? "있음" : "없음",
      });
      // 세션 교환 실패 시 로그인 페이지로 리다이렉트
      return redirect(
        `/auth/login?error=${encodeURIComponent(exchangeError.message || "session_exchange_failed")}`
      );
    }

    console.log(`[${params.provider}] 세션 교환 성공:`, {
      user: data?.user?.id,
      session: data?.session ? "생성됨" : "없음",
    });

    // 5. 성공 시 홈으로 리다이렉트 (세션 쿠키 포함)
    return redirect("/", { headers });
  } catch (err) {
    console.error(`[${params.provider}] 세션 교환 중 예외 발생:`, err);
    const errorMessage =
      err instanceof Error ? err.message : "세션 교환 중 오류가 발생했습니다.";
    return redirect(`/auth/login?error=${encodeURIComponent(errorMessage)}`);
  }
};

// 이 페이지는 loader에서 리다이렉트되므로 실제로 렌더링되지 않습니다
export default function SocialCompletePage() {
  return null;
}

