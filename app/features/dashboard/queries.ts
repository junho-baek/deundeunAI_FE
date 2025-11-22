import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/lib/supa-client";

/**
 * 대시보드 위젯 조회
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (선택사항, 없으면 모든 위젯 조회)
 * @returns 위젯 배열
 */
export async function getDashboardWidgets(
  client: SupabaseClient<Database>,
  profileId?: string
) {
  try {
    let query = client
      .from("dashboard_widgets")
      .select("*")
      .order("position", { ascending: true });

    if (profileId) {
      query = query.eq("profile_id", profileId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("대시보드 위젯 조회 실패:", error);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("대시보드 위젯 조회 중 에러:", error);
    return [];
  }
}

/**
 * 대시보드 활동 피드 조회
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (선택사항)
 * @param limit - 조회할 항목 수 (기본값: 10)
 * @returns 활동 피드 배열
 */
export async function getDashboardActivityFeed(
  client: SupabaseClient<Database>,
  profileId?: string,
  limit: number = 10
) {
  try {
    let query = client
      .from("dashboard_activity_feed")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (profileId) {
      query = query.eq("profile_id", profileId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("활동 피드 조회 실패:", error);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("활동 피드 조회 중 에러:", error);
    return [];
  }
}

/**
 * 대시보드 목표 조회
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (선택사항)
 * @param status - 목표 상태 필터 (선택사항)
 * @returns 목표 배열
 */
export async function getDashboardGoals(
  client: SupabaseClient<Database>,
  profileId?: string,
  status?: "active" | "paused" | "completed" | "failed"
) {
  try {
    let query = client
      .from("dashboard_goals")
      .select("*")
      .order("created_at", { ascending: false });

    if (profileId) {
      query = query.eq("profile_id", profileId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("목표 조회 실패:", error);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("목표 조회 중 에러:", error);
    return [];
  }
}

/**
 * 메트릭 타입 위젯 조회 (통계 카드용)
 * dashboard_widgets 테이블에서 widget_key가 'metric'인 위젯만 조회
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (선택사항)
 * @returns 메트릭 위젯 배열
 */
export async function getMetricWidgets(
  client: SupabaseClient<Database>,
  profileId?: string
) {
  try {
    let query = client
      .from("dashboard_widgets")
      .select("*")
      .eq("widget_key", "metric")
      .order("position", { ascending: true });

    if (profileId) {
      query = query.eq("profile_id", profileId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("메트릭 위젯 조회 실패:", error);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("메트릭 위젯 조회 중 에러:", error);
    return [];
  }
}

/**
 * 활동 피드를 인사이트 아이템으로 변환
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID (선택사항)
 * @param limit - 조회할 항목 수 (기본값: 3)
 * @returns 인사이트 아이템 배열
 */
export async function getInsightsFromActivityFeed(
  client: SupabaseClient<Database>,
  profileId?: string,
  limit: number = 3
) {
  try {
    const activities = await getDashboardActivityFeed(client, profileId, limit);
    return activities.map((activity) => ({
      title: activity.title,
      description: activity.description || "",
    }));
  } catch (error) {
    console.error("인사이트 조회 중 에러:", error);
    return [];
  }
}
