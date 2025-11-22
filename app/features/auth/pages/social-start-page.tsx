import { z } from "zod";
import { redirect } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import type { Route } from "./+types/social-start-page";

export const meta: Route.MetaFunction = () => {
  return [{ title: "소셜 로그인 - 든든AI" }];
};

// 지원하는 소셜 프로바이더 (현재는 Google만)
const paramsSchema = z.object({
  provider: z.enum(["google"]),
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
  const {
    data: { url: oauthUrl },
    error,
  } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      // Google OAuth 스코프 설정 (이메일, 프로필 정보)
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (oauthUrl) {
    // OAuth URL로 리다이렉트 (쿠키 헤더 포함)
    return redirect(oauthUrl, { headers });
  }

  if (error) {
    console.error("OAuth 시작 실패:", error);
    throw error;
  }

  // 예상치 못한 경우 로그인 페이지로 리다이렉트
  return redirect("/auth/login");
};

// 이 페이지는 loader에서 리다이렉트되므로 실제로 렌더링되지 않습니다
export default function SocialStartPage() {
  return null;
}

