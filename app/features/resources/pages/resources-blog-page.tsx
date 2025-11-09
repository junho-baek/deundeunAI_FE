import {
  ArrowRightIcon,
  BookOpenIcon,
  ClockIcon,
  CompassIcon,
  FlameIcon,
  LayersIcon,
  PenSquareIcon,
} from "lucide-react";
import { Link, type MetaFunction } from "react-router";

import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Typography } from "~/common/components/typography";

const categories = [
  {
    name: "성공 사례",
    description: "실제 고객들이 든든AI로 성과를 만든 과정을 담았습니다.",
    icon: FlameIcon,
  },
  {
    name: "운영 전략",
    description: "콘텐츠 캘린더, 수익화 모델, 팀 협업 전략을 공유합니다.",
    icon: CompassIcon,
  },
  {
    name: "제품 업데이트",
    description: "새로운 기능과 워크플로우 팁을 상세하게 안내합니다.",
    icon: LayersIcon,
  },
];

const featuredPosts = [
  {
    title: "72세 김정자 님의 첫 수익까지 45일",
    category: "성공 사례",
    readTime: "8분",
    date: "2024.09.17",
    excerpt:
      "쓰기와 촬영 경험이 거의 없던 김정자 님이 든든AI와 전담 코치의 도움으로 첫 달 58만 원의 수익을 만든 과정을 정리했습니다.",
    to: "/usecases/senior",
  },
  {
    title: "부업인을 위한 콘텐츠 캘린더 자동화 가이드",
    category: "운영 전략",
    readTime: "6분",
    date: "2024.08.30",
    excerpt:
      "주 5시간 미만으로 채널을 운영하는 부업인을 위해 실전 자동화 체크리스트와 추천 템플릿을 정리했습니다.",
    to: "/usecases/freelancer",
  },
  {
    title: "API로 사내 시스템과 든든AI를 연결하는 방법",
    category: "제품 업데이트",
    readTime: "7분",
    date: "2024.07.25",
    excerpt:
      "엔터프라이즈 고객이 CRM, 노션, Slack과 든든AI를 연동해 브랜드 캠페인을 자동화하는 과정을 소개합니다.",
    to: "/api/docs",
  },
];

const recentPosts = [
  {
    title: "콘텐츠 초안 품질을 높이는 5가지 프롬프트",
    category: "운영 전략",
    readTime: "5분",
    date: "2024.11.02",
  },
  {
    title: "시니어 고객을 위한 온보딩 체크리스트 공개",
    category: "제품 업데이트",
    readTime: "4분",
    date: "2024.10.28",
  },
  {
    title: "수익 책임제를 통해 얻은 3가지 인사이트",
    category: "성공 사례",
    readTime: "6분",
    date: "2024.10.10",
  },
  {
    title: "쇼츠 채널의 광고 수익을 넘어 수익원을 확장하는 법",
    category: "운영 전략",
    readTime: "9분",
    date: "2024.09.22",
  },
  {
    title: "AI 코치가 점검하는 체크포인트",
    category: "제품 업데이트",
    readTime: "5분",
    date: "2024.09.03",
  },
];

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 블로그",
    },
    {
      name: "description",
      content:
        "콘텐츠 수익화 전략, 고객 사례, 제품 업데이트 등 든든AI가 전하는 실전 인사이트를 확인하세요.",
    },
  ];
};

