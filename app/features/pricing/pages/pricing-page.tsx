import { Check, Sparkles } from "lucide-react";
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
import { cn } from "~/lib/utils";

const plans = [
  {
    name: "시니어 스타터",
    price: "₩0",
    period: "/월",
    description: "콘텐츠 제작을 처음 접하는 시니어를 위한 안전한 연습 공간",
    cta: "부담 없이 시작하기",
    to: "/auth/join",
    highlight: false,
    badge: "시니어 입문자",
    features: [
      "주 10회까지 스크립트 · 썸네일 아이디어 생성",
      "시니어 맞춤 온보딩 영상과 전화 가이드 1회",
      "보기 쉬운 큰 글자 편집 화면과 기본 프롬프트",
      "초안 저장 및 PDF 내보내기 지원",
    ],
  },
  {
    name: "든든 수익 보장 플랜",
    price: "₩39,000",
    period: "/월 (VAT 별도)",
    description: "시니어 크리에이터의 첫 수익을 보장하는 든든AI 대표 프로그램",
    cta: "14일 무료 체험 & 수익 책임제",
    to: "/subscribe",
    highlight: true,
    badge: "수익 책임제",
    features: [
      "무제한 쇼츠 스크립트 · 썸네일 · 대본 자동 생성",
      "시니어 전담 코치와 1:1 수익 설계 세션",
      "AI 성우 + 배경음악 자동 믹스, 업로드 자동화",
      "수익 보장 미달 시 100% 환불 (정책 기준 충족 시)",
    ],
  },
  {
    name: "스튜디오 팀",
    price: "₩149,000",
    period: "/월 (VAT 별도)",
    description:
      "시니어 운영진과 팀 크리에이터가 함께 성장하는 수익 파이프라인 설계",
    cta: "영업팀과 상담하기",
    to: "mailto:hello@ddeundeun.ai",
    highlight: false,
    badge: "팀 전용",
    features: [
      "팀원 5명까지 역할 관리 및 공동 작업",
      "브랜드별 수익 템플릿 라이브러리 제공",
      "API · 웹후크 연동 & 맞춤 리포트",
      "분기별 수익 전략 컨설팅과 현장 교육",
    ],
  },
] as const;

const highlights = [
  {
    title: "시니어 맞춤 온보딩",
    description:
      "폰트 크기부터 설명 방식까지 시니어 사용성을 고려한 워크플로우와 전담 코치가 함께합니다.",
  },
  {
    title: "수익 책임 프로그램",
    description:
      "컨설팅 가이드를 따라 운영하는 동안 목표 수익 미달 시 수강료를 전액 환불해드립니다.",
  },
  {
    title: "데이터 기반 운영",
    description:
      "AI가 리텐션과 CTR을 분석해 어떤 요소가 수익을 만드는지 한눈에 알려드립니다.",
  },
];

const faqs = [
  {
    question: "정말 시니어도 쉽게 사용할 수 있나요?",
    answer:
      "네. 큰 글자 UI, 쉬운 용어, 영상 가이드와 함께 전담 코치가 전화로 도와드리기 때문에 디지털 환경이 낯설어도 걱정하지 않으셔도 됩니다.",
  },
  {
    question: "수익 보장 조건은 어떻게 되나요?",
    answer:
      "든든 수익 보장 플랜 이용 시 제시해 드린 운영 가이드와 콘텐츠 업로드 횟수를 충족하면 목표 수익 미달 시 전액 환불을 지원합니다. 자세한 기준은 결제 단계에서 확인하실 수 있습니다.",
  },
  {
    question: "전담 코치는 어떻게 연결되나요?",
    answer:
      "결제 완료 후 24시간 이내 코치가 연락드려 목표 상담과 첫 콘텐츠 제작을 함께 진행합니다. 이메일이나 카카오톡으로도 상시 문의 가능합니다.",
  },
];

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 요금제",
    },
    {
      name: "description",
      content:
        "시니어와 팀을 위한 든든AI 요금제와 수익 책임 프로그램 혜택을 확인하세요.",
    },
  ];
};

