import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";
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

const plan = {
  name: "든든 수익 보장 플랜",
  price: "₩39,000",
  period: "/월 (VAT 별도)",
  description:
    "시니어 창작자의 첫 수익을 보장하기 위한 든든AI 대표 프로그램입니다.",
  features: [
    "무제한 쇼츠 스크립트 · 썸네일 · 대본 자동 생성",
    "시니어 전담 코치와 주 1회 수익 전략 점검",
    "AI 성우 + BGM 자동 믹스, 업로드 자동화",
    "목표 수익 미달 시 100% 환불 (정책 충족 시)",
  ],
};

const steps = [
  {
    title: "결제 수단 등록",
    description:
      "카드 정보를 입력하면 14일 무료 체험과 수익 책임제가 동시에 시작됩니다.",
  },
  {
    title: "전담 코치 배정",
    description:
      "24시간 이내 전담 코치가 연락드려 목표 수익과 콘텐츠 방향을 함께 설계합니다.",
  },
  {
    title: "수익 파이프라인 설정",
    description:
      "템플릿, 성우 스타일, 업로드 일정까지 시니어 친화형 워크플로우로 자동 설정됩니다.",
  },
];

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 구독 신청",
    },
    {
      name: "description",
      content:
        "든든 수익 보장 플랜에 가입하고 14일 무료 체험과 시니어 전담 코치 온보딩을 시작하세요.",
    },
  ];
};

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
        <header className="text-center">
          <Typography variant="h1" className="text-4xl md:text-5xl">
            든든 수익 보장 플랜으로 첫 수익을 만들어보세요
          </Typography>
          <Typography variant="lead" className="mt-4 text-muted-foreground">
            14일 동안 모든 기능을 제한 없이 체험하고, 제시된 가이드를 지키면
            수익을 보장받을 수 있습니다. 목표 수익에 미달하면 조건에 따라 전액
            환불을 도와드립니다.
          </Typography>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Card className="flex flex-col justify-between">
            <CardHeader className="gap-3">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="leading-relaxed">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-4 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="rounded-lg border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
                체험 종료 3일 전에 목표 달성 여부와 다음 단계를 안내드립니다.
                가이드대로 진행했는데도 수익이 나지 않았다면 환불 신청을
                도와드려요.
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 md:flex-row">
              <Button asChild size="lg" className="w-full md:flex-1">
                <Link to="/subscribe/success">수익 책임제 체험 시작</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full md:flex-1"
              >
                <Link to="/subscribe/fail">결제 장애 시나리오 테스트</Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="gap-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="size-5 text-primary" />
                  시니어 전용 온보딩 안내
                </CardTitle>
                <CardDescription>
                  3단계만 따라 하면 시니어도 쉽게 콘텐츠 제작과 수익화를 경험할
                  수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4 text-sm">
                  {steps.map((step, idx) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="mt-0.5 size-8 rounded-full bg-primary/10 text-center text-sm font-semibold leading-8 text-primary">
                        {idx + 1}
                      </span>
                      <div className="space-y-1">
                        <p className="font-semibold">{step.title}</p>
                        <p className="text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="gap-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck className="size-5 text-primary" />
                  결제 보안 & 수익 책임
                </CardTitle>
                <CardDescription>
                  안전한 결제 환경과 시니어 고객을 위한 맞춤 지원을 제공합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>· 결제 정보는 암호화되어 안전하게 저장됩니다.</p>
                <p>· 체험 기간 중에는 어떤 비용도 청구되지 않습니다.</p>
                <p>
                  · 가이드를 충족했는데도 수익이 나지 않으면 환불을 돕습니다.
                </p>
                <p>
                  · 궁금한 점이 있다면{" "}
                  <a
                    className="font-semibold text-primary underline-offset-4 hover:underline"
                    href="mailto:hello@ddeundeun.ai"
                  >
                    hello@ddeundeun.ai
                  </a>{" "}
                  로 문의해주세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
