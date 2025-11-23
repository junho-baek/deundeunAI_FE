import * as React from "react";
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
  useParams,
} from "react-router";
import ProjectCard from "~/features/projects/components/project-card";
import { ProjectAnalyticsChart } from "~/features/projects/components/project-analytics-chart";
import { ProjectChannelLinks } from "~/features/projects/components/project-channel-links";
import { ProjectMetricCard } from "~/features/projects/components/project-metric-card";
import { ProjectInsightsList } from "~/features/projects/components/project-insights-list";
import { ProjectPerformanceSummary } from "~/features/projects/components/project-performance-summary";
import { ProjectRevenueHeader } from "~/features/projects/components/project-revenue-header";
import type { ChartConfig } from "~/common/components/ui/chart";
import { Typography } from "~/common/components/typography";
import {
  getProjectAnalytics,
  getProjectRevenueForecasts,
  getProjectByProjectId,
} from "~/features/projects/queries";
import { getProfileSlug } from "~/features/users/queries";
import { makeSSRClient } from "~/lib/supa-client";
import { getProjectRouteByStatus } from "~/features/projects/utils/navigation";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 프로젝트 분석",
    },
    {
      name: "description",
      content:
        "채널별 성과 지표와 추천 액션을 확인하고 다음 실험을 계획하세요.",
    },
  ];
};

/**
 * 프로젝트 분석 페이지 데이터 로더
 */
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = makeSSRClient(request);
  const projectId = params.projectId;

  if (!projectId || projectId === "create") {
    return {
      analytics: null,
      revenueForecasts: [],
      ownerSlug: null,
    };
  }

  try {
    // 프로젝트 소유자 확인 (접근 제어)
    const { getLoggedInProfileId } = await import("~/features/users/queries");
    const ownerProfileId = await getLoggedInProfileId(client);
    const project = await getProjectByProjectId(client, projectId);

    // 프로젝트가 없거나 소유자가 아닌 경우 접근 거부
    if (!project || project.owner_profile_id !== ownerProfileId) {
      const { redirect } = await import("react-router");
      throw redirect("/my/dashboard/projects");
    }

    // 이벤트 트래킹 (에러가 있어도 페이지는 계속 로드)
    try {
      await client.rpc("track_event", {
        event_type: "project_view",
        event_data: {
          project_id: projectId,
        },
      });
    } catch (error) {
      console.error("이벤트 트래킹 실패:", error);
    }

    const [analytics, revenueForecasts] = await Promise.all([
      getProjectAnalytics(client, projectId),
      getProjectRevenueForecasts(client, projectId, 6),
    ]);

    // owner slug 조회 (공개 프로필 링크용)
    let ownerSlug: string | null = null;
    if (project.owner_profile_id) {
      try {
        ownerSlug = await getProfileSlug(client, project.owner_profile_id);
      } catch (error) {
        console.error("프로필 slug 조회 실패:", error);
      }
    }

    return {
      analytics,
      revenueForecasts: revenueForecasts ?? [],
      ownerSlug,
    };
  } catch (error) {
    // redirect 에러는 그대로 전파
    if (error && typeof error === "object" && "status" in error) {
      throw error;
    }
    console.error("프로젝트 분석 데이터 로드 실패:", error);
    const { redirect } = await import("react-router");
    throw redirect("/my/dashboard/projects");
  }
}

/**
 * 숫자를 포맷팅하는 헬퍼 함수
 */
