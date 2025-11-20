import { createClient } from "@supabase/supabase-js";

// TODO: database.types.ts 파일 생성 후 아래 주석을 해제하고 타입을 적용하세요
// import type { Database } from "~/database.types";

// Supabase 클라이언트 생성
// 환경 변수 SUPABASE_URL과 SUPABASE_ANON_KEY가 설정되어 있어야 합니다
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase 환경 변수가 설정되지 않았습니다. SUPABASE_URL과 SUPABASE_ANON_KEY를 확인하세요."
  );
}

// TODO: database.types.ts 생성 후 타입 적용
// const client = createClient<Database>(supabaseUrl, supabaseAnonKey);
const client = createClient(supabaseUrl, supabaseAnonKey);

export default client;
