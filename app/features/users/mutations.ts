import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/lib/supa-client";

/**
 * 프로필 정보 업데이트
 * @param client - Supabase 클라이언트
 * @param params - 업데이트할 프로필 정보
 */
export const updateUser = async (
  client: SupabaseClient<Database>,
  {
    id,
    name,
    role,
    company,
    bio,
  }: {
    id: string;
    name: string;
    role?: string;
    company?: string;
    bio?: string;
  }
) => {
  const { error } = await client
    .from("profiles")
    .update({ name, role, company, bio })
    .eq("id", id);

  if (error) {
    throw error;
  }
};

/**
 * 프로필 아바타 업데이트
 * @param client - Supabase 클라이언트
 * @param params - 업데이트할 아바타 정보
 */
export const updateUserAvatar = async (
  client: SupabaseClient<Database>,
  {
    id,
    avatarUrl,
  }: {
    id: string;
    avatarUrl: string;
  }
) => {
  const { error } = await client
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", id);

  if (error) {
    throw error;
  }
};

