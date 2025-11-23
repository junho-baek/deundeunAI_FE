/**
 * Users Feature Database Queries
 *
 * Supabase 클라이언트를 사용한 사용자 관련 데이터베이스 쿼리 함수들
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/lib/supa-client";
import { redirect } from "react-router";

/**
 * 프로필 정보 조회
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (UUID)
 * @returns 프로필 객체 또는 null
 */
export async function getProfile(
  client: SupabaseClient<Database>,
  profileId: string
) {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("프로필 조회 실패:", error);
    throw new Error(`프로필을 불러오는데 실패했습니다: ${error.message}`);
  }

  return data;
}

/**
 * 프로필 ID로 slug 조회 (공개 프로필 링크 생성용)
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (UUID)
 * @returns slug 또는 null
 */
export async function getProfileSlug(
  client: SupabaseClient<Database>,
  profileId: string
): Promise<string | null> {
  const { data, error } = await client
    .from("profiles")
    .select("slug")
    .eq("id", profileId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("프로필 slug 조회 실패:", error);
    return null;
  }

  return data?.slug || null;
}

/**
 * 사용자명(slug)으로 프로필 정보 조회 (공개 프로필용)
 * @param client - Supabase 클라이언트
 * @param slug - 사용자 slug (username)
 * @returns 프로필 객체 또는 null
 */
/**
 * 사용자 ID로 프로필 정보 조회
 * @param client - Supabase 클라이언트
 * @param id - 사용자 ID (auth.users.id)
 * @returns 프로필 객체 또는 null (프로필이 없을 경우)
 */
export const getUserById = async (
  client: SupabaseClient<Database>,
  { id }: { id: string }
) => {
  const { data, error } = await client
    .from("profiles")
    .select(
      `
      id,
      name,
      slug,
      avatar_url
    `
    )
    .eq("auth_user_id", id)
    .single();

  if (error) {
    // 프로필이 없는 경우 (PGRST116: no rows returned) null 반환
    if (error.code === "PGRST116") {
      return null;
    }
    // 다른 에러는 throw (예: 네트워크 에러, 권한 에러 등)
    throw error;
  }

  return data;
};

/**
 * 로그인한 사용자 ID 조회 (인증 체크 포함)
 * @param client - Supabase 클라이언트
 * @returns 로그인한 사용자 ID (auth.users.id)
 * @throws 로그인하지 않은 경우 /auth/login으로 리다이렉트
 */
export const getLoggedInUserId = async (
  client: SupabaseClient<Database>
): Promise<string> => {
  const { data, error } = await client.auth.getUser();
  if (error || data.user === null) {
    throw redirect("/auth/login");
  }
  return data.user.id;
};

/**
 * 로그인한 사용자의 프로필 ID 조회 (인증 체크 포함)
 * @param client - Supabase 클라이언트
 * @returns 프로필 ID (profiles.id)
 * @throws 로그인하지 않았거나 프로필이 없는 경우 에러
 */
export const getLoggedInProfileId = async (
  client: SupabaseClient<Database>
): Promise<string> => {
  const userId = await getLoggedInUserId(client);
  const profile = await getUserById(client, { id: userId });
  if (!profile?.id) {
    throw new Error("프로필을 찾을 수 없습니다.");
  }
  return profile.id;
};

export async function getUserProfile(
  client: SupabaseClient<Database>,
  slug: string
) {
  const { data, error } = await client
    .from("profiles")
    .select(
      `
      id,
      slug,
      name,
      role,
      company,
      avatar_url,
      bio,
      email,
      timezone,
      joined_at,
      created_at,
      updated_at,
      project_count
    `
    )
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("프로필 조회 실패:", error);
    throw new Error(`프로필을 불러오는데 실패했습니다: ${error.message}`);
  }

  return data;
}

/**
 * 사용자명(slug)으로 프로젝트 목록 조회 (공개 프로필용)
 * @param client - Supabase 클라이언트
 * @param slug - 사용자 slug (username)
 * @param limit - 조회할 프로젝트 개수 (기본값: 20)
 * @returns 프로젝트 배열
 */
export async function getUserProjects(
  client: SupabaseClient<Database>,
  slug: string,
  limit: number = 20
) {
  // 먼저 프로필을 조회하여 profile_id를 얻음
  const profile = await getUserProfile(client, slug);
  if (!profile) {
    return [];
  }

  // 관계 쿼리 대신 직접 profile_id로 조회 (더 안정적)
  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("owner_profile_id", profile.id)
    .eq("visibility", "public") // 공개 프로필이므로 공개된 프로젝트만
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("사용자 프로젝트 조회 실패:", error);
    return [];
  }

  return data ?? [];
}

/**
 * 프로필 활동 메트릭 조회
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (UUID)
 * @returns 활동 메트릭 배열
 */
