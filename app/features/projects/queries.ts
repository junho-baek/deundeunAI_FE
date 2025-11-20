/**
 * Projects Feature Database Queries
 *
 * Supabase 클라이언트를 사용한 프로젝트 관련 데이터베이스 쿼리 함수들
 */

import client from "~/lib/supa-client";

/**
 * 모든 프로젝트 목록 조회 (View 사용)
 * @param ownerProfileId - 프로젝트 소유자 프로필 ID (선택사항, 필터링용)
 * @returns 프로젝트 목록 배열 (평탄화된 구조)
 */
export async function getProjects(ownerProfileId?: string) {
  let query = client.from("project_list_view").select("*");

  if (ownerProfileId) {
    query = query.eq("owner_profile_id", ownerProfileId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("프로젝트 조회 실패:", error);
    throw new Error(`프로젝트를 불러오는데 실패했습니다: ${error.message}`);
  }

  return data ?? [];
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
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 * @returns 프로젝트 객체 또는 null
 */
export async function getProjectByProjectId(projectId: string) {
  // UUID 형식 검증
  if (!isValidUUID(projectId)) {
    console.warn(
      `잘못된 프로젝트 ID 형식: ${projectId}. UUID 형식이 아닙니다.`
    );
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
 * 프로젝트 ID (serial id)로 단일 프로젝트 조회
 * @param id - 프로젝트의 serial ID
 * @returns 프로젝트 객체 또는 null
 */
export async function getProjectById(id: number) {
  const { data, error } = await client
    .from("projects")
    .select("*")
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
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 * @returns 프로젝트와 프로필 정보가 포함된 객체 (평탄화된 구조)
 */
export async function getProjectWithProfile(projectId: string) {
  // UUID 형식 검증
  if (!isValidUUID(projectId)) {
    console.warn(
      `잘못된 프로젝트 ID 형식: ${projectId}. UUID 형식이 아닙니다.`
    );
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
 * @param projectData - 생성할 프로젝트 데이터
 * @returns 생성된 프로젝트 객체
 */
export async function createProject(projectData: {
  owner_profile_id: string;
  title: string;
  description?: string;
  status?: string;
  visibility?: string;
  slug?: string;
  config?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}) {
  const { data, error } = await client
    .from("projects")
    .insert(projectData)
    .select()
    .single();

  if (error) {
    console.error("프로젝트 생성 실패:", error);
    throw new Error(`프로젝트 생성에 실패했습니다: ${error.message}`);
  }

  return data;
}

/**
 * 프로젝트 업데이트
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 * @param updates - 업데이트할 필드들
 * @returns 업데이트된 프로젝트 객체
 */
export async function updateProject(
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
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 */
export async function deleteProject(projectId: string) {
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
 * @param projectId - 프로젝트의 serial ID
 * @returns 프로젝트 문서 목록
 */
export async function getProjectDocuments(projectId: number) {
  const { data, error } = await client
    .from("project_documents")
    .select("*")
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
 * @param projectId - 프로젝트의 serial ID
 * @returns 프로젝트 미디어 자산 목록
 */
export async function getProjectMediaAssets(projectId: number) {
  const { data, error } = await client
    .from("project_media_assets")
    .select("*")
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
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 * @returns 프로젝트의 워크스페이스 데이터
 */
export async function getProjectWorkspaceData(projectId: string) {
  // 먼저 프로젝트를 조회하여 serial ID를 얻음
  const project = await getProjectByProjectId(projectId);
  if (!project) {
    return null;
  }

  // 병렬로 모든 데이터 조회
  const [documents, mediaAssets] = await Promise.all([
    getProjectDocuments(project.id),
    getProjectMediaAssets(project.id),
  ]);

  // 오디오 세그먼트 조회 (type이 'script'인 문서의 오디오 세그먼트)
  const scriptDocument = documents.find((doc) => doc.type === "script");
  let audioSegments: any[] = [];

  if (scriptDocument) {
    const { data, error } = await client
      .from("project_audio_segments")
      .select("*")
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
 * @param days - 최근 일수 (기본값: 14)
 * @param ownerProfileId - 프로젝트 소유자 프로필 ID (선택사항)
 * @param limit - 최대 조회 개수 (기본값: 10)
 * @returns 최근 프로젝트 목록
 */
export async function getRecentProjects(
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
 * 프로젝트 통계 데이터 조회 (View 사용)
 * @param ownerProfileId - 프로젝트 소유자 프로필 ID (선택사항)
 * @returns 프로젝트 통계 데이터
 */
export async function getProjectStats(ownerProfileId?: string) {
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
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 * @returns 프로젝트 분석 데이터
 */
export async function getProjectAnalytics(projectId: string) {
  // 먼저 프로젝트를 조회하여 serial ID를 얻음
  const project = await getProjectByProjectId(projectId);
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
      .select("*")
      .eq("project_id", project.id)
      .order("display_order", { ascending: true }),
    // 추천사항 조회
    client
      .from("project_recommendations")
      .select("*")
      .eq("project_id", project.id)
      .order("display_order", { ascending: true }),
    // 채널 링크 조회
    client
      .from("project_channel_links")
      .select("*")
      .eq("project_id", project.id),
    // 메트릭스 조회 (최신 데이터)
    client
      .from("project_metrics")
      .select("*")
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
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 * @param months - 조회할 개월 수 (기본값: 6)
 * @returns 수익 예측 데이터 배열
 */
export async function getProjectRevenueForecasts(
  projectId: string,
  months: number = 6
) {
  // 먼저 프로젝트를 조회하여 serial ID를 얻음
  const project = await getProjectByProjectId(projectId);
  if (!project) {
    return [];
  }

  // 최근 N개월 데이터 조회
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);
  const cutoffDateString = cutoffDate.toISOString().split("T")[0];

  const { data, error } = await client
    .from("project_revenue_forecasts")
    .select("*")
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
