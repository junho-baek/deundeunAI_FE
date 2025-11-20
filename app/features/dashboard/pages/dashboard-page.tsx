import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  BarChart3,
  GaugeCircle,
} from "lucide-react";
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
} from "react-router";

import ProjectCard from "~/features/projects/components/project-card";
import {
  getRecentProjects,
  getProjectStats,
} from "~/features/projects/queries";
import {
  getMetricWidgets,
  getInsightsFromActivityFeed,
} from "~/features/dashboard/queries";
import { DashboardStatCard } from "~/features/dashboard/components/dashboard-stat-card";
import { DashboardHero } from "~/features/dashboard/components/dashboard-hero";
import { DashboardSection } from "~/features/dashboard/components/dashboard-section";
import { DashboardInsightsCard } from "~/features/dashboard/components/dashboard-insights-card";
import { DashboardProjectGrid } from "~/features/dashboard/components/dashboard-project-grid";

/**
 * 위젯 데이터를 통계 카드 형식으로 변환
 * 위젯이 없으면 기본 통계를 사용
 */
function getQuickStats(
  stats: {
    totalLikes: number;
    totalViews: number;
    averageCTR: number;
    totalBudget: number;
    projectCount: number;
  },
  metricWidgets: Array<{
    widget_id: string;
    title: string;
    config: Record<string, unknown>;
    position: number;
  }>
) {
  // 위젯이 있으면 위젯 데이터 사용, 없으면 기본 통계 사용
  if (metricWidgets.length > 0) {
    return metricWidgets
      .sort((a, b) => a.position - b.position) // position 순서대로 정렬
      .map((widget) => {
        const config = widget.config as {
          value?: string | number;
          delta?: string;
          trend?: "up" | "down" | "neutral";
          icon?: string;
          format?: "currency" | "percent" | "number";
        };

        // 아이콘 매핑
        const iconMap: Record<string, typeof TrendingUp> = {
          TrendingUp,
          BarChart3,
          GaugeCircle,
        };
        const Icon = iconMap[config.icon || "TrendingUp"] || TrendingUp;

        // 트렌드 기본값
        const trend = (config.trend || "neutral") as "up" | "down" | "neutral";

        // 값 포맷팅
        let value = config.value?.toString() || "0";
        if (typeof config.value === "number") {
          // format 설정에 따라 포맷팅
          if (
            config.format === "currency" ||
            widget.title.includes("매출") ||
            widget.title.includes("수익")
          ) {
            value = formatCurrency(config.value);
          } else if (
            config.format === "percent" ||
            widget.title.includes("전환율") ||
            widget.title.includes("CTR")
          ) {
            value = `${config.value}%`;
          } else {
            value = config.value.toLocaleString();
          }
        }

        return {
          id: widget.widget_id,
          label: widget.title,
          value,
          delta: config.delta || "",
          trend,
          icon: Icon,
        };
      });
  }

  // 기본 통계 (위젯이 없을 때)
  return [
    {
      id: "revenue",
      label: "이번 주 예상 매출",
      value: formatCurrency(stats.totalBudget || 4380000),
      delta: "지난주 대비 +18%",
      trend: "up" as const,
      icon: TrendingUp,
    },
    {
      id: "conversion",
      label: "주요 전환율",
      value:
        stats.averageCTR > 0
          ? `${(stats.averageCTR * 100).toFixed(1)}%`
          : "3.8%",
      delta: "AI 프리셋 적용 후 +0.6pp",
      trend: "up" as const,
      icon: BarChart3,
    },
    {
      id: "runtime",
      label: "자동화 실행 시간 절감",
      value: "42분",
      delta: "예상 대비 -12분",
      trend: "down" as const,
      icon: GaugeCircle,
    },
  ];
}

type PresetProject = {
  id: string;
  to: string;
  title: string;
  description: string;
  likes: string;
  ctr: string;
  budget: string;
  thumbnail: string;
};

const presetProjects: PresetProject[] = [
  {
    id: "profit-guarantee-collection",
    to: "/my/dashboard/project/create?preset=profit-guarantee",
    title: "수익 보장형 런칭 5컷 패키지",
    description: "전자상거래 런칭에 적합한 고전환 숏폼 세트",
    likes: "12K",
    ctr: "Top4%",
    budget: "Mid",
    thumbnail: "https://www.youtube.com/shorts/54g2JQ15GYg",
  },
  {
    id: "perfume-repurchase",
    to: "/my/dashboard/project/create?preset=repeat-customer",
    title: "재구매 유도 리텐션 시리즈",
    description: "기존 고객 대상 구매 주기 단축 시나리오",
    likes: "8.4K",
    ctr: "Top6%",
    budget: "Low",
    thumbnail: "https://www.youtube.com/shorts/0Va3HYWMlz8",
  },
  {
    id: "ugc-spark",
    to: "/my/dashboard/project/create?preset=ugc-profit",
    title: "UCG 기반 수익 보장형 하이라이트",
    description: "고객 리뷰와 성과를 결합한 베스트셀러 전용",
    likes: "17K",
    ctr: "Top3%",
    budget: "High",
    thumbnail: "https://youtube.com/shorts/GoGJ_ckzxvY",
  },
];

// recentProjects, insights는 loader에서 가져옴

