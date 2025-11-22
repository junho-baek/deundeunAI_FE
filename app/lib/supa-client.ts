import { createClient } from "@supabase/supabase-js";

// TODO: database.types.ts 파일 생성 후 아래 주석을 해제하고 타입을 적용하세요
// import type { Database } from "~/database.types";

// Supabase 클라이언트 생성
// 환경 변수 SUPABASE_URL과 SUPABASE_ANON_KEY가 설정되어 있어야 합니다
// React Router 7 + Vite:
// - 서버 사이드: process.env 사용 가능
// - 클라이언트 사이드: import.meta.env.VITE_* 사용

// 환경 변수 가져오기 (서버/클라이언트 구분)
const isServer = typeof window === "undefined";

const supabaseUrl = isServer
  ? process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  : (import.meta.env?.VITE_SUPABASE_URL as string | undefined);

const supabaseAnonKey = isServer
  ? process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  : (import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined);

// 환경 변수가 없으면 더미 클라이언트 생성 (개발 환경에서만)
let client;
if (!supabaseUrl || !supabaseAnonKey) {
  const envVarName = isServer
    ? "SUPABASE_URL, SUPABASE_ANON_KEY 또는 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY"
    : "VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY";

  if (isServer) {
    // 서버 사이드에서는 에러를 던져서 명확하게 알림
    throw new Error(
      `Supabase 환경 변수가 설정되지 않았습니다. ${envVarName}를 확인하세요.`
    );
  } else {
    // 클라이언트 사이드에서는 경고만 출력하고 더미 클라이언트 생성
    console.warn(
      `⚠️ Supabase 환경 변수가 설정되지 않았습니다. ${envVarName}를 확인하세요. 더미 클라이언트를 사용합니다.`
    );
    // 더미 URL로 클라이언트 생성 (에러 방지)
    client = createClient("https://dummy.supabase.co", "dummy-anon-key");
  }
} else {
  // TODO: database.types.ts 생성 후 타입 적용
  // client = createClient<Database>(supabaseUrl, supabaseAnonKey);
  client = createClient(supabaseUrl, supabaseAnonKey);
}

export default client;