export default function PricingPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-x-0 top-0 mx-auto h-64 max-w-5xl bg-primary/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-16 text-center md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <Sparkles className="size-4" />
            Pricing
          </span>
          <Typography
            variant="h1"
            className="text-balance text-4xl md:text-5xl"
          >
            시니어도 수익형 콘텐츠를 만들고, 든든AI가 끝까지 책임집니다
          </Typography>
          <Typography
            variant="lead"
            className="max-w-2xl text-muted-foreground"
          >
            콘텐츠 경험이 없어도 걱정 마세요. 든든AI가 기획부터 수익 검증까지
            동행하고, 수익이 나지 않으면 책임지고 환불해드립니다.
          </Typography>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/subscribe">수익 보장 플랜 무료로 체험하기</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/resources/about">시니어 성공 사례 살펴보기</Link>
            </Button>
          </div>
          <div className="mt-8 w-full max-w-4xl rounded-3xl border border-dashed border-muted/40 bg-linear-to-br from-muted/30 via-background to-transparent p-1">
            <div className="aspect-video w-full rounded-[calc(var(--radius-3xl)-4px)] bg-background/80" />
          </div>
          <Typography variant="muted" className="text-xs text-muted-foreground">
            ※ 향후 실제 서비스 스크린샷이나 고객 사진이 들어갈 자리입니다.
          </Typography>
        </div>
      </section>

      <section className="border-y bg-muted/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-20">
          <div className="space-y-6">
            <Typography variant="h3" className="text-2xl font-semibold">
              수익 파트너 모델은 이렇게 작동합니다
            </Typography>
            <Typography variant="muted">
              든든AI는 ‘도구형’ 생성 서비스와 다르게, 수익이 실제로 발생할
              때까지 자동화와 코치 지원을 결합합니다.
            </Typography>
            <ul className="space-y-4">
              {[
                {
                  title: "데이터로 검증된 워크플로우",
                  description:
                    "성과가 입증된 포맷과 시나리오만 제공해 불필요한 시행착오를 줄여 드립니다.",
                },
                {
                  title: "전담 코치 동행",
                  description:
                    "제작물과 성과를 주기적으로 점검해 개선 방향을 제안하고, 채널 운영을 함께 설계합니다.",
                },
                {
                  title: "성과 리포트 자동화",
                  description:
                    "조회수, 참여율, 예상 수익을 자동으로 추적해 다음 실험이 필요한 지점을 알려드립니다.",
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-muted/40 bg-background/70 p-5"
                >
                  <Typography variant="h4" className="text-lg font-semibold">
                    {item.title}
                  </Typography>
                  <Typography variant="muted" className="mt-2 text-sm">
                    {item.description}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl border border-muted/30 bg-background/70 p-6 shadow-sm">
              <div className="aspect-4/3 w-full rounded-2xl border border-dashed border-muted/40 bg-linear-to-br from-muted/20 via-background to-muted/40" />
              <Typography variant="muted" className="mt-3 text-xs">
                ※ 실제 고객 리포트나 수익 대시보드가 들어갈 이미지 슬롯입니다.
              </Typography>
            </div>
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
              <Typography variant="small" className="font-semibold uppercase">
                수익 책임제 안내
              </Typography>
              <Typography variant="muted" className="mt-3 text-sm">
                안내된 운영 가이드를 성실히 준수했음에도 목표 수익이 발생하지
                않을 경우, 이용료를 100% 환불해 드립니다. 온보딩에서 세부 기준과
                절차를 안내해 드립니다.
              </Typography>
              <Button asChild className="mt-4 w-full">
                <Link to="/auth/join">조건 자세히 살펴보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative flex flex-col justify-between border-muted",
                plan.highlight &&
                  "border-primary/70 shadow-lg shadow-primary/10 ring-2 ring-primary/10"
              )}
            >
              {plan.badge ? (
                <span
                  className={cn(
                    "absolute right-4 top-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary",
                    plan.highlight && "bg-primary text-primary-foreground"
                  )}
                >
                  {plan.badge}
                </span>
              ) : null}
              <CardHeader className="items-start gap-4">
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-left">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {plan.period}
                    </span>
                  </div>
                </div>
                <ul className="space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="size-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.to.startsWith("mailto:") ? (
                  <Button
                    asChild
                    className="w-full"
                    size="lg"
                    variant="outline"
                  >
                    <a href={plan.to}>{plan.cta}</a>
                  </Button>
                ) : (
                  <Button
                    asChild
                    className={cn("w-full", plan.highlight && "bg-primary")}
                    size="lg"
                  >
                    <Link to={plan.to}>{plan.cta}</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3 md:py-20">
          {highlights.map((item) => (
            <div key={item.title} className="space-y-3">
              <Typography variant="h3" className="text-xl font-semibold">
                {item.title}
              </Typography>
              <Typography variant="p" className="text-sm text-muted-foreground">
                {item.description}
              </Typography>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <Typography variant="h2" className="border-none text-center text-3xl">
          자주 묻는 질문
        </Typography>
        <div className="mt-10 space-y-8">
          {faqs.map((faq) => (
            <div key={faq.question} className="space-y-2 rounded-xl border p-6">
              <Typography variant="h3" className="text-lg">
                {faq.question}
              </Typography>
              <Typography variant="p" className="text-sm text-muted-foreground">
                {faq.answer}
              </Typography>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