export async function getProfileActivityMetrics(
  client: SupabaseClient<Database>,
  profileId: string
) {
  const { data, error } = await client
    .from("profile_activity_metrics")
    .select("*")
    .eq("profile_id", profileId)
    .order("order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("프로필 활동 메트릭 조회 실패:", error);
    return [];
  }

  return data ?? [];
}

/**
 * 프로필 워크스페이스 설정 조회
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (UUID)
 * @returns 워크스페이스 설정 배열
 */
export async function getProfileWorkspacePreferences(
  client: SupabaseClient<Database>,
  profileId: string
) {
  const { data, error } = await client
    .from("profile_workspace_preferences")
    .select("*")
    .eq("profile_id", profileId)
    .eq("enabled", true)
    .order("order", { ascending: true });

  if (error) {
    console.error("워크스페이스 설정 조회 실패:", error);
    return [];
  }

  return data ?? [];
}

/**
 * 프로필의 프로젝트 목록 조회 (최근 4개)
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (UUID)
 * @param limit - 조회할 프로젝트 개수 (기본값: 4)
 * @returns 프로젝트 배열
 */
export async function getProfileProjects(
  client: SupabaseClient<Database>,
  profileId: string,
  limit: number = 4
) {
  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("owner_profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("프로필 프로젝트 조회 실패:", error);
    return [];
  }

  return data ?? [];
}

/**
 * 프로필 플랜 개요 조회
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (UUID)
 * @returns 플랜 개요 객체 또는 null
 */
export async function getProfileBillingPlan(
  client: SupabaseClient<Database>,
  profileId: string
) {
  const { data, error } = await client
    .from("profile_billing_plans")
    .select("*")
    .eq("profile_id", profileId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("플랜 조회 실패:", error);
    return null;
  }

  return data;
}

/**
 * 프로필 결제 수단 조회
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (UUID)
 * @returns 결제 수단 배열 (기본 결제 수단 우선)
 */
export async function getProfilePaymentMethods(
  client: SupabaseClient<Database>,
  profileId: string
) {
  const { data, error } = await client
    .from("profile_payment_methods")
    .select("*")
    .eq("profile_id", profileId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("결제 수단 조회 실패:", error);
    return [];
  }

  return data ?? [];
}

/**
 * 프로필 인보이스 목록 조회
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (UUID)
 * @returns 인보이스 배열
 */
export async function getProfileInvoices(
  client: SupabaseClient<Database>,
  profileId: string
) {
  const { data, error } = await client
    .from("profile_invoices")
    .select("*")
    .eq("profile_id", profileId)
    .order("issued_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("인보이스 조회 실패:", error);
    return [];
  }

  return data ?? [];
}

/**
 * 프로필 결제 공지사항 조회 (최신 1개)
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (UUID)
 * @returns 결제 공지사항 객체 또는 null
 */
export async function getProfileBillingNotice(
  client: SupabaseClient<Database>,
  profileId: string
) {
  const { data, error } = await client
    .from("profile_billing_notices")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("결제 공지사항 조회 실패:", error);
    return null;
  }

  return data;
}

/**
 * 프로필 팔로우 관계 조회
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (UUID)
 * @returns 팔로우 관계 배열
 */
export async function getProfileFollows(
  client: SupabaseClient<Database>,
  profileId: string
) {
  const { data, error } = await client
    .from("profile_follows")
    .select("*")
    .eq("follower_id", profileId);

  if (error) {
    console.error("팔로우 관계 조회 실패:", error);
    return [];
  }

  return data ?? [];
}

/**
 * 프로필 팔로워 조회
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (UUID)
 * @returns 팔로워 관계 배열
 */
export async function getProfileFollowers(
  client: SupabaseClient<Database>,
  profileId: string
) {
  const { data, error } = await client
    .from("profile_follows")
    .select("*")
    .eq("following_id", profileId);

  if (error) {
    console.error("팔로워 조회 실패:", error);
    return [];
  }

  return data ?? [];
}

/**
 * 프로필 알림 목록 조회
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (UUID)
 * @param limit - 조회할 알림 개수 (기본값: 50)
 * @returns 알림 배열
 */
export async function getProfileNotifications(
  client: SupabaseClient<Database>,
  profileId: string,
  limit: number = 50
) {
  const { data, error } = await client
    .from("notifications")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("알림 조회 실패:", error);
    return [];
  }

  return data ?? [];
}

/**
 * 읽지 않은 알림 개수 조회
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (UUID)
 * @returns 읽지 않은 알림 개수
 */
export async function getUnreadNotificationCount(
  client: SupabaseClient<Database>,
  profileId: string
) {
  const { count, error } = await client
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId)
    .is("read_at", null);

  if (error) {
    console.error("읽지 않은 알림 개수 조회 실패:", error);
    return 0;
  }

  return count ?? 0;
}

/**
 * 메시지 스레드 목록 조회
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (UUID)
 * @param limit - 조회할 스레드 개수 (기본값: 50)
 * @returns 메시지 스레드 배열
 */
