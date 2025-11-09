import {
  ArrowRightIcon,
  CheckCircle2Icon,
  HeartHandshakeIcon,
  PlayCircleIcon,
  SparklesIcon,
} from "lucide-react";
import { Link, type MetaFunction } from "react-router";

import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Typography } from "~/common/components/typography";

const stats = [
  { label: "첫 수익 발생까지 평균 기간", value: "4.5주" },
  { label: "콘텐츠 제작 만족도", value: "92%" },
  { label: "AI가 자동 생성한 스크립트 수", value: "월 380건" },
];

const caseStudies = [
  {
    name: "김정자 님 (67세)",
    headline: "AI가 대신 써준 스크립트로 첫 달 58만 원 수익",
    description:
      "평생 교육을 해오다 은퇴 후 새로운 도전을 시작했습니다. 손주와 함께 AI가 만들어 준 쇼츠를 업로드하면서 6주 만에 누적 조회수 28만 회를 달성했습니다.",
    highlights: [
      "손떨림을 고려한 큰 글자 모드",
      "전화 코칭과 대면 온보딩",
      "시간대별 인기 주제 추천",
    ],
  },
  {
    name: "양영호 님 (72세)",
    headline: "건강 케어 노하우를 1일 1쇼츠로 기록",
    description:
      "의사의 도움 없이 건강을 관리한 경험을 공유하고 싶었습니다. 든든AI가 대본과 썸네일을 만들어 주고, 자동 업로드 기능으로 매일 영상을 올리고 있습니다.",
    highlights: [
      "음성 더빙과 배경음악 자동 믹스",
      "투박한 설명을 자연스러운 말투로 변환",
      "정기 수익 분석 리포트",
    ],
  },
  {
    name: "박명자 님 (64세)",
    headline: "재봉 취미를 쇼핑몰로 연결해 월 120만 원 매출",
    description:
      "AI가 추천한 영상 포맷을 따라 만든 쇼츠가 입소문을 탔습니다. 채널을 통해 주문 문의를 받고, 라이브 커머스를 연동해 부업 매출을 만들고 있습니다.",
    highlights: [
      "재봉 키워드 라이브러리 제공",
      "쇼핑몰 연동 템플릿",
      "CS 자동 응답 스크립트",
    ],
  },
];

const journey = [
  {
    title: "AI 온보딩 세션",
    description:
      "전화 또는 방문 온보딩으로 계정 만들기부터 장비 세팅까지 1:1로 안내합니다.",
  },
  {
    title: "콘텐츠 자동 생성",
    description:
      "사진 몇 장과 이야기만 주시면 스크립트, 썸네일, 더빙이 한 번에 완성됩니다.",
  },
  {
    title: "업로드 · 수익 관리",
    description:
      "플랫폼별 업로드 시간 예약과 수익 리포트를 자동으로 제공해 드립니다.",
  },
];

const supportPrograms = [
  {
    title: "시니어 코치 전담제",
    description:
      "디지털 환경이 낯선 분들을 위해 동일 연령대 코치가 직접 진행 상황을 점검합니다.",
  },
  {
    title: "가족 초대 협업",
    description:
      "가족 계정을 초대해 자녀나 손주가 함께 제작을 도와드릴 수 있습니다.",
  },
  {
    title: "오프라인 모임",
    description:
      "월 1회 오프라인 워크숍에서 다른 시니어 크리에이터와 경험을 나눌 수 있습니다.",
  },
];

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 시니어 활용 사례",
    },
    {
      name: "description",
      content:
        "시니어 크리에이터들이 든든AI로 첫 수익을 만든 실제 사례와 지원 프로그램을 확인하세요.",
    },
  ];
};

