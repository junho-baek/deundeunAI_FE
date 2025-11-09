import {
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { type MetaFunction } from "react-router";

import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Separator } from "~/common/components/ui/separator";
import { Typography } from "~/common/components/typography";

const planBenefits = [
  "수익 보장형 프리셋 20회/월 제공",
  "자동 리포트 좌석 5개 · 협업 워크스페이스",
  "API 크레딧 100K /월 · 초과 시 자동 충전",
] as const;

const upcomingBilling = {
  plan: "Growth 50K",
  price: "₩149,000 /월 (VAT 별도)",
  renewalDate: "2025.11.28",
  usage: "이번 달 프리셋 사용 12회 / 20회",
};

const paymentMethod = {
  brand: "Hyundai Card",
  last4: "4821",
  holder: "이은재",
  expires: "08/27",
  billingEmail: "finance@deundeun.ai",
  autoTopup: "AI 자동 크레딧 충전 ON · 크레딧 10K 미만 시 50K 자동 충전",
};

const invoices = [
  {
    id: "INV-2025-10",
    date: "2025.10.28",
    amount: "₩149,000",
    status: "결제완료",
    link: "#",
  },
  {
    id: "INV-2025-09",
    date: "2025.09.28",
    amount: "₩149,000",
    status: "결제완료",
    link: "#",
  },
  {
    id: "INV-2025-08",
    date: "2025.08.28",
    amount: "₩149,000",
    status: "결제완료",
    link: "#",
  },
] as const;

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 결제 설정",
    },
    {
      name: "description",
      content: "구독 플랜, 결제 수단, 청구 내역을 관리하세요.",
    },
  ];
};

export default function SettingsBillingPage() {
  return (
    <section className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-8 md:px-10">
        <div className="flex flex-col gap-8 pb-12">
          <header className="flex flex-col gap-3">
            <Typography
              as="h1"
              variant="h3"
              className="text-balance text-3xl font-semibold leading-tight text-foreground md:text-4xl"
            >
              결제 & 플랜 관리
            </Typography>
            <Typography
              as="p"
              variant="lead"
              className="max-w-2xl text-base text-muted-foreground md:text-lg"
            >
              구독 플랜과 결제 수단, 청구 이력을 한 곳에서 확인하세요. 플랜 변경
              사항은 즉시 적용되며, 프로젝트 자동화 한도에도 반영됩니다.
            </Typography>
          </header>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <Card>
              <CardHeader>
                <CardTitle>현재 플랜 · {upcomingBilling.plan}</CardTitle>
                <CardDescription>{upcomingBilling.price}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border bg-primary/5 px-4 py-3">
                    <p className="text-xs text-muted-foreground">다음 결제일</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {upcomingBilling.renewalDate}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      결제일 하루 전에 이메일로 알려드려요.
                    </p>
                  </div>
                  <div className="rounded-2xl border bg-muted/30 px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      프리셋 사용 현황
                    </p>
                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {upcomingBilling.usage}
                    </p>
                    <p className="text-xs text-emerald-600">
                      수익 보장형 프리셋 추천 3회 남음
                    </p>
                  </div>
                </div>

                <Separator />

                <ul className="flex flex-col gap-3 text-sm">
                  {planBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-0.5 size-4 text-primary"
                        aria-hidden="true"
                      />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-3">
                <Button size="sm" className="gap-2" asChild>
                  <a href="/pricing">
                    업그레이드 옵션 보기
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </Button>
                <Button size="sm" variant="outline">
                  플랜 일시 정지
                </Button>
              </CardFooter>
            </Card>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle>결제 수단</CardTitle>
                <CardDescription>
                  마지막 결제 · 2025.10.28 {paymentMethod.brand} ••••{" "}
                  {paymentMethod.last4}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-start gap-3 rounded-2xl border bg-muted/30 px-4 py-3">
                  <span className="rounded-full bg-background p-2 text-primary">
                    <CreditCard className="size-4" aria-hidden="true" />
                  </span>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-foreground">
                      {paymentMethod.brand} · {paymentMethod.last4}
                    </p>
                    <p className="text-muted-foreground">
                      {paymentMethod.holder} · 만료 {paymentMethod.expires}
                    </p>
                  </div>
                </div>

                <dl className="grid gap-3 text-sm text-muted-foreground">
                  <div>
                    <dt className="font-medium text-foreground">청구 이메일</dt>
                    <dd>{paymentMethod.billingEmail}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-foreground">
                      자동 충전 설정
                    </dt>
                    <dd>{paymentMethod.autoTopup}</dd>
                  </div>
                </dl>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-3">
                <Button size="sm" variant="outline">
                  결제 수단 변경
                </Button>
                <Button size="sm" variant="ghost">
                  청구 정보 수정
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>청구 내역</CardTitle>
              <CardDescription>
                결제 영수증은 팀과 공유하거나 다운로드할 수 있어요.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex flex-col gap-3 rounded-2xl border px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className="rounded-full bg-muted p-2 text-primary">
                      <Receipt className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {invoice.date}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        청구서 번호 · {invoice.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
                    <span className="text-sm font-semibold text-foreground">
                      {invoice.amount}
                    </span>
                    <span className="text-xs font-medium text-emerald-600">
                      {invoice.status}
                    </span>
                    <Button size="sm" variant="outline" asChild>
                      <a href={invoice.link}>영수증 다운로드</a>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <ShieldCheck className="size-4" aria-hidden="true" />
                결제 보안 안내
              </CardTitle>
              <CardDescription className="text-sm text-primary/80">
                모든 결제 정보는 PCI-DSS 기준으로 암호화되어 저장됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              청구 관련 문의는{" "}
              <span className="font-medium text-primary">
                billing@deundeun.ai
              </span>{" "}
              로 연락해주세요. 결제 실패 시 자동으로 3회 재시도되며, 실패가
              지속되면 프로젝트 자동화가 일시 정지됩니다.
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