export async function getMessageThreads(
  client: SupabaseClient<Database>,
  profileId: string,
  limit: number = 50
) {
  const { data, error } = await client
    .from("message_threads")
    .select("*")
    .eq("profile_id", profileId)
    .order("last_message_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("메시지 스레드 조회 실패:", error);
    return [];
  }

  return data ?? [];
}

/**
 * 메시지 엔트리 목록 조회 (특정 스레드)
 * @param client - Supabase 클라이언트
 * @param threadId - 스레드 ID (serial ID)
 * @param limit - 조회할 메시지 개수 (기본값: 100)
 * @returns 메시지 엔트리 배열
 */
export async function getMessageEntries(
  client: SupabaseClient<Database>,
  threadId: number,
  limit: number = 100
) {
  const { data, error } = await client
    .from("message_entries")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("메시지 엔트리 조회 실패:", error);
    return [];
  }

  return data ?? [];
}

/**
 * 알림 목록 조회
 */
export async function getNotifications(
  client: SupabaseClient<Database>,
  {
    profileId,
    limit = 50,
  }: {
    profileId: string;
    limit?: number;
  }
) {
  const { data, error } = await client
    .from("notifications")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("알림 조회 실패:", error);
    throw new Error(`알림을 불러오는데 실패했습니다: ${error.message}`);
  }

  return data ?? [];
}

export async function countUnreadNotifications(
  client: SupabaseClient<Database>,
  profileId: string
) {
  const { count, error } = await client
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", profileId)
    .is("read_at", null);

  if (error) {
    console.error("알림 개수 조회 실패:", error);
    return 0;
  }

  return count ?? 0;
}

/**
 * 크레딧 차감 (RPC 함수 사용 - 원자적 연산 보장)
 * 동시성 문제를 해결하기 위해 Supabase RPC 함수를 사용합니다.
 */
export async function deductCreditsRPC(
  client: SupabaseClient<Database>,
  {
    profileId,
    amount,
    description,
    relatedProjectId,
    relatedStepKey,
    metadata,
  }: {
    profileId: string;
    amount: number;
    description?: string;
    relatedProjectId?: string;
    relatedStepKey?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<{
  success: boolean;
  balance?: number;
  error?: string;
  transaction_id?: string;
  required?: number;
}> {
  try {
    const { data, error } = await client.rpc("deduct_credits", {
      p_profile_id: profileId,
      p_amount: amount,
      p_description: description || null,
      p_related_project_id: relatedProjectId || null,
      p_related_step_key: relatedStepKey || null,
      p_metadata: metadata || {},
    });

    if (error) {
      console.error("크레딧 차감 RPC 호출 실패:", error);
      return {
        success: false,
        error: error.message || "크레딧 차감에 실패했습니다.",
      };
    }

    // RPC 함수는 JSONB를 반환하므로 파싱
    if (typeof data === "object" && data !== null) {
      return {
        success: (data as any).success || false,
        balance: (data as any).balance,
        error: (data as any).error,
        transaction_id: (data as any).transaction_id,
        required: (data as any).required,
      };
    }

    return {
      success: false,
      error: "예상치 못한 응답 형식입니다.",
    };
  } catch (error) {
    console.error("크레딧 차감 중 예외 발생:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 크레딧 지급 (RPC 함수 사용 - 원자적 연산 보장)
 * 구독 갱신 시 매달 크레딧을 지급합니다.
 */
export async function grantCreditsRPC(
  client: SupabaseClient<Database>,
  {
    profileId,
    amount,
    description,
    metadata,
  }: {
    profileId: string;
    amount: number;
    description?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<{
  success: boolean;
  balance?: number;
  error?: string;
  transaction_id?: string;
}> {
  try {
    const { data, error } = await client.rpc("grant_credits", {
      p_profile_id: profileId,
      p_amount: amount,
      p_description: description || null,
      p_metadata: metadata || {},
    });

    if (error) {
      console.error("크레딧 지급 RPC 호출 실패:", error);
      return {
        success: false,
        error: error.message || "크레딧 지급에 실패했습니다.",
      };
    }

    // RPC 함수는 JSONB를 반환하므로 파싱
    if (typeof data === "object" && data !== null) {
      return {
        success: (data as any).success || false,
        balance: (data as any).balance,
        error: (data as any).error,
        transaction_id: (data as any).transaction_id,
      };
    }

    return {
      success: false,
      error: "예상치 못한 응답 형식입니다.",
    };
  } catch (error) {
    console.error("크레딧 지급 중 예외 발생:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 크레딧 잔액 조회
 */
export async function getCreditBalance(
  client: SupabaseClient<Database>,
  profileId: string
): Promise<number | null> {
  try {
    const { data, error } = await client
      .from("profiles")
      .select("credit_balance")
      .eq("id", profileId)
      .single();

    if (error) {
      console.error("크레딧 잔액 조회 실패:", error);
      return null;
    }

    return data?.credit_balance ?? null;
  } catch (error) {
    console.error("크레딧 잔액 조회 중 예외 발생:", error);
    return null;
  }
}
