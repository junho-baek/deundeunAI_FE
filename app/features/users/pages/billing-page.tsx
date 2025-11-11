import { type MetaFunction } from "react-router";

import {
  BillingInvoicesCard,
  BillingOverviewCard,
  BillingPaymentMethodCard,
  BillingSecurityNoticeCard,
  type BillingInvoiceItem,
} from "~/features/users/components/billing-sections";
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

const invoices: BillingInvoiceItem[] = [
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
            <BillingOverviewCard
              planTitle={upcomingBilling.plan}
              priceLabel={upcomingBilling.price}
              renewalDateLabel={upcomingBilling.renewalDate}
              usageLabel={upcomingBilling.usage}
              usageHighlightLabel="수익 보장형 프리셋 추천 3회 남음"
              benefits={planBenefits}
            />

            <BillingPaymentMethodCard
              className="h-fit"
              summaryLabel={`마지막 결제 · 2025.10.28 ${paymentMethod.brand} •••• ${paymentMethod.last4}`}
              brand={paymentMethod.brand}
              last4={paymentMethod.last4}
              holder={paymentMethod.holder}
              expiresLabel={paymentMethod.expires}
              billingEmail={paymentMethod.billingEmail}
              autoTopupDescription={paymentMethod.autoTopup}
            />
          </div>

          <BillingInvoicesCard items={invoices} />

          <BillingSecurityNoticeCard
            title="결제 보안 안내"
            description="모든 결제 정보는 PCI-DSS 기준으로 암호화되어 저장됩니다."
            messagePrefix="청구 관련 문의는"
            contactEmail="billing@deundeun.ai"
            messageSuffix="로 연락해주세요. 결제 실패 시 자동으로 3회 재시도되며, 실패가 지속되면 프로젝트 자동화가 일시 정지됩니다."
          />
        </div>
      </div>
    </section>
  );
}
