import {
  ArrowRightIcon,
  HandHeartIcon,
  LineChartIcon,
  MegaphoneIcon,
  SparklesIcon,
  UsersIcon,
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

const values = [
  {
    icon: HandHeartIcon,
    title: "시니어 친화적인 디자인",
    description:
      "든든AI는 큰 글자, 단순한 흐름, 전화 및 오프라인 지원 등 시니어 맞춤 UX를 가장 우선순위에 두고 설계합니다.",
  },
  {
    icon: SparklesIcon,
    title: "끝까지 책임지는 AI",
    description:
      "콘텐츠 기획부터 수익 분석까지 전 과정을 AI가 책임지고, 부족한 부분은 코치가 직접 개입해 결과를 만들어 냅니다.",
  },
  {
    icon: UsersIcon,
    title: "커뮤니티와 함께 성장",
    description:
      "전국의 시니어, 부업인, 기업 고객이 경험과 노하우를 공유하는 커뮤니티를 운영하며 함께 성장합니다.",
  },
];

const timeline = [
  {
    year: "2021",
    title: "아이디어 테스트",
    description:
      "시니어 대상 디지털 콘텐츠 제작 교육을 오프라인에서 진행하며 문제를 정의했습니다.",
  },
  {
    year: "2022",
    title: "든든AI 베타 출시",
    description:
      "AI 스크립트, 썸네일 자동화를 결합한 베타 버전을 100명의 베타 유저와 함께 다듬었습니다.",
  },
  {
    year: "2023",
    title: "수익 책임 프로그램 런칭",
    description:
      "수익 책임제를 도입해 사용자를 끝까지 지원했고, 첫 수익 달성률을 76%까지 끌어올렸습니다.",
  },
  {
    year: "2024",
    title: "엔터프라이즈 협업 확장",
    description:
      "지자체, 의료/금융 기관과의 협력을 통해 브랜드 캠페인을 위한 엔터프라이즈 기능을 완성했습니다.",
  },
];

const difference = [
  {
    title: "데이터 기반 운영",
    points: [
      "조회수, 체류 시간, 전환 데이터를 통합 분석",
      "AI가 추천하는 다음 콘텐츠 주제",
      "오프라인 상담 리포트와 자동 연동",
    ],
  },
  {
    title: "사람과 AI의 하이브리드",
    points: [
      "콘텐츠 코치가 직접 결과물을 검토",
      "필요시 촬영, 편집 파트너 연결",
      "60세 이상 고객을 위한 전화/방문 지원",
    ],
  },
  {
    title: "확장 가능한 생태계",
    points: [
      "API를 통한 업무시스템 연동",
      "파트너 마켓플레이스 제공",
      "프리미엄 워크숍과 온·오프라인 교육",
    ],
  },
];

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 소개",
    },
    {
      name: "description",
      content:
        "시니어와 부업인을 돕는 든든AI의 미션, 가치, 성장 스토리와 차별점을 알아보세요.",
    },
  ];
};

