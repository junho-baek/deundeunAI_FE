/**
 * Projects Feature Database Queries
 *
 * Supabase 클라이언트를 사용한 프로젝트 관련 데이터베이스 쿼리 함수들
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/lib/supa-client";
import { PAGE_SIZE } from "./constants";

/**
 * 프로젝트 분석 데이터 조회용 공통 Select 쿼리
 * 하이라이트, 추천사항, 채널 링크 등에서 공통으로 사용
 */
const projectAnalyticsSelect = "*";

/**
 * 프로젝트 워크스페이스 데이터 조회용 공통 Select 쿼리
 * 문서, 미디어 자산, 오디오 세그먼트 등에서 공통으로 사용
 */
const projectWorkspaceSelect = "*";

/**
 * 모든 프로젝트 목록 조회 (View 사용, 페이지네이션 및 필터링 지원)
 * @param client - Supabase 클라이언트
 * @param options - 필터링 및 정렬 옵션
 * @returns 프로젝트 목록 배열 (평탄화된 구조)
 */
export async function getProjects(
  client: SupabaseClient<Database>,
  {
    ownerProfileId,
    page = 1,
    sorting = "newest",
    period = "all",
    keyword,
    status,
  }: {
    ownerProfileId?: string;
    page?: number;
    sorting?: "newest" | "popular" | "trending";
    period?: "all" | "today" | "week" | "month" | "year";
    keyword?: string;
    status?: string;
  }
) {
  try {
    let query = client
      .from("project_list_view")
      .select("*")
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    // 소유자 필터링
    if (ownerProfileId) {
      query = query.eq("owner_profile_id", ownerProfileId);
    }

    // 정렬 처리
    if (sorting === "newest") {
      query = query.order("created_at", { ascending: false });
    } else if (sorting === "popular") {
      query = query.order("likes", { ascending: false });
    } else if (sorting === "trending") {
      query = query.order("views", { ascending: false });
    }

    // 기간 필터링
    if (period !== "all") {
      const today = new Date();
      let startDate: Date;

      switch (period) {
        case "today": {
          startDate = new Date(today);
          startDate.setHours(0, 0, 0, 0);
          break;
        }
        case "week": {
          startDate = new Date(today);
          const day = startDate.getDay();
          const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // 월요일
          startDate.setDate(diff);
          startDate.setHours(0, 0, 0, 0);
          break;
        }
        case "month": {
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        }
        case "year": {
          startDate = new Date(today.getFullYear(), 0, 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        }
        default:
          startDate = today;
      }

      query = query.gte("created_at", startDate.toISOString());
    }

    // 키워드 검색 (제목 또는 설명)
    if (keyword) {
      query = query.or(
        `title.ilike.%${keyword}%,description.ilike.%${keyword}%`
      );
    }

    // 상태 필터링
    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      // 네트워크 에러나 연결 실패 시 빈 배열 반환 (더미 URL 사용 시)
      if (
        error.message?.includes("fetch failed") ||
        error.message?.includes("ENOTFOUND")
      ) {
        console.warn("프로젝트 조회 실패 (연결 오류):", error.message);
        return [];
      }
      console.error("프로젝트 조회 실패:", error);
      throw new Error(`프로젝트를 불러오는데 실패했습니다: ${error.message}`);
    }

    return data ?? [];
  } catch (error) {
    // 예상치 못한 에러도 빈 배열 반환 (UI는 계속 렌더링)
    console.error("프로젝트 조회 중 예외 발생:", error);
    return [];
  }
}

/**
 * 프로젝트 총 페이지 수 계산 (필터링 옵션 지원)
 * @param client - Supabase 클라이언트
 * @param options - 필터링 옵션 (getProjects와 동일한 필터링 적용)
 * @returns 총 페이지 수
 */
