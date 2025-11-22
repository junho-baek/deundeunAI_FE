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

    // TODO: 실제 사용자 인증이 구현되면 ownerProfileId를 전달
    // const session = await getSession(request);
    // const ownerProfileId = session?.user?.id;
    const ownerProfileId = undefined;

    // 병렬로 프로젝트 목록과 총 페이지 수 조회
    const [projects, totalPages] = await Promise.all([
      getProjects({
        ownerProfileId,
        page: parsedData.page,
        sorting: parsedData.sorting,
        period: parsedData.period,
        keyword: parsedData.keyword,
        status: parsedData.status,
      }),
      getProjectPages(ownerProfileId),
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
 * 프로젝트 목록 데이터 로더 (클라이언트 사이드)
 * 서버 데이터를 재사용하고 클라이언트 전용 작업을 수행합니다
 */
export const clientLoader = async ({
  serverLoader,
}: Route.ClientLoaderArgs) => {
  // 서버 데이터 가져오기
  const serverData = await serverLoader();

  // 클라이언트에서 추가 작업 수행
  if (typeof window !== "undefined") {
    // Analytics 추적 (예시)
    // analytics.track("project_list_viewed", {
    //   projectCount: serverData.projects.length,
    //   timestamp: new Date().toISOString(),
    // });

    // 클라이언트 전용 데이터 추가 (예: 최근 본 프로젝트, 필터링 등)
    // const recentViewedProjects = getRecentViewedProjects();
  }

  // 서버 데이터 그대로 반환
  return serverData;
};

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
          {projects.map((project) => (
            <ProjectCard
              key={project.project_id}
              id={project.project_id}
              to={`/my/dashboard/project/${project.project_id}/analytics`}
              title={project.title}
              description={project.description || undefined}
              likes={formatNumber(project.likes)}
              ctr={formatCTR(project.ctr)}
              budget={formatBudget(project.budget)}
              thumbnail={project.thumbnail || undefined}
            />
          ))}
        </div>

        {/* 페이지네이션 */}
        <ProjectPagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </section>
  );
}