export default function UsecasesSeniorPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-x-0 top-0 mx-auto h-80 max-w-6xl rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-6 pb-16 pt-24 text-center md:pt-28">
          <span className="inline-flex items-center gap-2 self-center rounded-full border border-primary/30 bg-primary/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            <SparklesIcon className="size-4" />
            Senior Makers
          </span>
          <Typography
            variant="h1"
            className="text-balance text-4xl md:text-5xl"
          >
            시니어도 AI와 함께 첫 수익을 만드는 든든한 파트너
          </Typography>
          <Typography
            variant="lead"
            className="mx-auto max-w-3xl text-muted-foreground"
          >
            든든AI는 디지털이 낯선 시니어 분도 쉽게 사용할 수 있도록 전화
            온보딩, 큰 글자 모드, 코치 전담제를 제공합니다. 처음부터 수익이
            나도록 기획·제작·분석을 모두 대신합니다.
          </Typography>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/subscribe">
                1:1 온보딩 예약하기
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/resources/about">
                시니어 전용 가이드 보기
                <PlayCircleIcon className="ml-2 size-5" />
              </Link>
            </Button>
          </div>
          <div className="w-full max-w-4xl rounded-3xl border border-dashed border-muted/40 bg-linear-to-br from-muted/30 via-background to-transparent p-1">
            <div className="aspect-video w-full rounded-[calc(var(--radius-3xl)-4px)] bg-background/80" />
          </div>
          <Typography variant="muted" className="text-xs text-muted-foreground">
            ※ 향후 온보딩 화면이나 고객 사진이 들어갈 자리입니다.
          </Typography>
          <div className="grid gap-4 rounded-2xl border border-muted-foreground/10 bg-background/60 p-6 backdrop-blur md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 rounded-xl border border-primary/10 bg-primary/5 px-4 py-5 text-center"
              >
                <Typography
                  variant="large"
                  className="text-3xl font-bold text-primary"
                >
                  {stat.value}
                </Typography>
                <Typography variant="muted" className="text-sm">
                  {stat.label}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Typography variant="h3" className="md:text-3xl">
              실제 시니어 크리에이터 사례
            </Typography>
            <Typography variant="muted">
              AI 워크플로우와 전담 코치의 도움으로 수익을 만든 세 분의 이야기를
              소개합니다.
            </Typography>
          </div>
          <Button asChild variant="outline">
            <Link to="/auth/join">
              성공 사례 커뮤니티 참여하기
              <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {caseStudies.map((story) => (
            <Card key={story.name} className="h-full border-muted/60">
              <CardHeader className="gap-3">
                <CardTitle className="text-xl font-semibold">
                  {story.headline}
                </CardTitle>
                <CardDescription className="text-sm font-medium text-foreground">
                  {story.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>{story.description}</p>
                <ul className="space-y-2 text-left">
                  {story.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <CheckCircle2Icon className="mt-0.5 size-4 text-primary" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-20">
          <div className="space-y-6">
            <Typography variant="h3" className="md:text-3xl">
              4주 만에 촬영부터 수익 정산까지
            </Typography>
            <Typography variant="muted">
              든든AI는 시니어를 위한 큰 글자 인터페이스와 오프라인 지원을 결합해
              첫 번째 수익이 나올 때까지 함께합니다.
            </Typography>
            <div className="space-y-5">
              {journey.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-xl border border-primary/20 bg-background/80 p-6 shadow-sm"
                >
                  <span className="mb-2 inline-flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <Typography variant="h4" className="text-lg font-semibold">
                    {step.title}
                  </Typography>
                  <Typography variant="muted" className="mt-2 text-sm">
                    {step.description}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="gap-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <HeartHandshakeIcon className="size-4" />
                Senior Care Plan
              </span>
              <CardTitle className="text-2xl font-bold">
                시니어 전용 지원 프로그램
              </CardTitle>
              <CardDescription>
                진행 상황에 맞춘 AI 코치와 오프라인 지원으로 지속 가능한 운영을
                돕습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <ul className="space-y-3">
                {supportPrograms.map((item) => (
                  <li
                    key={item.title}
                    className="flex gap-3 rounded-lg bg-background/70 p-3"
                  >
                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" size="lg">
                <Link to="/auth/join">
                  시니어 전용 계정 만들기
                  <ArrowRightIcon className="ml-2 size-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <div className="rounded-3xl border border-primary/30 bg-primary/10 p-10 text-center shadow-lg backdrop-blur">
          <Typography variant="h3" className="text-3xl">
            디지털이 처음이셔도 괜찮습니다.
          </Typography>
          <Typography variant="muted" className="mx-auto mt-4 max-w-3xl">
            든든AI 팀이 전화, 방문, 원격 도구로 끝까지 함께합니다. 지금 온보딩을
            신청하고 첫 쇼츠 제작을 무료로 경험해 보세요.
          </Typography>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-background text-foreground"
            >
              <Link to="/usecases/freelancer">다른 고객 사례 살펴보기</Link>
            </Button>
            <Button asChild size="lg">
              <Link to="/subscribe">
                무료 체험 시작하기
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
