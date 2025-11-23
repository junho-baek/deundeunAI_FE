import {
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
  useSearchParams,
  Form,
  data,
} from "react-router";
import type { Route } from "./+types/project-list-page";
import { z } from "zod";
import { ChevronDown } from "lucide-react";

import ProjectCard from "~/features/projects/components/project-card";
import { getProjects, getProjectPages } from "~/features/projects/queries";
import ProjectPagination from "~/common/components/project-pagination";
import { makeSSRClient } from "~/lib/supa-client";
import { getUserById } from "~/features/users/queries";
import { Button } from "~/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { Input } from "~/common/components/ui/input";
import { SORT_OPTIONS, PERIOD_OPTIONS } from "../constants";

const searchParamsSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  sorting: z
    .enum(SORT_OPTIONS.map((opt) => opt.value) as [string, ...string[]])
    .optional()
    .default("newest"),
  period: z
    .enum(PERIOD_OPTIONS.map((opt) => opt.value) as [string, ...string[]])
    .optional()
    .default("all"),
  keyword: z.string().optional(),
  status: z.string().optional(),
});

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 프로젝트 목록",
    },
    {
      name: "description",
      content:
        "진행 중인 프로젝트와 자동화 성과를 확인하고 새 프로젝트를 시작하세요.",
    },
  ];
};

/**
 * 프로젝트 목록 데이터 로더 (서버 사이드)
 * Supabase에서 프로젝트 목록을 조회합니다 (페이지네이션 지원)
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const { success, data: parsedData } = searchParamsSchema.safeParse(
      Object.fromEntries(url.searchParams)
    );

    if (!success) {
      throw data(
        {
          error_code: "invalid_search_params",
          message: "Invalid search parameters",
        },
        { status: 400 }
      );
    }

    const { client } = makeSSRClient(request);

    // 현재 사용자 정보 가져오기 (선택적 인증 - 로그인하지 않아도 프로젝트 목록 접근 가능)
    let ownerProfileId: string | undefined = undefined;
    try {
      const { getLoggedInProfileId } = await import("~/features/users/queries");
      ownerProfileId = await getLoggedInProfileId(client);
    } catch (error: any) {
      // 로그인하지 않은 경우 또는 Rate limit 에러인 경우 계속 진행
      if (
        error?.status === 429 ||
        error?.code === "over_request_rate_limit"
      ) {
        console.error("Rate limit 도달 - 프로필 조회 건너뜀:", error);
      } else if (error && typeof error === "object" && "status" in error) {
        // redirect 에러는 무시 (로그인하지 않은 경우)
      } else {
        console.error("프로필 조회 실패:", error);
      }
      // 프로필이 없어도 계속 진행 (비로그인 사용자도 프로젝트 목록 접근 가능)
    }

    // 병렬로 프로젝트 목록과 총 페이지 수 조회 (동일한 필터링 적용)
    const [projects, totalPages] = await Promise.all([
      getProjects(client, {
        ownerProfileId,
        page: parsedData.page,
        sorting: parsedData.sorting,
        period: parsedData.period,
        keyword: parsedData.keyword,
        status: parsedData.status,
      }),
      getProjectPages(client, {
        ownerProfileId,
        period: parsedData.period,
        keyword: parsedData.keyword,
        status: parsedData.status,
      }),
    ]);

    return {
      projects: projects ?? [],
      totalPages,
      currentPage: parsedData.page,
      filters: {
        sorting: parsedData.sorting,
        period: parsedData.period,
        keyword: parsedData.keyword,
        status: parsedData.status,
      },
    };
  } catch (error) {
    console.error("프로젝트 목록 로드 실패:", error);
    // 에러 발생 시 기본값 반환 (UI는 계속 렌더링)
    return {
      projects: [],
      totalPages: 1,
      currentPage: 1,
      filters: {
        sorting: "newest" as const,
        period: "all" as const,
        keyword: undefined,
        status: undefined,
      },
    };
  }
}

/**
 * 숫자를 포맷팅하는 헬퍼 함수
 * 예: 2000 -> "2K", 33000 -> "33K"
 */
function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toString();
}

/**
 * CTR 값을 포맷팅하는 헬퍼 함수
 */
function formatCTR(ctr: number | null | undefined): string | undefined {
  if (ctr === null || ctr === undefined) return undefined;
  // TODO: 실제 CTR 계산 로직에 맞게 수정 필요
  return `Top${Math.round(ctr * 100)}%`;
}

/**
 * 예산 값을 포맷팅하는 헬퍼 함수
 */
function formatBudget(budget: number | null | undefined): string | undefined {
  if (budget === null || budget === undefined) return undefined;
  // TODO: 실제 예산 범위에 맞게 수정 필요
  if (budget >= 100000) return "High";
  if (budget >= 50000) return "Medium";
  return "Low";
}

export default function ProjectListPage() {
  const { projects, totalPages, currentPage, filters } =
    useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "all" && value !== "newest") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1"); // 필터 변경 시 첫 페이지로
    setSearchParams(newParams, { preventScrollReset: true });
  };

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === filters.sorting)?.label ||
    "최신순";
  const currentPeriodLabel =
    PERIOD_OPTIONS.find((opt) => opt.value === filters.period)?.label || "전체";

  return (
    <section className="flex h-full flex-col overflow-hidden">
      <div className="mb-8 flex flex-col gap-4">
        <h1>프로젝트 목록</h1>

        {/* 필터링 컨트롤 */}
        <div className="flex flex-wrap items-center gap-4">
          {/* 정렬 선택 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                정렬: {currentSortLabel}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => updateFilter("sorting", option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 기간 필터 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                기간: {currentPeriodLabel}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {PERIOD_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => updateFilter("period", option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 검색 */}
          <Form className="flex-1 min-w-[200px]" method="get">
            <Input
              type="text"
              name="keyword"
              placeholder="프로젝트 검색..."
              defaultValue={filters.keyword}
              className="max-w-sm"
            />
          </Form>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid gap-6 justify-start grid-cols-[repeat(auto-fit,minmax(220px,220px))]">
          <ProjectCard
            key="create"
            id="create"
            to="/my/dashboard/project/create"
            title="새 프로젝트 생성하기"
            description="빈 카드로 시작하거나 템플릿으로 만들기"
            isCreate
            ctaText="프로젝트 생성하기 →"
          />
          {projects.map((project) => {
            // 프로젝트 상태에 따라 라우팅 결정
            // "completed" 상태면 analytics로, 그 외에는 프로젝트 상세 페이지(index = workspace)로
            const projectRoute =
              project.status === "completed"
                ? `/my/dashboard/project/${project.project_id}/analytics`
                : `/my/dashboard/project/${project.project_id}`;

            return (
              <ProjectCard
                key={project.project_id}
                id={project.project_id}
                to={projectRoute}
                title={project.title}
                description={project.description || undefined}
                likes={formatNumber(project.likes)}
                ctr={formatCTR(project.ctr)}
                budget={formatBudget(project.budget)}
                thumbnail={project.thumbnail || undefined}
                status={project.status || undefined}
              />
            );
          })}
        </div>

        {/* 페이지네이션 */}
        <ProjectPagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </section>
  );
}
