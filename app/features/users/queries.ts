/**
 * Users Feature Database Queries
 *
 * Supabase 클라이언트를 사용한 사용자 관련 데이터베이스 쿼리 함수들
 */

import client from "~/lib/supa-client";

/**
 * 프로필 정보 조회
 * @param profileId - 프로필 ID (UUID)
 * @returns 프로필 객체 또는 null
 */
export async function getProfile(profileId: string) {
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
 * 프로필 활동 메트릭 조회
 * @param profileId - 프로필 ID (UUID)
 * @returns 활동 메트릭 배열
 */
export async function getProfileActivityMetrics(profileId: string) {
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
 * @param profileId - 프로필 ID (UUID)
 * @returns 워크스페이스 설정 배열
 */
export async function getProfileWorkspacePreferences(profileId: string) {
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
 * @param profileId - 프로필 ID (UUID)
 * @returns 프로젝트 배열
 */
export async function getProfileProjects(profileId: string, limit: number = 4) {
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
 * @param profileId - 프로필 ID (UUID)
 * @returns 플랜 개요 객체 또는 null
 */
export async function getProfileBillingPlan(profileId: string) {
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
 * @param profileId - 프로필 ID (UUID)
 * @returns 결제 수단 배열 (기본 결제 수단 우선)
 */
export async function getProfilePaymentMethods(profileId: string) {
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
 * @param profileId - 프로필 ID (UUID)
 * @returns 인보이스 배열
 */
export async function getProfileInvoices(profileId: string) {
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
 * @param profileId - 프로필 ID (UUID)
 * @returns 결제 공지사항 객체 또는 null
 */
export async function getProfileBillingNotice(profileId: string) {
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
 * @param profileId - 프로필 ID (UUID)
 * @returns 팔로우 관계 배열
 */
export async function getProfileFollows(profileId: string) {
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
 * @param profileId - 프로필 ID (UUID)
 * @returns 팔로워 관계 배열
 */
export async function getProfileFollowers(profileId: string) {
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
 * @param profileId - 프로필 ID (UUID)
 * @param limit - 조회할 알림 개수 (기본값: 50)
 * @returns 알림 배열
 */
export async function getProfileNotifications(
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
 * @param profileId - 프로필 ID (UUID)
 * @returns 읽지 않은 알림 개수
 */
export async function getUnreadNotificationCount(profileId: string) {
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
 * @param profileId - 프로필 ID (UUID)
 * @param limit - 조회할 스레드 개수 (기본값: 50)
 * @returns 메시지 스레드 배열
 */
export async function getMessageThreads(profileId: string, limit: number = 50) {
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
 * @param threadId - 스레드 ID (serial ID)
 * @param limit - 조회할 메시지 개수 (기본값: 100)
 * @returns 메시지 엔트리 배열
 */
export async function getMessageEntries(threadId: number, limit: number = 100) {
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
