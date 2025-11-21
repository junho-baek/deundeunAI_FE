import {
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
} from "react-router";
import type { Route } from "./+types/project-list-page";
import { z } from "zod";

import ProjectCard from "~/features/projects/components/project-card";
import { getProjects, getProjectPages } from "~/features/projects/queries";
import ProjectPagination from "~/common/components/project-pagination";

const searchParamsSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
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
      throw new Response("Invalid page parameter", { status: 400 });
    }

    const page = parsedData.page;

    // TODO: 실제 사용자 인증이 구현되면 ownerProfileId를 전달
    // const session = await getSession(request);
    // const ownerProfileId = session?.user?.id;
    const ownerProfileId = undefined;

    // 병렬로 프로젝트 목록과 총 페이지 수 조회
    const [projects, totalPages] = await Promise.all([
      getProjects(ownerProfileId, page),
      getProjectPages(ownerProfileId),
    ]);

    return {
      projects: projects ?? [],
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("프로젝트 목록 로드 실패:", error);
    // 에러 발생 시 기본값 반환 (UI는 계속 렌더링)
    return {
      projects: [],
      totalPages: 1,
      currentPage: 1,
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
  const { projects, totalPages, currentPage } = useLoaderData<typeof loader>();

  return (
    <section className="flex h-full flex-col overflow-hidden">
      <h1 className="mb-8">프로젝트 목록</h1>

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