// 기본 인사이트 (활동 피드가 없을 때 사용)
const defaultInsights = [
  {
    title: "AI가 자동으로 A/B 실험 캘린더를 생성해요",
    description:
      "프리셋을 실행하면 플랫폼별로 최적 시간대와 컷 구성을 제안하고, 결과에 따라 다음 실험을 예약합니다.",
  },
  {
    title: "수익 보장형 프리셋은 평균 ROAS 184%를 기록했어요",
    description:
      "최근 30일 누적 데이터 기준, 동종 업계 대비 2.6배 높은 클릭률을 보여줬어요.",
  },
  {
    title: "크리에이터 리소스가 절감돼요",
    description:
      "스토리보드, 스크립트, 배포 세팅까지 자동 완성되어 제작 시간을 평균 42분 단축했습니다.",
  },
];

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 대시보드",
    },
    {
      name: "description",
      content: "프로젝트 현황과 수익 지표를 한눈에 확인하세요.",
    },
  ];
};

/**
 * 대시보드 데이터 로더
 * 최근 프로젝트 목록, 통계 데이터, 위젯, 활동 피드를 조회합니다
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // TODO: 실제 사용자 인증이 구현되면 ownerProfileId를 전달
    // const session = await getSession(request);
    // const ownerProfileId = session?.user?.id;
    const ownerProfileId = undefined; // 임시로 undefined 사용

    // 병렬로 데이터 조회
    const [recentProjects, stats, metricWidgets, insights] = await Promise.all([
      getRecentProjects(14, undefined, 10), // 최근 14일 내 업데이트된 프로젝트 최대 10개
      getProjectStats(undefined),
      getMetricWidgets(ownerProfileId), // 메트릭 위젯 조회
      getInsightsFromActivityFeed(ownerProfileId, 3), // 활동 피드에서 인사이트 조회
    ]);

    return {
      recentProjects: recentProjects ?? [],
      stats,
      metricWidgets: metricWidgets ?? [],
      insights: insights ?? [],
    };
  } catch (error) {
    console.error("대시보드 데이터 로드 실패:", error);
    // 에러 발생 시 기본값 반환
    return {
      recentProjects: [],
      stats: {
        totalLikes: 0,
        totalViews: 0,
        averageCTR: 0,
        totalBudget: 0,
        projectCount: 0,
      },
      metricWidgets: [],
      insights: [],
    };
  }
}

/**
 * 숫자를 포맷팅하는 헬퍼 함수
 * 예: 2000 -> "2K", 33000 -> "33K"
 */
function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`.replace(".0K", "K");
  }
  return num.toString();
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
 * 금액을 포맷팅하는 헬퍼 함수
 */
function formatCurrency(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

export default function DashboardPage() {
  const { recentProjects, stats, metricWidgets, insights } =
    useLoaderData<typeof loader>();

  // 인사이트 데이터: 활동 피드에서 가져온 데이터가 있으면 사용, 없으면 기본값 사용
  const displayInsights = insights.length > 0 ? insights : defaultInsights;

  return (
    <section className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-8 md:px-10">
        <div className="flex flex-col gap-8 pb-12">
          <DashboardHero
            badge={{
              icon: Sparkles,
              text: "든든AI 프리셋 추천",
            }}
            title="대시보드에는 이미 검증된 프리셋이 준비되어 있어요"
            description="최근 캠페인에서 가장 높은 수익을 만든 수익 보장형 콘텐츠 프리셋으로 오늘의 실험을 시작해보세요. 제작-배포-분석까지 자동으로 연결됩니다."
            primaryAction={{
              label: "수익 보장형 프리셋 바로 실행하기",
              href: "/my/dashboard/project/create?preset=profit-guarantee",
              icon: ArrowRight,
            }}
            secondaryAction={{
              label: "모든 프리셋 둘러보기",
              href: "/my/dashboard/project",
            }}
          />

          <div className="grid gap-4 md:grid-cols-3">
            {getQuickStats(stats, metricWidgets).map((stat) => (
              <DashboardStatCard
                key={stat.id}
                label={stat.label}
                value={stat.value}
                delta={stat.delta}
                trend={stat.trend}
                icon={stat.icon}
              />
            ))}
          </div>

          <DashboardSection
            title="이번 주 추천 프리셋"
            description="든든AI가 최근 실험 로그와 광고 효율 데이터를 분석해 가장 높은 ROAS를 만든 프리셋을 골랐어요."
            className="flex flex-col gap-4"
          >
            <DashboardProjectGrid
              items={presetProjects}
              renderItem={(preset, index) => (
                <ProjectCard
                  key={`${preset.id}-${index}`}
                  id={preset.id}
                  to={preset.to}
                  title={preset.title}
                  description={preset.description}
                  likes={preset.likes}
                  ctr={preset.ctr}
                  budget={preset.budget}
                  thumbnail={preset.thumbnail}
                />
              )}
            />
          </DashboardSection>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <DashboardSection
              title="최근 실행한 프로젝트"
              description="본인이 직접 제작한 프로젝트 중 최근 14일 안에 업데이트된 캠페인이에요."
              className="flex flex-col gap-4"
            >
              <DashboardProjectGrid
                items={recentProjects}
                renderItem={(project) => (
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
                )}
                emptyMessage="최근 프로젝트가 없습니다. 새 프로젝트를 생성해보세요."
              />
            </DashboardSection>
            <DashboardInsightsCard
              title="AI 인사이트"
              description="수익 보장형 프리셋을 실행하면 바로 체감할 변화예요."
              items={displayInsights}
            />
          </section>
        </div>
      </div>
    </section>
  );
}
