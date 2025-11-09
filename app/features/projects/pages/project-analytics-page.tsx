"use client";

import * as React from "react";
import { type MetaFunction, useParams } from "react-router";
import {
  Youtube,
  Instagram,
  Linkedin,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import ProjectCard from "~/features/projects/components/project-card";
import { ProjectAnalyticsChart } from "~/features/projects/components/project-analytics-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import type { ChartConfig } from "~/common/components/ui/chart";
import { Typography } from "~/common/components/typography";

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

type ProjectAnalytics = {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  likes: string;
  ctr: string;
  budget: string;
  platformLinks: {
    youtube?: string;
    instagram?: string;
    linkedin?: string;
  };
  highlights: string[];
  recommendations: string[];
  metrics: {
    views: string;
    likes: string;
    saves: string;
    shareRate: string;
  };
};

const mockProjects: Record<string, ProjectAnalytics> = {
  "1": {
    id: "1",
    title: "Perfume Cinematic Brand Story",
    description: "9:16 Video • TikTok",
    thumbnail: "https://www.youtube.com/shorts/0Va3HYWMlz8",
    likes: "33K",
    ctr: "Top12%",
    budget: "High",
    platformLinks: {
      youtube: "https://www.youtube.com/watch?v=0Va3HYWMlz8",
      instagram: "https://www.instagram.com/",
      linkedin: "https://www.linkedin.com/",
    },
    highlights: [
      "초반 3초 내 향수를 보여주며 후킹 포인트를 명확히 전달했어요.",
      "9:16 비율을 활용해 제품 디테일을 시각적으로 강조했어요.",
      "사용자 리텐션이 28% 상승하며 시청 완료율이 크게 개선됐어요.",
    ],
    recommendations: [
      "향수 사용자의 라이프스타일을 보여주는 B-roll을 추가해보세요.",
      "UCG 스타일 리뷰 장면을 테스트해 진정성을 높여보세요.",
      "다음 영상에서는 '향 선택 팁' 등 문제 해결형 콘텐츠를 제안합니다.",
    ],
    metrics: {
      views: "1,238,220",
      likes: "118,432",
      saves: "24,510",
      shareRate: "12.3%",
    },
  },
  "2": {
    id: "2",
    title: "Perfume Aspirational Lifestyle Montage",
    description: "인플루언서의 썰",
    thumbnail: "https://youtube.com/shorts/GoGJ_ckzxvY?si=M4XLs-gXbSP7cGet",
    likes: "2K",
    ctr: "Top7%",
    budget: "High",
    platformLinks: {
      youtube: "https://youtube.com/shorts/GoGJ_ckzxvY?si=M4XLs-gXbSP7cGet",
      instagram: "https://www.instagram.com/",
    },
    highlights: [
      "생활 밀착형 톤으로 시청자의 공감대를 형성했어요.",
      "제품 사용 전/후 비교 컷으로 설득력을 확보했어요.",
      "30초 내 제품 정보가 자연스럽게 노출되며 광고 반감을 줄였어요.",
    ],
    recommendations: [
      "조명과 배경을 통일해 브랜드 톤앤매너를 강화해보세요.",
      "향수 전문가 인터뷰 클립을 삽입해 신뢰도를 높여보세요.",
      "시청자 참여형 Q&A를 기획해 커뮤니티 반응을 늘려보세요.",
    ],
    metrics: {
      views: "624,110",
      likes: "42,890",
      saves: "9,820",
      shareRate: "7.8%",
    },
  },
};

const revenueChartData = [
  { month: "7월", actual: 172500, expected: 160000 },
  { month: "8월", actual: 184200, expected: 175000 },
  { month: "9월", actual: 205400, expected: 198000 },
  { month: "10월", actual: 212900, expected: 210000 },
  { month: "11월", actual: 223832, expected: 218000 },
  { month: "12월 예상", actual: 0, expected: 236000 },
];

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
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId ?? "1";
  const project = mockProjects[projectId] ?? mockProjects["1"];

  const { totalActual, totalExpected, variance } = React.useMemo(() => {
    const totalActualValue = revenueChartData
      .map((item) => item.actual)
      .filter(Boolean)
      .reduce((sum, value) => sum + value, 0);
    const totalExpectedValue = revenueChartData
      .map((item) => item.expected)
      .reduce((sum, value) => sum + value, 0);
    const varianceValue = totalActualValue - totalExpectedValue;

    return {
      totalActual: totalActualValue,
      totalExpected: totalExpectedValue,
      variance: varianceValue,
    };
  }, []);

  const variancePositive = variance >= 0;

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
              id={project.id}
              to={`/my/dashboard/project/${project.id}`}
              title={project.title}
              description={project.description}
              likes={project.likes}
              ctr={project.ctr}
              budget={project.budget}
              thumbnail={project.thumbnail}
              className="shadow-sm"
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">채널 링크</CardTitle>
                <CardDescription>
                  해당 영상이 게시된 채널로 바로 이동해 실시간 반응을
                  확인하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {project.platformLinks.youtube ? (
                  <Button
                    asChild
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <a
                      href={project.platformLinks.youtube}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Youtube className="size-4 text-red-500" />
                      YouTube
                    </a>
                  </Button>
                ) : null}
                {project.platformLinks.instagram ? (
                  <Button
                    asChild
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <a
                      href={project.platformLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Instagram className="size-4 text-pink-500" />
                      Instagram
                    </a>
                  </Button>
                ) : null}
                {project.platformLinks.linkedin ? (
                  <Button
                    asChild
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <a
                      href={project.platformLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Linkedin className="size-4 text-blue-500" />
                      LinkedIn
                    </a>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          </aside>

          <main className="space-y-6">
            <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <Card className="bg-muted md:col-span-2">
                <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold md:text-xl">
                      이번 달 예상 수익
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed text-muted-foreground">
                      11월 기준 예상 수익과 실적 비교
                    </CardDescription>
                  </div>
                  <div className="flex items-baseline gap-3 text-3xl font-semibold">
                    <span>₩ {totalActual.toLocaleString()}</span>
                    <span className="text-base font-normal text-muted-foreground">
                      (누적 실제)
                    </span>
                  </div>
                </CardHeader>
              </Card>

              <Card className="md:row-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold md:text-xl">
                    성과 요약
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    실제 수익과 예상 수익의 차이
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                    <div className="flex items-center gap-2 text-base text-muted-foreground">
                      <span>실제 수익 합계</span>
                    </div>
                    <span className="text-lg font-semibold">
                      ₩ {totalActual.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                    <div className="flex items-center gap-2 text-base text-muted-foreground">
                      <span>예상 수익 합계</span>
                    </div>
                    <span className="text-lg font-semibold">
                      ₩ {totalExpected.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                    <div className="flex items-center gap-2 text-base text-muted-foreground">
                      {variancePositive ? (
                        <TrendingUp className="size-4 text-emerald-500" />
                      ) : (
                        <TrendingDown className="size-4 text-rose-500" />
                      )}
                      <span>
                        {variancePositive
                          ? "예상 대비 초과 달성"
                          : "예상 대비 미달"}
                      </span>
                    </div>
                    <span
                      className={`text-lg font-semibold ${
                        variancePositive ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {variancePositive ? "+" : "-"}₩{" "}
                      {Math.abs(variance).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

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
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium text-muted-foreground">
                    조회수
                  </CardTitle>
                  <CardDescription className="text-2xl font-semibold text-foreground">
                    {project.metrics.views}
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium text-muted-foreground">
                    좋아요
                  </CardTitle>
                  <CardDescription className="text-2xl font-semibold text-foreground">
                    {project.metrics.likes}
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium text-muted-foreground">
                    저장수
                  </CardTitle>
                  <CardDescription className="text-2xl font-semibold text-foreground">
                    {project.metrics.saves}
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium text-muted-foreground">
                    공유율
                  </CardTitle>
                  <CardDescription className="text-2xl font-semibold text-foreground">
                    {project.metrics.shareRate}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    수익 관점에서 잘한 점
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    든든AI가 분석한 이번 영상의 주요 성과 포인트입니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-base leading-relaxed text-foreground">
                    {project.highlights.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        <Typography
                          as="span"
                          variant="p"
                          className="text-base leading-relaxed text-muted-foreground not-first:mt-0"
                        >
                          {item}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    든든AI의 다음 제안
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    다음 콘텐츠 제작 시 고려하면 좋은 방향성입니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-base leading-relaxed text-foreground">
                    {project.recommendations.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                        <Typography
                          as="span"
                          variant="p"
                          className="text-base leading-relaxed text-muted-foreground not-first:mt-0"
                        >
                          {item}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