export default function ResourcesBlogPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-x-0 top-0 mx-auto h-72 max-w-6xl rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-6 pb-16 pt-24 text-center md:pt-28">
          <span className="inline-flex items-center gap-2 self-center rounded-full border border-primary/30 bg-primary/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            <PenSquareIcon className="size-4" />
            DDEUNDEUN INSIGHTS
          </span>
          <Typography
            variant="h1"
            className="text-balance text-4xl md:text-5xl"
          >
            든든AI 팀이 공유하는 성장 전략과 고객 스토리
          </Typography>
          <Typography
            variant="lead"
            className="mx-auto max-w-3xl text-muted-foreground"
          >
            시니어, 부업인, 브랜드 팀이 실제로 활용한 전략과 데이터를 바탕으로
            콘텐츠 수익화를 돕는 실전 가이드를 제공합니다.
          </Typography>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/resources/newsletter">
                뉴스레터 구독하기
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/resources/about">든든AI 소개 읽기</Link>
            </Button>
          </div>
          <div className="w-full max-w-4xl rounded-3xl border border-dashed border-muted/40 bg-linear-to-br from-muted/25 via-background to-muted/40 p-1">
            <div className="aspect-video w-full rounded-[calc(var(--radius-3xl)-4px)] bg-background/80" />
          </div>
          <Typography variant="muted" className="text-xs text-muted-foreground">
            ※ 향후 블로그 대표 이미지 또는 카드뉴스가 들어갈 공간입니다.
          </Typography>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <Typography variant="h3" className="text-center md:text-3xl">
          인기 있는 아티클
        </Typography>
        <Typography
          variant="muted"
          className="mx-auto mt-3 max-w-2xl text-center"
        >
          많은 분들이 저장해 둔 아티클을 먼저 만나보세요. 각 포스트는 실제
          워크플로우와 템플릿, 데이터 분석을 담고 있습니다.
        </Typography>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <Card key={post.title} className="border-muted/50 bg-background/70">
              <CardHeader className="gap-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  <span>{post.category}</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <ClockIcon className="size-4" />
                    {post.readTime}
                  </span>
                </div>
                <CardTitle className="text-xl font-semibold">
                  {post.title}
                </CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{post.date}</span>
                <Link
                  to={post.to}
                  className="inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/80"
                >
                  자세히 보기
                  <ArrowRightIcon className="size-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Typography variant="h3" className="text-center md:text-3xl">
            카테고리별로 탐색하기
          </Typography>
          <Typography
            variant="muted"
            className="mx-auto mt-3 max-w-2xl text-center"
          >
            관심 있는 주제를 선택하면 관련 포스트를 추천해 드립니다. 모든
            아티클은 실전 템플릿과 PDF 자료를 함께 제공합니다.
          </Typography>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {categories.map(({ name, description, icon: Icon }) => (
              <Card key={name} className="border-muted/50 bg-background/70">
                <CardHeader className="gap-4">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle className="text-xl font-semibold">
                    {name}
                  </CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <Button asChild variant="link" className="px-0">
                    <Link to="/resources/newsletter">
                      최신 포스트 알림 받기
                      <ArrowRightIcon className="ml-2 size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.55fr_0.45fr]">
          <div>
            <Typography variant="h3" className="md:text-3xl">
              최신 포스트
            </Typography>
            <Typography variant="muted" className="mt-2">
              실전 사례와 데이터 분석 인사이트를 가장 먼저 확인하세요.
            </Typography>
            <div className="mt-8 space-y-4">
              {recentPosts.map((post) => (
                <div
                  key={post.title}
                  className="flex flex-col gap-2 rounded-xl border border-muted/40 bg-muted/10 p-5"
                >
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                    <span>{post.category}</span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <ClockIcon className="size-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <Typography variant="h4" className="text-lg font-semibold">
                    {post.title}
                  </Typography>
                  <Typography variant="muted" className="text-sm">
                    {post.date}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <BookOpenIcon className="size-4" />
                Resource Pack
              </span>
              <CardTitle className="text-2xl font-bold">
                블로그와 함께 제공되는 자료 모음
              </CardTitle>
              <CardDescription>
                각 포스트 말미에 첨부된 템플릿, 체크리스트, 리포트 샘플을 한
                번에 받아보세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <ArrowRightIcon className="mt-0.5 size-4 text-primary" />
                  <span>쇼츠 제작 프롬프트 30선과 스크립트 포맷</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRightIcon className="mt-0.5 size-4 text-primary" />
                  <span>채널 성장 대시보드 템플릿 (노션 · 구글시트)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRightIcon className="mt-0.5 size-4 text-primary" />
                  <span>수익 전환 퍼널 점검 체크리스트</span>
                </li>
              </ul>
            </CardContent>
            <CardContent>
              <Button asChild className="w-full" size="lg">
                <Link to="/resources/free">무료 자료 받기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-3xl border border-muted/40 bg-background/80 p-10 text-center shadow-xl">
          <Typography variant="h3" className="text-3xl">
            매주 수요일 오전, 인사이트를 메일로 받아보세요
          </Typography>
          <Typography variant="muted" className="mx-auto mt-4 max-w-3xl">
            뉴스레터를 구독하면 운영 템플릿과 영상 가이드, 오프라인 세미나
            초대장까지 한 번에 전달해 드립니다.
          </Typography>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/resources/newsletter">
                뉴스레터 무료 구독
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/resources/free">자료 보관함 열어보기</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
