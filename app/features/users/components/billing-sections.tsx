import {
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  Receipt,
  ShieldCheck,
} from "lucide-react";

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
export type BillingOverviewCardProps = {
  planTitle: string;
  priceLabel: string;
  renewalDateLabel: string;
  renewalNote?: string;
  usageLabel: string;
  usageHighlightLabel?: string;
  benefits: readonly string[];
  upgradeHref?: string;
  upgradeLabel?: string;
  pauseLabel?: string;
  className?: string;
};

export function BillingOverviewCard({
  planTitle,
  priceLabel,
  renewalDateLabel,
  renewalNote = "결제일 하루 전에 이메일로 알려드려요.",
  usageLabel,
  usageHighlightLabel,
  benefits,
  upgradeHref = "/pricing",
  upgradeLabel = "업그레이드 옵션 보기",
  pauseLabel = "플랜 일시 정지",
  className,
}: BillingOverviewCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>현재 플랜 · {planTitle}</CardTitle>
        <CardDescription>{priceLabel}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-primary/5 px-4 py-3">
            <p className="text-xs text-muted-foreground">다음 결제일</p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {renewalDateLabel}
            </p>
            <p className="text-xs text-muted-foreground">{renewalNote}</p>
          </div>
          <div className="rounded-2xl border bg-muted/30 px-4 py-3">
            <p className="text-xs text-muted-foreground">프리셋 사용 현황</p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {usageLabel}
            </p>
            {usageHighlightLabel ? (
              <p className="text-xs text-emerald-600">{usageHighlightLabel}</p>
            ) : null}
          </div>
        </div>

        <Separator />

        <ul className="flex flex-col gap-3 text-sm">
          {benefits.map((benefit) => (
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
          <a href={upgradeHref}>
            {upgradeLabel}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </Button>
        <Button size="sm" variant="outline">
          {pauseLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}

export type BillingPaymentMethodCardProps = {
  summaryLabel: string;
  brand: string;
  last4: string;
  holder: string;
  expiresLabel: string;
  billingEmail: string;
  autoTopupDescription: string;
  changeMethodLabel?: string;
  editBillingLabel?: string;
  className?: string;
};

export function BillingPaymentMethodCard({
  summaryLabel,
  brand,
  last4,
  holder,
  expiresLabel,
  billingEmail,
  autoTopupDescription,
  changeMethodLabel = "결제 수단 변경",
  editBillingLabel = "청구 정보 수정",
  className,
}: BillingPaymentMethodCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>결제 수단</CardTitle>
        <CardDescription>{summaryLabel}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start gap-3 rounded-2xl border bg-muted/30 px-4 py-3">
          <span className="rounded-full bg-background p-2 text-primary">
            <CreditCard className="size-4" aria-hidden="true" />
          </span>
          <div className="space-y-1 text-sm">
            <p className="font-medium text-foreground">
              {brand} · {last4}
            </p>
            <p className="text-muted-foreground">
              {holder} · 만료 {expiresLabel}
            </p>
          </div>
        </div>

        <dl className="grid gap-3 text-sm text-muted-foreground">
          <div>
            <dt className="font-medium text-foreground">청구 이메일</dt>
            <dd>{billingEmail}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">자동 충전 설정</dt>
            <dd>{autoTopupDescription}</dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-3">
        <Button size="sm" variant="outline">
          {changeMethodLabel}
        </Button>
        <Button size="sm" variant="ghost">
          {editBillingLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}

export type BillingInvoiceItem = {
  id: string;
  date: string;
  amount: string;
  status: string;
  link?: string;
};

export type BillingInvoicesCardProps = {
  title?: string;
  description?: string;
  items: readonly BillingInvoiceItem[];
  downloadLabel?: string;
  className?: string;
};

export function BillingInvoicesCard({
  title = "청구 내역",
  description = "결제 영수증은 팀과 공유하거나 다운로드할 수 있어요.",
  items,
  downloadLabel = "영수증 다운로드",
  className,
}: BillingInvoicesCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {items.map((invoice) => (
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
                <a href={invoice.link ?? "#"}>{downloadLabel}</a>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export type BillingSecurityNoticeCardProps = {
  title: string;
  description: string;
  messagePrefix: string;
  contactEmail: string;
  messageSuffix: string;
  className?: string;
};

export function BillingSecurityNoticeCard({
  title,
  description,
  messagePrefix,
  contactEmail,
  messageSuffix,
  className,
}: BillingSecurityNoticeCardProps) {
  return (
    <Card className={`border-primary/40 bg-primary/5 ${className ?? ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <ShieldCheck className="size-4" aria-hidden="true" />
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-primary/80">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {messagePrefix}{" "}
        <span className="font-medium text-primary">{contactEmail}</span>{" "}
        {messageSuffix}
      </CardContent>
    </Card>
  );
}
