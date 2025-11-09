import {
  AlarmClockIcon,
  ArrowRightIcon,
  BarChart3Icon,
  CogIcon,
  MessageSquareCodeIcon,
  RocketIcon,
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
  { label: "월 평균 추가 수익", value: "₩1,240,000" },
  { label: "주당 운영 시간", value: "5.5시간" },
  { label: "AI 자동화 비중", value: "78%" },
];

const caseStudies = [
  {
    name: "강다연 님 · 직장인 크리에이터",
    headline: "퇴근 후 2시간으로 의료정보 쇼츠 채널 운영",
    description:
      "병원 행정업무를 하면서 의료 지식 쇼츠를 제작합니다. AI가 생산한 캐릭터 음성과 스크립트를 활용해 주당 3편 콘텐츠를 꾸준히 올리고 있습니다.",
    impact: [
      "광고 수익 월 68만 원",
      "의료 기관 협업 제안 5건",
      "영상 제작 시간 70% 절감",
    ],
  },
  {
    name: "오민수 님 · 개발자 부업",
    headline: "B2B SaaS 리뷰 쇼츠로 월 유지수익 확보",
    description:
      "개발 지식을 살려 SaaS 리뷰를 제작하고, 자동 자막·썸네일 기능으로 제작 속도를 높였습니다. API 연동으로 노션에 콘텐츠 캘린더를 자동 기록합니다.",
    impact: [
      "리퍼럴 파트너십 9개",
      "ROI 430%",
      "자동화된 리포트로 광고주 리포트 생성",
    ],
  },
  {
    name: "정유라 님 · 디자인 프리랜서",
    headline: "썸네일 템플릿 판매와 멘토링까지 확장",
    description:
      "AI가 완성한 쇼츠가 입소문을 타면서 프리셋 상품을 판매하고 있습니다. 워크플로우 기록 기능으로 멘티에게 재사용 가능한 가이드를 제공하고 있습니다.",
    impact: [
      "월 구독자 4,200명 증가",
      "디지털 상품 결제 전환율 17%",
      "카카오 채널 리드 자동 확보",
    ],
  },
];

const automations = [
  {
    icon: AlarmClockIcon,
    title: "콘텐츠 캘린더 자동 추천",
    description:
      "업로드 빈도와 주당 시간을 입력하면 업계 트렌드를 분석해 최적의 업로드 캘린더를 생성합니다.",
  },
  {
    icon: MessageSquareCodeIcon,
    title: "브랜드 톤 자동 반영",
    description:
      "프롬프트에 브랜드 가이드를 업로드하면 모든 스크립트와 자막에 동일한 톤앤매너를 반영합니다.",
  },
  {
    icon: CogIcon,
    title: "API · 노코드 연동",
    description:
      "Webhook과 Zapier를 지원해 노션, 슬랙, 구글 드라이브와의 자동화 파이프라인을 몇 분 안에 설정할 수 있습니다.",
  },
];

const funnel = [
  {
    title: "트래픽 확보",
    detail:
      "AI가 추천한 해시태그와 썸네일 A/B 테스트로 조회 수를 확보하고, 자동 댓글 고정 기능으로 CTA를 노출합니다.",
  },
  {
    title: "리드 nurturing",
    detail:
      "채널별 DM 스크립트와 챗봇이 자동으로 잠재고객에게 콘텐츠 묶음과 제안을 전달합니다.",
  },
  {
    title: "수익 전환",
    detail:
      "문서·교육·컨설팅 서비스에 맞춰 결제 페이지 템플릿을 제공하고, 성과 리포트를 파트너에게 자동 발송합니다.",
  },
];

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 부업 활용 사례",
    },
    {
      name: "description",
      content:
        "부업인들이 든든AI 자동화를 통해 시간을 절약하고 수익을 확장한 사례와 운영 전략을 확인하세요.",
    },
  ];
};

