import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  BarChart3,
  GaugeCircle,
  CheckCircle2,
} from "lucide-react";
import { type MetaFunction } from "react-router";

import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Typography } from "~/common/components/typography";
import ProjectCard from "~/features/projects/components/project-card";

const quickStats = [
  {
    id: "revenue",
    label: "이번 주 예상 매출",
    value: "₩4,380,000",
    delta: "지난주 대비 +18%",
    trend: "up" as const,
    icon: TrendingUp,
  },
  {
    id: "conversion",
    label: "주요 전환율",
    value: "3.8%",
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
] as const;

const presetProjects = [
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
] as const;

const recentProjects = [
  {
    id: "1",
    to: "/my/dashboard/project/1/analytics",
    title: "Perfume Cinematic Brand Story",
    description: "9:16 Video • TikTok",
    likes: "33K",
    ctr: "Top12%",
    budget: "High",
    thumbnail: "https://www.youtube.com/shorts/0Va3HYWMlz8",
  },
  {
    id: "2",
    to: "/my/dashboard/project/2/analytics",
    title: "Perfume Aspirational Lifestyle Montage",
    description: "인플루언서의 썰",
    likes: "2K",
    ctr: "Top7%",
    budget: "High",
    thumbnail: "https://youtube.com/shorts/GoGJ_ckzxvY?si=M4XLs-gXbSP7cGet",
  },
  {
    id: "3",
    to: "/my/dashboard/project/3/analytics",
    title: "향수 신제품 UGC 리뷰",
    description: "UGC | 구매 전환 최적화",
    likes: "4.6K",
    ctr: "Top9%",
    budget: "Mid",
    thumbnail: "https://www.tiktok.com/@mukguna/video/7566270993438608647",
  },
] as const;

const insightBullets = [
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
] as const;

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

export default function DashboardPage() {
  return (
    <section className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-8 md:px-10">
        <div className="flex flex-col gap-8 pb-12">
          <header className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-primary/10 via-primary/5 to-transparent px-8 py-10 shadow-sm">
            <div className="flex flex-col gap-4">
              <span className="flex items-center gap-2 text-sm font-medium text-primary">
                <Sparkles className="size-4" aria-hidden="true" />
                든든AI 프리셋 추천
              </span>
              <Typography
                as="h1"
                variant="h3"
                className="text-balance text-3xl font-semibold leading-tight text-foreground md:text-4xl"
              >
                대시보드에는 이미 검증된 프리셋이 준비되어 있어요
              </Typography>
              <Typography
                as="p"
                variant="lead"
                className="max-w-2xl text-base text-muted-foreground md:text-lg"
              >
                최근 캠페인에서 가장 높은 수익을 만든 수익 보장형 콘텐츠
                프리셋으로 오늘의 실험을 시작해보세요. 제작-배포-분석까지
                자동으로 연결됩니다.
              </Typography>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button size="lg" className="gap-2" asChild>
                  <a href="/my/dashboard/project/create?preset=profit-guarantee">
                    수익 보장형 프리셋 바로 실행하기
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/my/dashboard/project">모든 프리셋 둘러보기</a>
                </Button>
              </div>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              const trendColor =
                stat.trend === "up"
                  ? "text-emerald-600"
                  : stat.trend === "down"
                    ? "text-sky-600"
                    : "text-muted-foreground";
              return (
                <Card key={stat.id}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardDescription>{stat.label}</CardDescription>
                    <span className="rounded-full bg-muted p-2 text-primary">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-1">
                    <CardTitle className="text-2xl font-semibold">
                      {stat.value}
                    </CardTitle>
                    <span className={`text-sm font-medium ${trendColor}`}>
                      {stat.delta}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <Typography
                as="h2"
                variant="h3"
                className="text-2xl font-semibold leading-tight text-foreground"
              >
                이번 주 추천 프리셋
              </Typography>
              <Typography
                variant="muted"
                className="max-w-xl text-sm md:text-base"
              >
                든든AI가 최근 실험 로그와 광고 효율 데이터를 분석해 가장 높은
                ROAS를 만든 프리셋을 골랐어요.
              </Typography>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,220px))] justify-start gap-6">
              {presetProjects.map((preset, index) => (
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
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="flex flex-col gap-4">
              <Typography
                as="h2"
                variant="h3"
                className="text-2xl font-semibold leading-tight text-foreground"
              >
                최근 실행한 프로젝트
              </Typography>
              <Typography
                variant="muted"
                className="max-w-2xl text-sm md:text-base"
              >
                본인이 직접 제작한 프로젝트 중 최근 14일 안에 업데이트된
                캠페인이에요.
              </Typography>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,220px))] justify-start gap-6">
                {recentProjects.map((project, index) => (
                  <ProjectCard
                    key={`${project.id}-${index}`}
                    id={project.id}
                    to={project.to}
                    title={project.title}
                    description={project.description}
                    likes={project.likes}
                    ctr={project.ctr}
                    budget={project.budget}
                    thumbnail={project.thumbnail}
                  />
                ))}
              </div>
            </div>
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>AI 인사이트</CardTitle>
                <CardDescription>
                  수익 보장형 프리셋을 실행하면 바로 체감할 변화예요.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {insightBullets.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      className="mt-1 size-4 text-primary"
                      aria-hidden="true"
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </section>
  );
}
