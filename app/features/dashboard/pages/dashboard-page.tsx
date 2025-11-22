import { Sparkles, ArrowRight } from "lucide-react";
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
} from "react-router";
import type { Route } from "./+types/dashboard-page";

import {
  getRecentProjects,
  getProjectStats,
} from "~/features/projects/queries";
import {
  getMetricWidgets,
  getInsightsFromActivityFeed,
} from "~/features/dashboard/queries";
import { makeSSRClient } from "~/lib/supa-client";
import { DashboardHero } from "~/features/dashboard/components/dashboard-hero";
import { DashboardStatsGrid } from "~/features/dashboard/components/dashboard-stats-grid";
import {
  DashboardRecommendedPresets,
  type PresetProject,
} from "~/features/dashboard/components/dashboard-recommended-presets";
import { DashboardRecentProjects } from "~/features/dashboard/components/dashboard-recent-projects";
import {
  DashboardInsightsSection,
  type InsightItem,
} from "~/features/dashboard/components/dashboard-insights-section";

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

// 기본 인사이트 (활동 피드가 없을 때 사용)
const defaultInsights: InsightItem[] = [
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
 * 대시보드 데이터 로더 (서버 사이드)
 * 빠른 데이터(stats)는 즉시 로드하고, 느린 데이터는 Promise로 비동기 로드합니다
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const { client } = makeSSRClient(request);

    // 현재 사용자 정보 가져오기
    const {
      data: { user },
    } = await client.auth.getUser();

    let ownerProfileId: string | undefined = undefined;
    if (user) {
      try {
        const { getUserById } = await import("~/features/users/queries");
        const profile = await getUserById(client, { id: user.id });
        ownerProfileId = profile?.id;
      } catch (error: any) {
        // Rate limit 에러인 경우 재시도하지 않도록 처리
        if (
          error?.status === 429 ||
          error?.code === "over_request_rate_limit"
        ) {
          console.error("Rate limit 도달 - 프로필 조회 건너뜀:", error);
          // 프로필 없이 계속 진행
        } else {
          console.error("프로필 조회 실패:", error);
        }
        // 프로필이 없어도 계속 진행
      }
    }

    // 빠른 데이터는 즉시 로드 (View 사용으로 빠름)
    const stats = await getProjectStats(client, ownerProfileId);

    // 느린 데이터는 Promise로 비동기 로드 (defer 없이 직접 Promise 반환)
    return {
      stats, // 이미 resolve된 데이터
      recentProjects: getRecentProjects(client, 14, ownerProfileId, 10), // Promise (비동기)
      metricWidgets: getMetricWidgets(client, ownerProfileId), // Promise (비동기)
      insights: getInsightsFromActivityFeed(client, ownerProfileId, 3), // Promise (비동기)
    };
  } catch (error) {
    console.error("대시보드 데이터 로드 실패:", error);
    // 에러 발생 시 기본값 반환
    return {
      stats: {
        totalLikes: 0,
        totalViews: 0,
        averageCTR: 0,
        totalBudget: 0,
        projectCount: 0,
      },
      recentProjects: Promise.resolve([]),
      metricWidgets: Promise.resolve([]),
      insights: Promise.resolve([]),
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

          <DashboardStatsGrid
            stats={stats}
            metricWidgets={metricWidgets}
            formatCurrency={formatCurrency}
          />

          <DashboardRecommendedPresets items={presetProjects} />

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <DashboardRecentProjects
              recentProjects={recentProjects}
              formatNumber={formatNumber}
              formatCTR={formatCTR}
              formatBudget={formatBudget}
              getProjectUrl={(projectId) =>
                `/my/dashboard/project/${projectId}/analytics`
              }
            />

            <DashboardInsightsSection
              insights={insights}
              defaultInsights={defaultInsights}
            />
          </section>
        </div>
      </div>
    </section>
  );
}