function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "0";
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`.replace(".0K", "K");
  }
  return num.toString();
}

/**
 * 큰 숫자를 포맷팅하는 헬퍼 함수 (콤마 포함)
 */
function formatLargeNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "0";
  return num.toLocaleString("ko-KR");
}

/**
 * CTR 값을 포맷팅하는 헬퍼 함수
 */
function formatCTR(ctr: number | null | undefined): string | undefined {
  if (ctr === null || ctr === undefined) return undefined;
  return `Top${Math.round(ctr * 100)}%`;
}

/**
 * 예산 값을 포맷팅하는 헬퍼 함수
 */
function formatBudget(budget: number | null | undefined): string | undefined {
  if (budget === null || budget === undefined) return undefined;
  if (budget >= 100000) return "High";
  if (budget >= 50000) return "Medium";
  return "Low";
}

/**
 * 날짜를 한국어 월 형식으로 변환
 */
function formatMonth(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  return `${month}월`;
}

const chartConfig = {
  actual: {
    label: "실제 수익",
    color: "hsl(var(--chart-1))",
  },
  expected: {
    label: "예상 수익",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function ProjectAnalyticsPage() {
  const { analytics, revenueForecasts, ownerSlug } =
    useLoaderData<typeof loader>();
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  // 데이터가 없을 경우 기본값 사용
  const project = analytics?.project;
  const highlights = analytics?.highlights ?? [];
  const recommendations = analytics?.recommendations ?? [];
  const channelLinks = analytics?.channelLinks ?? [];
  const latestMetrics = analytics?.latestMetrics;

  // 수익 차트 데이터 변환
  const revenueChartData = React.useMemo(() => {
    if (!revenueForecasts || revenueForecasts.length === 0) {
      // 기본 샘플 데이터 (데이터가 없을 때)
      return [
        { month: "7월", actual: 0, expected: 0 },
        { month: "8월", actual: 0, expected: 0 },
        { month: "9월", actual: 0, expected: 0 },
        { month: "10월", actual: 0, expected: 0 },
        { month: "11월", actual: 0, expected: 0 },
        { month: "12월 예상", actual: 0, expected: 0 },
      ];
    }

    return revenueForecasts.map((forecast: any) => ({
      month: formatMonth(forecast.month),
      actual: forecast.actual_revenue ? parseFloat(forecast.actual_revenue) : 0,
      expected: forecast.expected_revenue
        ? parseFloat(forecast.expected_revenue)
        : 0,
    }));
  }, [revenueForecasts]);

  // 수익 통계 계산
  const { totalActual, totalExpected, variance } = React.useMemo(() => {
    const totalActualValue = revenueChartData
      .map((item: { actual: number; expected: number }) => item.actual)
      .filter(Boolean)
      .reduce((sum: number, value: number) => sum + value, 0);
    const totalExpectedValue = revenueChartData
      .map((item: { actual: number; expected: number }) => item.expected)
      .reduce((sum: number, value: number) => sum + value, 0);
    const varianceValue = totalActualValue - totalExpectedValue;

    return {
      totalActual: totalActualValue,
      totalExpected: totalExpectedValue,
      variance: varianceValue,
    };
  }, [revenueChartData]);

  // 프로젝트가 없을 경우 처리
  if (!project) {
    return (
      <section className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col gap-8 px-4 py-8">
        <Typography variant="h3" className="text-center">
          프로젝트를 찾을 수 없습니다
        </Typography>
        <Typography variant="muted" className="text-center">
          프로젝트 ID: {projectId}
        </Typography>
      </section>
    );
  }

  return (
    <section className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-3 md:gap-4">
        <Typography
          as="div"
          variant="p"
          className="flex items-center gap-2 text-base text-muted-foreground first:mt-0"
        >
          <span>프로젝트 분석</span>
          <span aria-hidden="true" className="text-secondary-foreground">
            /
          </span>
          <span className="text-foreground">{project.title}</span>
        </Typography>
        <Typography
          as="h1"
          variant="h3"
          className="text-balance text-3xl font-semibold leading-snug tracking-tight text-foreground md:text-4xl"
        >
          {project.title}의 수익 & 퍼포먼스 인사이트
        </Typography>
        <Typography
          as="p"
          variant="lead"
          className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          든든AI가 {project.title} 콘텐츠의 성과를 분석하고, 다음 전략을
          제안합니다.
        </Typography>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-6">
            <ProjectCard
              id={project.project_id}
              to={getProjectRouteByStatus(project.project_id, project.status)}
              title={project.title}
              description={project.description || undefined}
              likes={formatNumber(project.likes)}
              ctr={formatCTR(project.ctr)}
              budget={formatBudget(project.budget)}
              thumbnail={project.thumbnail || undefined}
              className="shadow-sm"
              status={project.status || undefined}
            />

            <ProjectChannelLinks
              channelLinks={channelLinks.map((link: any) => ({
                channel: link.channel,
                url: link.url,
              }))}
            />
          </aside>

          <main className="space-y-6">
            <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <ProjectRevenueHeader
                amount={totalActual}
                className="md:col-span-2"
              />

              <ProjectPerformanceSummary
                actualRevenue={totalActual}
                expectedRevenue={totalExpected}
                className="md:row-span-2"
              />

              <ProjectAnalyticsChart
                title="수익 추이"
                description="최근 6개월간 실제 수익과 예상 수익 추세"
                data={revenueChartData}
                config={chartConfig}
                series={[
                  { key: "actual" },
                  { key: "expected", strokeDasharray: "5 5" },
                ]}
                xDataKey="month"
                yTickFormatter={(value) =>
                  `₩ ${(value / 1000).toLocaleString()}K`
                }
                tooltipLabelFormatter={(label) => String(label)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <ProjectMetricCard
                label="조회수"
                value={
                  latestMetrics
                    ? formatLargeNumber(latestMetrics.views)
                    : formatLargeNumber(project.views)
                }
              />
              <ProjectMetricCard
                label="좋아요"
                value={
                  latestMetrics
                    ? formatLargeNumber(latestMetrics.likes)
                    : formatLargeNumber(project.likes)
                }
              />
              <ProjectMetricCard
                label="CTR"
                value={
                  latestMetrics?.ctr
                    ? `${(latestMetrics.ctr * 100).toFixed(1)}%`
                    : project.ctr
                      ? `${(project.ctr * 100).toFixed(1)}%`
                      : "0%"
                }
              />
              <ProjectMetricCard
                label="도달수"
                value={
                  latestMetrics?.reach
                    ? formatLargeNumber(latestMetrics.reach)
                    : "-"
                }
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <ProjectInsightsList
                title="수익 관점에서 잘한 점"
                description="든든AI가 분석한 이번 영상의 주요 성과 포인트입니다."
                items={highlights.map((highlight: any) => ({
                  id: highlight.highlight_id,
                  text: highlight.highlight_text,
                }))}
                emptyMessage="하이라이트 데이터가 없습니다."
                dotColor="bg-emerald-500"
              />

              <ProjectInsightsList
                title="든든AI의 다음 제안"
                description="다음 콘텐츠 제작 시 고려하면 좋은 방향성입니다."
                items={recommendations.map((recommendation: any) => ({
                  id: recommendation.recommendation_id,
                  text: recommendation.recommendation_text,
                }))}
                emptyMessage="추천사항 데이터가 없습니다."
                dotColor="bg-sky-500"
              />
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