export async function getProjectPages(
  client: SupabaseClient<Database>,
  {
    ownerProfileId,
    period = "all",
    keyword,
    status,
  }: {
    ownerProfileId?: string;
    period?: "all" | "today" | "week" | "month" | "year";
    keyword?: string;
    status?: string;
  } = {}
) {
  try {
    // getProjects와 동일한 필터링을 적용하기 위해 project_list_view 사용
    let query = client
      .from("project_list_view")
      .select("project_id", { count: "exact", head: true });

    // 소유자 필터링
    if (ownerProfileId) {
      query = query.eq("owner_profile_id", ownerProfileId);
    }

    // 기간 필터링
    if (period !== "all") {
      const today = new Date();
      let startDate: Date;

      switch (period) {
        case "today": {
          startDate = new Date(today);
          startDate.setHours(0, 0, 0, 0);
          break;
        }
        case "week": {
          startDate = new Date(today);
          const day = startDate.getDay();
          const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // 월요일
          startDate.setDate(diff);
          startDate.setHours(0, 0, 0, 0);
          break;
        }
        case "month": {
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        }
        case "year": {
          startDate = new Date(today.getFullYear(), 0, 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        }
        default:
          startDate = today;
      }

      query = query.gte("created_at", startDate.toISOString());
    }

    // 키워드 검색 (제목 또는 설명)
    if (keyword) {
      query = query.or(
        `title.ilike.%${keyword}%,description.ilike.%${keyword}%`
      );
    }

    // 상태 필터링
    if (status) {
      query = query.eq("status", status);
    }

    const { count, error } = await query;

    if (error) {
      // 네트워크 에러나 연결 실패 시 기본값 반환 (더미 URL 사용 시)
      if (
        error.message?.includes("fetch failed") ||
        error.message?.includes("ENOTFOUND")
      ) {
        console.warn(
          "프로젝트 페이지 수 계산 실패 (연결 오류):",
          error.message
        );
        return 1; // 기본값: 1페이지
      }
      console.error("프로젝트 페이지 수 계산 실패:", error);
      throw new Error(`페이지 수를 계산하는데 실패했습니다: ${error.message}`);
    }

    if (!count || count === 0) return 1;
    return Math.ceil(count / PAGE_SIZE);
  } catch (error) {
    // 예상치 못한 에러도 기본값 반환
    console.error("프로젝트 페이지 수 계산 중 예외 발생:", error);
    return 1; // 기본값: 1페이지
  }
}

/**
 * UUID 형식 검증 함수
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * 프로젝트 ID로 단일 프로젝트 조회
 * @param client - Supabase 클라이언트
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 * @returns 프로젝트 객체 또는 null
 */
export async function getProjectByProjectId(
  client: SupabaseClient<Database>,
  projectId: string
) {
  // UUID 형식 검증 (경고 메시지 제거, 조용히 null 반환)
  if (!isValidUUID(projectId)) {
    // "create"는 정상적인 케이스이므로 경고 출력하지 않음
    return null;
  }

  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("project_id", projectId)
    .single();

  if (error) {
    // 404 에러는 null 반환 (프로젝트가 없는 경우)
    if (error.code === "PGRST116") {
      return null;
    }
    // UUID 형식 에러도 null 반환 (잘못된 형식)
    if (error.code === "22P02") {
      console.warn(
        `UUID 형식 에러: ${projectId}. 프로젝트를 찾을 수 없습니다.`
      );
      return null;
    }
    console.error("프로젝트 조회 실패:", error);
    throw new Error(`프로젝트를 불러오는데 실패했습니다: ${error.message}`);
  }

  return data;
}

/**
 * 프로젝트 ID (serial id)로 단일 프로젝트 조회 (관계 데이터 포함)
 * @param client - Supabase 클라이언트
 * @param id - 프로젝트의 serial ID
 * @returns 프로젝트 객체와 소유자 프로필 정보 또는 null
 */
export async function getProjectById(
  client: SupabaseClient<Database>,
  id: number
) {
  const { data, error } = await client
    .from("projects")
    .select(
      `
      *,
      owner:profiles!projects_owner_profile_id_profiles_id_fk(
        id,
        slug,
        name,
        avatar_url,
        email
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("프로젝트 조회 실패:", error);
    throw new Error(`프로젝트를 불러오는데 실패했습니다: ${error.message}`);
  }

  return data;
}

/**
 * 프로젝트와 소유자 프로필 정보를 함께 조회 (View 사용)
 * @param client - Supabase 클라이언트
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 * @returns 프로젝트와 프로필 정보가 포함된 객체 (평탄화된 구조)
 */
export async function getProjectWithProfile(
  client: SupabaseClient<Database>,
  projectId: string
) {
  // UUID 형식 검증 (경고 메시지 제거, 조용히 null 반환)
  if (!isValidUUID(projectId)) {
    // "create"는 정상적인 케이스이므로 경고 출력하지 않음
    return null;
  }

  const { data, error } = await client
    .from("project_list_view")
    .select("*")
    .eq("project_id", projectId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    // UUID 형식 에러도 null 반환
    if (error.code === "22P02") {
      console.warn(
        `UUID 형식 에러: ${projectId}. 프로젝트를 찾을 수 없습니다.`
      );
      return null;
    }
    console.error("프로젝트 조회 실패:", error);
    throw new Error(`프로젝트를 불러오는데 실패했습니다: ${error.message}`);
  }

  return data;
}

/**
 * 새 프로젝트 생성
 * @param client - Supabase 클라이언트
 * @param projectData - 생성할 프로젝트 데이터
 * @returns 생성된 프로젝트 객체
 */
export async function createProject(
  client: SupabaseClient<Database>,
  projectData: {
    project_id?: string; // 옵션: 명시적으로 지정하면 사용, 없으면 DB가 자동 생성
    owner_profile_id: string;
    title: string;
    description?: string;
    status?: string;
    visibility?: string;
    slug?: string;
    config?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }
) {
  // id 필드는 제외하고 필요한 필드만 구성 (serial id는 DB가 자동 생성)
  const insertData: Record<string, unknown> = {
    project_id: projectData.project_id,
    owner_profile_id: projectData.owner_profile_id,
    title: projectData.title,
  };

  if (projectData.description !== undefined) {
    insertData.description = projectData.description;
  }
  if (projectData.status !== undefined) {
    insertData.status = projectData.status;
  }
  if (projectData.visibility !== undefined) {
    insertData.visibility = projectData.visibility;
  }
  if (projectData.slug !== undefined) {
    insertData.slug = projectData.slug;
  }
  if (projectData.config !== undefined) {
    insertData.config = projectData.config;
  }
  if (projectData.metadata !== undefined) {
    insertData.metadata = projectData.metadata;
  }

  const { data, error } = await client
    .from("projects")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("프로젝트 생성 실패:", error);
    // 중복 키 에러인 경우 더 자세한 정보 제공
    if (error.code === "23505") {
      throw new Error(
        `프로젝트 생성에 실패했습니다: 중복된 키가 있습니다. ${error.details || error.message}`
      );
    }
    throw new Error(`프로젝트 생성에 실패했습니다: ${error.message}`);
  }

  return data;
}

/**
 * 프로젝트 업데이트
 * @param client - Supabase 클라이언트
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 * @param updates - 업데이트할 필드들
 * @returns 업데이트된 프로젝트 객체
 */
export async function updateProject(
  client: SupabaseClient<Database>,
  projectId: string,
  updates: Partial<{
    title: string;
    description: string;
    status: string;
    visibility: string;
    slug: string;
    likes: number;
    views: number;
    ctr: number;
    budget: number;
    tiktok_url: string;
    video_url: string;
    thumbnail: string;
    cover_image: string;
    config: Record<string, unknown>;
    metadata: Record<string, unknown>;
    published_at: string;
    archived_at: string;
  }>
) {
  const { data, error } = await client
    .from("projects")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("project_id", projectId)
    .select()
    .single();

  if (error) {
    console.error("프로젝트 업데이트 실패:", error);
    throw new Error(`프로젝트 업데이트에 실패했습니다: ${error.message}`);
  }

  return data;
}

/**
 * 프로젝트 삭제
 * @param client - Supabase 클라이언트
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 */
export async function deleteProject(
  client: SupabaseClient<Database>,
  projectId: string
) {
  const { error } = await client
    .from("projects")
    .delete()
    .eq("project_id", projectId);

  if (error) {
    console.error("프로젝트 삭제 실패:", error);
    throw new Error(`프로젝트 삭제에 실패했습니다: ${error.message}`);
  }
}

/**
 * 프로젝트 문서 조회
 * @param client - Supabase 클라이언트
 * @param projectId - 프로젝트의 serial ID
 * @returns 프로젝트 문서 목록
 */
export async function getProjectDocuments(
  client: SupabaseClient<Database>,
  projectId: number
) {
  const { data, error } = await client
    .from("project_documents")
    .select(projectWorkspaceSelect)
    .eq("project_id", projectId)
    .order("order", { ascending: true });

  if (error) {
    console.error("프로젝트 문서 조회 실패:", error);
    throw new Error(
      `프로젝트 문서를 불러오는데 실패했습니다: ${error.message}`
    );
  }

  return data ?? [];
}

/**
 * 프로젝트 미디어 자산 조회
 * @param client - Supabase 클라이언트
 * @param projectId - 프로젝트의 serial ID
 * @returns 프로젝트 미디어 자산 목록
 */
export async function getProjectMediaAssets(
  client: SupabaseClient<Database>,
  projectId: number
) {
  const { data, error } = await client
    .from("project_media_assets")
    .select(projectWorkspaceSelect)
    .eq("project_id", projectId)
    .order("order", { ascending: true });

  if (error) {
    console.error("프로젝트 미디어 자산 조회 실패:", error);
    throw new Error(
      `프로젝트 미디어 자산을 불러오는데 실패했습니다: ${error.message}`
    );
  }

  return data ?? [];
}

/**
 * 프로젝트의 모든 워크스페이스 데이터 조회 (문서, 미디어, 오디오 등)
 * @param client - Supabase 클라이언트
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 * @returns 프로젝트의 워크스페이스 데이터
 */
export async function getProjectWorkspaceData(
  client: SupabaseClient<Database>,
  projectId: string
) {
  // 먼저 프로젝트를 조회하여 serial ID를 얻음
  const project = await getProjectByProjectId(client, projectId);
  if (!project) {
    return null;
  }

  // 병렬로 모든 데이터 조회
  const [documents, mediaAssets] = await Promise.all([
    getProjectDocuments(client, project.id),
    getProjectMediaAssets(client, project.id),
  ]);

  // 오디오 세그먼트 조회 (type이 'script'인 문서의 오디오 세그먼트)
  const scriptDocument = documents.find((doc) => doc.type === "script");
  let audioSegments: any[] = [];

  if (scriptDocument) {
    const { data, error } = await client
      .from("project_audio_segments")
      .select(projectWorkspaceSelect)
      .eq("document_id", scriptDocument.id)
      .order("segment_order", { ascending: true });

    if (!error && data) {
      audioSegments = data;
    }
  }

  return {
    project,
    documents,
    mediaAssets,
    audioSegments,
  };
}

/**
 * 최근 프로젝트 목록 조회 (지정된 일수 내에 업데이트된 프로젝트)
 * @param client - Supabase 클라이언트
 * @param days - 최근 일수 (기본값: 14)
 * @param ownerProfileId - 프로젝트 소유자 프로필 ID (선택사항)
 * @param limit - 최대 조회 개수 (기본값: 10)
 * @returns 최근 프로젝트 목록
 */
export async function getRecentProjects(
  client: SupabaseClient<Database>,
  days: number = 14,
  ownerProfileId?: string,
  limit: number = 10
) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffDateString = cutoffDate.toISOString();

  let query = client
    .from("projects")
    .select("*")
    .gte("updated_at", cutoffDateString)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (ownerProfileId) {
    query = query.eq("owner_profile_id", ownerProfileId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("최근 프로젝트 조회 실패:", error);
    throw new Error(
      `최근 프로젝트를 불러오는데 실패했습니다: ${error.message}`
    );
  }

  return data ?? [];
}

/**
 * 날짜 범위로 프로젝트 조회 (기간별 필터링용)
 * @param client - Supabase 클라이언트
 * @param startDate - 시작 날짜 (ISO 문자열 또는 Date 객체)
 * @param endDate - 종료 날짜 (ISO 문자열 또는 Date 객체)
 * @param ownerProfileId - 프로젝트 소유자 프로필 ID (선택사항)
 * @param limit - 최대 조회 개수
 * @param orderBy - 정렬 기준 (기본값: "created_at")
 * @param ascending - 오름차순 여부 (기본값: false)
 * @returns 프로젝트 목록
 */
export async function getProjectsByDateRange(
  client: SupabaseClient<Database>,
  {
    startDate,
    endDate,
    ownerProfileId,
    limit,
    page = 1,
    orderBy = "created_at",
    ascending = false,
  }: {
    startDate: string | Date;
    endDate: string | Date;
    ownerProfileId?: string;
    limit: number;
    page?: number;
    orderBy?:
      | "created_at"
      | "updated_at"
      | "likes"
      | "views"
      | "ctr"
      | "budget";
    ascending?: boolean;
  }
) {
  const startDateString =
    startDate instanceof Date ? startDate.toISOString() : startDate;
  const endDateString =
    endDate instanceof Date ? endDate.toISOString() : endDate;

  let query = client
    .from("project_list_view")
    .select("*")
    .gte("created_at", startDateString)
    .lte("created_at", endDateString)
    .order(orderBy, { ascending })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (ownerProfileId) {
    query = query.eq("owner_profile_id", ownerProfileId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("날짜 범위 프로젝트 조회 실패:", error);
    throw new Error(`프로젝트를 불러오는데 실패했습니다: ${error.message}`);
  }

  return data ?? [];
}

/**
 * 날짜 범위의 프로젝트 총 페이지 수 계산
 * @param client - Supabase 클라이언트
 * @param startDate - 시작 날짜 (ISO 문자열 또는 Date 객체)
 * @param endDate - 종료 날짜 (ISO 문자열 또는 Date 객체)
 * @param ownerProfileId - 프로젝트 소유자 프로필 ID (선택사항)
 * @returns 총 페이지 수
 */
export async function getProjectPagesByDateRange(
  client: SupabaseClient<Database>,
  {
    startDate,
    endDate,
    ownerProfileId,
  }: {
    startDate: string | Date;
    endDate: string | Date;
    ownerProfileId?: string;
  }
) {
  const startDateString =
    startDate instanceof Date ? startDate.toISOString() : startDate;
  const endDateString =
    endDate instanceof Date ? endDate.toISOString() : endDate;

  let query = client
    .from("projects")
    .select("project_id", { count: "exact", head: true })
    .gte("created_at", startDateString)
    .lte("created_at", endDateString);

  if (ownerProfileId) {
    query = query.eq("owner_profile_id", ownerProfileId);
  }

  const { count, error } = await query;

  if (error) {
    console.error("프로젝트 페이지 수 계산 실패:", error);
    throw new Error(`페이지 수를 계산하는데 실패했습니다: ${error.message}`);
  }

  if (!count || count === 0) return 1;
  return Math.ceil(count / PAGE_SIZE);
}

/**
 * 프로젝트 통계 데이터 조회 (View 사용)
 * @param client - Supabase 클라이언트
 * @param ownerProfileId - 프로젝트 소유자 프로필 ID (선택사항)
 * @returns 프로젝트 통계 데이터
 */
export async function getProjectStats(
  client: SupabaseClient<Database>,
  ownerProfileId?: string
) {
  // View를 사용하되, ownerProfileId가 있으면 필터링을 위해 원본 테이블 사용
  // (View는 집계된 전체 데이터만 제공하므로)
  if (ownerProfileId) {
    // 특정 사용자의 프로젝트만 집계해야 하는 경우 원본 테이블 사용
    let query = client.from("projects").select("likes, views, ctr, budget");
    query = query.eq("owner_profile_id", ownerProfileId);

    const { data, error } = await query;

    if (error) {
      console.error("프로젝트 통계 조회 실패:", error);
      throw new Error(
        `프로젝트 통계를 불러오는데 실패했습니다: ${error.message}`
      );
    }

    if (!data || data.length === 0) {
      return {
        totalLikes: 0,
        totalViews: 0,
        averageCTR: 0,
        totalBudget: 0,
        projectCount: 0,
      };
    }

    const totalLikes = data.reduce((sum, p) => sum + (p.likes || 0), 0);
    const totalViews = data.reduce((sum, p) => sum + (p.views || 0), 0);
    const ctrValues = data.filter((p) => p.ctr != null).map((p) => p.ctr!);
    const averageCTR =
      ctrValues.length > 0
        ? ctrValues.reduce((sum, ctr) => sum + ctr, 0) / ctrValues.length
        : 0;
    const totalBudget = data.reduce((sum, p) => sum + (p.budget || 0), 0);

    return {
      totalLikes,
      totalViews,
      averageCTR,
      totalBudget,
      projectCount: data.length,
    };
  }

  // 전체 통계는 View 사용
  const { data, error } = await client
    .from("project_stats_view")
    .select("*")
    .single();

  if (error) {
    console.error("프로젝트 통계 조회 실패:", error);
    throw new Error(
      `프로젝트 통계를 불러오는데 실패했습니다: ${error.message}`
    );
  }

  if (!data) {
    return {
      totalLikes: 0,
      totalViews: 0,
      averageCTR: 0,
      totalBudget: 0,
      projectCount: 0,
    };
  }

  return {
    totalLikes: Number(data.total_likes) || 0,
    totalViews: Number(data.total_views) || 0,
    averageCTR: Number(data.average_ctr) || 0,
    totalBudget: Number(data.total_budget) || 0,
    projectCount: Number(data.project_count) || 0,
  };
}

/**
 * 프로젝트 분석 데이터 조회 (하이라이트, 추천사항, 채널 링크 등)
 * @param client - Supabase 클라이언트
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 * @returns 프로젝트 분석 데이터
 */
export async function getProjectAnalytics(
  client: SupabaseClient<Database>,
  projectId: string
) {
  // 먼저 프로젝트를 조회하여 serial ID를 얻음
  const project = await getProjectByProjectId(client, projectId);
  if (!project) {
    return null;
  }

  // 병렬로 모든 분석 데이터 조회 (에러가 있어도 계속 진행)
  const [
    highlightsResult,
    recommendationsResult,
    channelLinksResult,
    metricsResult,
  ] = await Promise.allSettled([
    // 하이라이트 조회
    client
      .from("project_highlights")
      .select(projectAnalyticsSelect)
      .eq("project_id", project.id)
      .order("display_order", { ascending: true }),
    // 추천사항 조회
    client
      .from("project_recommendations")
      .select(projectAnalyticsSelect)
      .eq("project_id", project.id)
      .order("display_order", { ascending: true }),
    // 채널 링크 조회
    client
      .from("project_channel_links")
      .select(projectAnalyticsSelect)
      .eq("project_id", project.id),
    // 메트릭스 조회 (최신 데이터)
    client
      .from("project_metrics")
      .select(projectAnalyticsSelect)
      .eq("project_id", project.id)
      .order("recorded_on", { ascending: false })
      .limit(1),
  ]);

  // 에러가 있어도 빈 배열 반환 (UI는 계속 렌더링)
  const highlights =
    highlightsResult.status === "fulfilled" &&
    !highlightsResult.value.error &&
    highlightsResult.value.data
      ? highlightsResult.value.data
      : [];
  const recommendations =
    recommendationsResult.status === "fulfilled" &&
    !recommendationsResult.value.error &&
    recommendationsResult.value.data
      ? recommendationsResult.value.data
      : [];
  const channelLinks =
    channelLinksResult.status === "fulfilled" &&
    !channelLinksResult.value.error &&
    channelLinksResult.value.data
      ? channelLinksResult.value.data
      : [];
  const latestMetrics =
    metricsResult.status === "fulfilled" &&
    !metricsResult.value.error &&
    metricsResult.value.data &&
    metricsResult.value.data.length > 0
      ? metricsResult.value.data[0]
      : null;

  // 에러 로깅
  if (highlightsResult.status === "rejected") {
    console.error("하이라이트 조회 실패:", highlightsResult.reason);
  }
  if (recommendationsResult.status === "rejected") {
    console.error("추천사항 조회 실패:", recommendationsResult.reason);
  }
  if (channelLinksResult.status === "rejected") {
    console.error("채널 링크 조회 실패:", channelLinksResult.reason);
  }
  if (metricsResult.status === "rejected") {
    console.error("메트릭스 조회 실패:", metricsResult.reason);
  }

  return {
    project,
    highlights,
    recommendations,
    channelLinks,
    latestMetrics,
  };
}

/**
 * 프로젝트 수익 예측 데이터 조회
 * @param client - Supabase 클라이언트
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 * @param months - 조회할 개월 수 (기본값: 6)
 * @returns 수익 예측 데이터 배열
 */
export async function getProjectRevenueForecasts(
  client: SupabaseClient<Database>,
  projectId: string,
  months: number = 6
) {
  // 먼저 프로젝트를 조회하여 serial ID를 얻음
  const project = await getProjectByProjectId(client, projectId);
  if (!project) {
    return [];
  }

  // 최근 N개월 데이터 조회
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);
  const cutoffDateString = cutoffDate.toISOString().split("T")[0];

  const { data, error } = await client
    .from("project_revenue_forecasts")
    .select(projectWorkspaceSelect)
    .eq("project_id", project.id)
    .gte("month", cutoffDateString)
    .order("month", { ascending: true });

  if (error) {
    console.error("수익 예측 데이터 조회 실패:", error);
    throw new Error(
      `수익 예측 데이터를 불러오는데 실패했습니다: ${error.message}`
    );
  }

  return data ?? [];
}

/**
 * 프로젝트 단계 상태 조회
 * @param client - Supabase 클라이언트
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 * @returns 프로젝트의 모든 단계 상태
 */
export async function getProjectSteps(
  client: SupabaseClient<Database>,
  projectId: string
) {
  // 먼저 프로젝트를 조회하여 serial ID를 얻음
  const project = await getProjectByProjectId(client, projectId);
  if (!project) {
    return [];
  }

  const { data, error } = await client
    .from("project_steps")
    .select("*")
    .eq("project_id", project.id)
    .order("order", { ascending: true });

  if (error) {
    console.error("프로젝트 단계 조회 실패:", error);
    return [];
  }

  return data ?? [];
}

/**
 * 프로젝트 단계 상태 업데이트
 * @param client - Supabase 클라이언트
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 * @param stepKey - 단계 키 ("brief", "script", "narration", "images", "videos", "final")
 * @param status - 새로운 상태 ("pending", "in_progress", "blocked", "completed")
 * @param metadata - 추가 메타데이터 (선택사항)
 * @returns 업데이트된 단계 객체
 */
export async function updateProjectStep(
  client: SupabaseClient<Database>,
  projectId: string,
  stepKey:
    | "brief"
    | "script"
    | "narration"
    | "images"
    | "videos"
    | "final"
    | "distribution",
  status: "pending" | "in_progress" | "blocked" | "completed",
  metadata?: Record<string, unknown>
) {
  // 먼저 프로젝트를 조회하여 serial ID를 얻음
  const project = await getProjectByProjectId(client, projectId);
  if (!project) {
    throw new Error("프로젝트를 찾을 수 없습니다.");
  }

  const updateData: {
    status: string;
    updated_at: string;
    started_at?: string | null;
    completed_at?: string | null;
    metadata?: Record<string, unknown>;
  } = {
    status,
    updated_at: new Date().toISOString(),
  };

  // 상태에 따라 started_at 또는 completed_at 설정
  if (status === "in_progress") {
    updateData.started_at = new Date().toISOString();
  }
  if (status === "completed") {
    updateData.completed_at = new Date().toISOString();
  }
  if (metadata) {
    updateData.metadata = metadata;
  }

  const { data, error } = await client
    .from("project_steps")
    .update(updateData)
    .eq("project_id", project.id)
    .eq("key", stepKey)
    .select()
    .single();

  if (error) {
    console.error("프로젝트 단계 업데이트 실패:", error);
    throw new Error(`프로젝트 단계 업데이트에 실패했습니다: ${error.message}`);
  }

  return data;
}

/**
 * 프로젝트 초기 단계들 생성
 * @param client - Supabase 클라이언트
 * @param projectId - 프로젝트의 serial ID
 * @returns 생성된 단계들
 */
export async function createInitialProjectSteps(
  client: SupabaseClient<Database>,
  projectId: number
) {
  // 이미 단계가 존재하는지 확인
  const { data: existingSteps } = await client
    .from("project_steps")
    .select("id")
    .eq("project_id", projectId);

  if (existingSteps && existingSteps.length > 0) {
    // 이미 단계가 존재하면 기존 단계 반환
    const { data: steps } = await client
      .from("project_steps")
      .select("*")
      .eq("project_id", projectId)
      .order("order", { ascending: true });
    return steps ?? [];
  }

  const steps = [
    { key: "brief", order: 1 },
    { key: "script", order: 2 },
    { key: "narration", order: 3 },
    { key: "images", order: 4 },
    { key: "videos", order: 5 },
    { key: "final", order: 6 },
  ];

  // id 필드는 명시적으로 제외 (serial이 자동 생성)
  const insertData = steps.map((step) => ({
    project_id: projectId,
    key: step.key,
    status: "pending" as const,
    order: step.order,
  }));

  const { data, error } = await client
    .from("project_steps")
    .insert(insertData)
    .select();

  if (error) {
    // 중복 키 에러인 경우 기존 단계를 반환 (시퀀스 동기화 문제 해결)
    if (error.code === "23505") {
      console.warn(
        "프로젝트 단계가 이미 존재합니다. 기존 단계를 반환합니다:",
        error.details
      );
      const { data: steps } = await client
        .from("project_steps")
        .select("*")
        .eq("project_id", projectId)
        .order("order", { ascending: true });
      return steps ?? [];
    }
    console.error("프로젝트 단계 생성 실패:", error);
    throw new Error(`프로젝트 단계 생성에 실패했습니다: ${error.message}`);
  }

  return data ?? [];
}