export default function ResourcesAboutPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-x-0 top-0 mx-auto h-72 max-w-6xl rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-6 pb-16 pt-24 text-center md:pt-28">
          <span className="inline-flex items-center gap-2 self-center rounded-full border border-primary/30 bg-primary/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            <SparklesIcon className="size-4" />
            About DDEUNDEUN AI
          </span>
          <Typography
            variant="h1"
            className="text-balance text-4xl md:text-5xl"
          >
            든든AI는 시니어와 부업인이 처음 수익을 만들도록 돕는 AI
            스튜디오입니다
          </Typography>
          <Typography
            variant="lead"
            className="mx-auto max-w-3xl text-muted-foreground"
          >
            기술이 익숙하지 않아도 마음 편히 도전할 수 있도록, AI 자동화와
            사람의 손길을 결합한 하이브리드 서비스를 제공합니다. 콘텐츠로 수익을
            만들고 싶은 누구나 든든하게 시작하고 성장할 수 있습니다.
          </Typography>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/pricing">
                요금제 살펴보기
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/resources/newsletter">뉴스레터 받아보기</Link>
            </Button>
          </div>
          <div className="w-full max-w-4xl rounded-3xl border border-dashed border-muted/40 bg-linear-to-br from-muted/30 via-background to-transparent p-1">
            <div className="aspect-video w-full rounded-[calc(var(--radius-3xl)-4px)] bg-background/80" />
          </div>
          <Typography variant="muted" className="text-xs text-muted-foreground">
            ※ 브랜드 스토리 이미지를 위해 남겨둔 자리입니다.
          </Typography>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-muted/50 bg-background/70">
              <CardHeader className="gap-4">
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Typography variant="h3" className="text-center md:text-3xl">
            든든AI 여정
          </Typography>
          <Typography
            variant="muted"
            className="mx-auto mt-3 max-w-2xl text-center"
          >
            고객의 목소리를 바탕으로 꾸준히 제품을 다듬으며 복잡한 디지털 경험을
            누구나 쓸 수 있는 서비스로 만들고 있습니다.
          </Typography>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {timeline.map((item) => (
              <Card
                key={item.year}
                className="border-muted/40 bg-background/80 text-left"
              >
                <CardHeader className="gap-3">
                  <CardTitle className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    {item.year}
                  </CardTitle>
                  <Typography variant="h4" className="text-lg font-semibold">
                    {item.title}
                  </Typography>
                  <CardDescription className="text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div className="space-y-6">
            <Typography variant="h3" className="md:text-3xl">
              든든AI가 만드는 차별화된 경험
            </Typography>
            <Typography variant="muted">
              단순 자동화를 넘어, 고객의 상황과 산업에 맞춰 성과를 설계해
              드립니다. 데이터 기반으로 동작하는 AI 스튜디오를 경험해 보세요.
            </Typography>
            <div className="space-y-6">
              {difference.map((section) => (
                <div
                  key={section.title}
                  className="rounded-2xl border border-muted/40 bg-muted/10 p-6"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                    <MegaphoneIcon className="size-4" />
                    {section.title}
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {section.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="mt-1 size-1.5 rounded-full bg-primary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <LineChartIcon className="size-4" />
                Impact
              </span>
              <CardTitle className="text-2xl font-bold">
                우리가 만들어 낸 결과
              </CardTitle>
              <CardDescription>
                고객의 데이터를 기반으로 성과를 측정하고, 매달 개선과 실험을
                반복하고 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 size-2 rounded-full bg-primary" />
                  <p className="text-left">
                    누적 8,500개 이상의 쇼츠 콘텐츠가 든든AI를 통해 제작 및
                    업로드 되었습니다.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 size-2 rounded-full bg-primary" />
                  <p className="text-left">
                    첫 수익 달성까지의 평균 기간이 9.8주에서 4.2주로
                    단축되었습니다.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 size-2 rounded-full bg-primary" />
                  <p className="text-left">
                    시니어 고객의 91%가 “다음에 다시 사용하고 싶다”고
                    응답했습니다.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-3xl border border-primary/30 bg-primary/10 p-10 text-center shadow-lg backdrop-blur">
          <Typography variant="h3" className="text-3xl">
            든든AI와 함께 새로운 수익 여정을 시작하세요
          </Typography>
          <Typography variant="muted" className="mx-auto mt-4 max-w-3xl">
            지금 무료 상담을 예약하고, 맞춤형 성장 전략을 받아보세요. 시니어,
            부업인, 브랜드 팀 모두에게 적합한 솔루션을 준비해 두었습니다.
          </Typography>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="ghost">
              <Link to="/usecases/senior">사용 사례 확인하기</Link>
            </Button>
            <Button asChild size="lg">
              <Link to="/subscribe">
                컨설턴트와 15분 상담 예약
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
