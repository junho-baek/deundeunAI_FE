import { z } from "zod";
import { redirect } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import type { Route } from "./+types/social-start-page";

export const meta: Route.MetaFunction = () => {
  return [{ title: "소셜 로그인 - 든든AI" }];
};

// 지원하는 소셜 프로바이더
const paramsSchema = z.object({
  provider: z.enum(["google", "kakao", "github"]),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  // 1. provider 파라미터 검증
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    // 잘못된 provider인 경우 로그인 페이지로 리다이렉트
    return redirect("/auth/login");
  }

  const { provider } = data;

  // 2. 콜백 URL 설정
  // 개발 환경과 프로덕션 환경을 자동으로 감지
  const url = new URL(request.url);
  const protocol = url.protocol; // http: 또는 https:
  const host = url.host; // localhost:5173 또는 yourdomain.com
  const redirectTo = `${protocol}//${host}/auth/social/${provider}/complete`;

  // 3. SSR 클라이언트 생성 (쿠키 처리 포함)
  const { client, headers } = makeSSRClient(request);

  // 4. OAuth URL 생성 및 리다이렉트
  // Provider별로 다른 옵션 설정
  const oauthOptions: {
    redirectTo: string;
    queryParams?: Record<string, string>;
    scopes?: string;
  } = {
    redirectTo,
  };

  // Google OAuth는 추가 스코프 설정 필요
  if (provider === "google") {
    oauthOptions.queryParams = {
      access_type: "offline",
      prompt: "consent",
    };
  }

  // Kakao OAuth는 이메일 스코프 제외 (이메일 동의 항목 없이도 작동)
  if (provider === "kakao") {
    // 카카오 기본 스코프만 사용 (이메일 제외)
    // profile_nickname: 닉네임 (필수)
    // profile_image: 프로필 사진 (선택)
    // account_email은 제외하여 이메일 동의 항목 없이도 작동
    oauthOptions.scopes = "profile_nickname profile_image";
    // queryParams로도 스코프 제어 시도 (Supabase가 지원하는 경우)
    oauthOptions.queryParams = {
      scope: "profile_nickname profile_image",
    };
  }
  // GitHub는 기본 설정만 사용

  try {
    const {
      data: { url: oauthUrl },
      error,
    } = await client.auth.signInWithOAuth({
      provider,
      options: oauthOptions,
    });

    if (error) {
      console.error(`[${provider}] OAuth 시작 실패:`, error);
      console.error("에러 상세:", {
        message: error.message,
        status: error.status,
        provider,
        redirectTo: oauthOptions.redirectTo,
      });
      // 에러와 함께 로그인 페이지로 리다이렉트
      return redirect(
        `/auth/login?error=${encodeURIComponent(error.message || "oauth_failed")}`
      );
    }

    if (oauthUrl) {
      // OAuth URL로 리다이렉트 (쿠키 헤더 포함)
      return redirect(oauthUrl, { headers });
    }

    // 예상치 못한 경우 로그인 페이지로 리다이렉트
    console.error(`[${provider}] OAuth URL이 생성되지 않았습니다.`);
    return redirect("/auth/login?error=no_oauth_url");
  } catch (err) {
    console.error(`[${provider}] OAuth 시작 중 예외 발생:`, err);
    const errorMessage =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    return redirect(`/auth/login?error=${encodeURIComponent(errorMessage)}`);
  }
};

// 이 페이지는 loader에서 리다이렉트되므로 실제로 렌더링되지 않습니다
export default function SocialStartPage() {
  return null;
}
