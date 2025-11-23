const ANALYTICS_STATUSES = new Set(["completed", "archived"]);

function normalizeProjectId(projectId?: string) {
  if (!projectId || typeof projectId !== "string") {
    return "";
  }
  return projectId;
}

export function getProjectWorkspacePath(projectId: string) {
  const normalized = normalizeProjectId(projectId);
  if (!normalized) {
    return "/my/dashboard/projects";
  }
  return `/my/dashboard/project/${normalized}`;
}

export function getProjectAnalyticsPath(projectId: string) {
  return `${getProjectWorkspacePath(projectId)}/analytics`;
}

/**
 * 프로젝트 상태에 따라 기본 이동 경로를 반환합니다.
 * - completed/archived: 분석 페이지
 * - 기타 상태: 워크스페이스
 */
export function getProjectRouteByStatus(
  projectId: string,
  status?: string | null
) {
  const normalized = normalizeProjectId(projectId);
  if (!normalized) {
    return "/my/dashboard/projects";
  }

  if (status && ANALYTICS_STATUSES.has(status)) {
    return getProjectAnalyticsPath(normalized);
  }

  return getProjectWorkspacePath(normalized);
}