export default function UsecasesFreelancerPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative border-b bg-linear-to-b from-muted/30 to-background">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 pb-16 pt-24 md:pt-28">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            <RocketIcon className="size-4" />
            Side Hustle
          </span>
          <Typography
            variant="h1"
            className="text-balance text-4xl md:text-5xl"
          >
            본업을 유지하면서도 자동화로 부업 수익을 키우는 방법
          </Typography>
          <Typography
            variant="lead"
            className="max-w-3xl text-muted-foreground"
          >
            든든AI는 부업인을 위해 콘텐츠 제작 시간을 줄이고, 수익 전환까지
            이어지는 자동화를 제공합니다. 광고, 디지털 상품, 컨설팅을 위한
            파이프라인을 준비해 드릴게요.
          </Typography>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/subscribe">
                자동화 워크플로우 체험하기
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/resources/blog">부업 운영 노하우 읽어보기</Link>
            </Button>
          </div>
          <div className="w-full max-w-4xl rounded-3xl border border-dashed border-muted/40 bg-linear-to-br from-muted/25 via-background to-muted/40 p-1">
            <div className="aspect-video w-full rounded-[calc(var(--radius-3xl)-4px)] bg-background/80" />
          </div>
          <Typography variant="muted" className="text-xs text-muted-foreground">
            ※ 향후 자동화 대시보드나 고객 사진을 배치할 수 있는 이미지
            슬롯입니다.
          </Typography>
          <div className="grid gap-4 rounded-2xl border border-muted/40 bg-background/70 p-6 backdrop-blur md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-primary/15 bg-primary/5 px-6 py-5 text-center"
              >
                <Typography
                  variant="large"
                  className="text-3xl font-bold text-primary"
                >
                  {stat.value}
                </Typography>
                <Typography variant="muted">{stat.label}</Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Typography variant="h3" className="md:text-3xl">
              부업 성공 스토리
            </Typography>
            <Typography variant="muted">
              다양한 업종의 부업인이 든든AI를 활용해 시간을 절약하고 수익화를
              실현한 사례입니다.
            </Typography>
          </div>
          <Button asChild variant="ghost">
            <Link to="/usecases/company">
              기업 협업 사례도 보기
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
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>{story.description}</p>
                <div className="rounded-xl bg-muted/20 p-4">
                  <Typography
                    variant="small"
                    className="mb-2 uppercase tracking-[0.2em] text-muted-foreground/80"
                  >
                    성과 하이라이트
                  </Typography>
                  <ul className="space-y-2">
                    {story.impact.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-left"
                      >
                        <BarChart3Icon className="mt-0.5 size-4 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-20">
          <div className="space-y-6">
            <Typography variant="h3" className="md:text-3xl">
              하루 30분 운영을 만드는 자동화
            </Typography>
            <Typography variant="muted">
              부업 시간을 최소화하고 결과는 극대화할 수 있도록 AI 자동화 모듈을
              제공합니다.
            </Typography>
            <div className="grid gap-5 md:grid-cols-3">
              {automations.map(({ icon: Icon, title, description }) => (
                <Card
                  key={title}
                  className="border-primary/20 bg-background/60"
                >
                  <CardHeader className="gap-3">
                    <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <CardTitle className="text-base font-semibold">
                      {title}
                    </CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <CogIcon className="size-4" />
                Growth Funnel
              </span>
              <CardTitle className="text-2xl font-bold">
                조회수에서 결제까지 자동으로 이어지는 퍼널
              </CardTitle>
              <CardDescription>
                조회수 확보부터 리드 nurturing, 전환까지 부업인에게 필요한
                여정을 템플릿으로 제공합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {funnel.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-xl border border-primary/15 bg-background/60 p-5"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" size="lg">
                <Link to="/auth/join">
                  부업 맞춤 워크플로우 받기
                  <ArrowRightIcon className="ml-2 size-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <div className="rounded-3xl border border-muted/40 bg-background/80 p-10 text-center shadow-xl">
          <Typography variant="h3" className="text-3xl">
            오늘 만드는 자동화가 다음 달 수익을 바꿉니다
          </Typography>
          <Typography variant="muted" className="mx-auto mt-4 max-w-3xl">
            체험 계정을 생성하면 자동화 템플릿과 맞춤 운영 리포트를 7일간 무료로
            제공합니다. 본업과 병행해도 무리 없는 워크플로우를 경험해 보세요.
          </Typography>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="ghost">
              <Link to="/usecases/senior">시니어 사례 다시 보기</Link>
            </Button>
            <Button asChild size="lg">
              <Link to="/subscribe">
                7일 무료 자동화 체험
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
