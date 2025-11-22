import { makeSSRClient } from "~/lib/supa-client";

export const checkUsernameExists = async (
  request: Request,
  { username }: { username: string }
) => {
  const { client } = makeSSRClient(request);
  const { error } = await client
    .from("profiles")
    .select("profile_id")
    .eq("username", username)
    .single();

  if (error) {
    return false; // 에러 발생 시 사용자명이 존재하지 않음
  }

  return true; // 데이터가 있으면 사용자명이 존재함
};

