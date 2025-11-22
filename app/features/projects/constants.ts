/**
 * 프로젝트 관련 상수 정의
 */

export const PAGE_SIZE = 12; // 페이지당 프로젝트 개수

export const SORT_OPTIONS = [
  { value: "newest", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "trending", label: "트렌딩" },
] as const;

export const PERIOD_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "today", label: "오늘" },
  { value: "week", label: "이번 주" },
  { value: "month", label: "이번 달" },
  { value: "year", label: "올해" },
] as const;

