import { desc, eq } from "drizzle-orm";

import db from "~/db";
import {
  profileBillingNotices,
  profileInvoices,
  profilePaymentMethods,
} from "~/features/users/schema";
import type { BillingInvoiceItem } from "~/features/users/components/billing-sections";
import {
  formatCardExpiry,
  formatCurrency,
  formatDateLabel,
  formatKoreanNumber,
  makeSummaryLabel,
} from "~/lib/format";
import { DEFAULT_PROFILE_ID } from "./constants";
import { getPlanOverview } from "./plan-service";

type PaymentMethodSummary = {
  summaryLabel: string;
  brand: string;
  last4: string;
  holder: string;
  expiresLabel: string;
  billingEmail: string;
  autoTopupDescription: string;
};

type SecurityNotice = {
  title: string;
  description: string;
  messagePrefix: string;
  contactEmail: string;
  messageSuffix: string;
};

export type BillingSettingsData = {
  plan: Awaited<ReturnType<typeof getPlanOverview>>;
  paymentMethod: PaymentMethodSummary | null;
  invoices: BillingInvoiceItem[];
  securityNotice: SecurityNotice;
};

function mapInvoiceStatus(status: string | null | undefined) {
  switch (status) {
    case "paid":
      return "결제완료";
    case "pending":
      return "결제대기";
    case "failed":
      return "결제실패";
    case "refunded":
      return "환불완료";
    case "void":
      return "취소";
    default:
      return "확인필요";
  }
}

function describeAutoTopup({
  mode,
  threshold,
  amount,
}: {
  mode: string | null | undefined;
  threshold: number | null | undefined;
  amount: number | null | undefined;
}) {
  switch (mode) {
    case "auto_low_balance":
      return `크레딧 ${formatKoreanNumber(threshold ?? 0)} 미만 시 ${formatKoreanNumber(
        amount ?? 0
      )} 자동 충전`;
    case "auto_calendar":
      return `월별 자동 충전 · ${formatKoreanNumber(amount ?? 0)} 충전 예정`;
    default:
      return "자동 충전 꺼짐";
  }
}

export async function getBillingSettingsData(
  profileId: string = DEFAULT_PROFILE_ID
): Promise<BillingSettingsData> {
  const plan = await getPlanOverview(profileId);

  const paymentMethods = await db
    .select({
      provider: profilePaymentMethods.provider,
      brand: profilePaymentMethods.brand,
      last4: profilePaymentMethods.last4,
      holderName: profilePaymentMethods.holderName,
      expiresMonth: profilePaymentMethods.expiresMonth,
      expiresYear: profilePaymentMethods.expiresYear,
      billingEmail: profilePaymentMethods.billingEmail,
      autoTopupMode: profilePaymentMethods.autoTopupMode,
      autoTopupThreshold: profilePaymentMethods.autoTopupThreshold,
      autoTopupAmount: profilePaymentMethods.autoTopupAmount,
      isDefault: profilePaymentMethods.isDefault,
      createdAt: profilePaymentMethods.createdAt,
    })
    .from(profilePaymentMethods)
    .where(eq(profilePaymentMethods.profileId, profileId))
    .orderBy(desc(profilePaymentMethods.isDefault), desc(profilePaymentMethods.createdAt));

  const invoicesRecords = await db
    .select({
      id: profileInvoices.id,
      invoiceNumber: profileInvoices.invoiceNumber,
      issuedDate: profileInvoices.issuedDate,
      status: profileInvoices.status,
      amountLabel: profileInvoices.amountLabel,
      amount: profileInvoices.amount,
      downloadUrl: profileInvoices.downloadUrl,
    })
    .from(profileInvoices)
    .where(eq(profileInvoices.profileId, profileId))
    .orderBy(desc(profileInvoices.issuedDate), desc(profileInvoices.createdAt));

  const [latestNotice] = await db
    .select({
      title: profileBillingNotices.title,
      description: profileBillingNotices.description,
      messagePrefix: profileBillingNotices.messagePrefix,
      contactEmail: profileBillingNotices.contactEmail,
      messageSuffix: profileBillingNotices.messageSuffix,
    })
    .from(profileBillingNotices)
    .where(eq(profileBillingNotices.profileId, profileId))
    .orderBy(desc(profileBillingNotices.createdAt))
    .limit(1);

  const invoices: BillingInvoiceItem[] = invoicesRecords.map((invoice) => ({
    id: invoice.invoiceNumber,
    date: formatDateLabel(invoice.issuedDate),
    amount: invoice.amountLabel ?? formatCurrency(invoice.amount),
    status: mapInvoiceStatus(invoice.status),
    link: invoice.downloadUrl ?? "#",
  }));

  const latestInvoice = invoicesRecords.at(0);
  const defaultMethod = paymentMethods.at(0);
  const paymentSummary: PaymentMethodSummary | null = defaultMethod
    ? {
        summaryLabel: makeSummaryLabel({
          prefix: latestInvoice
            ? `마지막 결제 · ${formatDateLabel(latestInvoice.issuedDate)}`
            : "기본 결제 수단",
          brand: defaultMethod.brand,
          last4: defaultMethod.last4,
        }),
        brand: defaultMethod.brand ?? defaultMethod.provider ?? "카드",
        last4: defaultMethod.last4 ?? "0000",
        holder: defaultMethod.holderName ?? "등록된 카드",
        expiresLabel: formatCardExpiry(
          defaultMethod.expiresMonth,
          defaultMethod.expiresYear
        ),
        billingEmail: defaultMethod.billingEmail ?? "",
        autoTopupDescription: describeAutoTopup({
          mode: defaultMethod.autoTopupMode,
          threshold: defaultMethod.autoTopupThreshold,
          amount: defaultMethod.autoTopupAmount,
        }),
      }
    : null;

  const securityNotice: SecurityNotice = latestNotice
    ? {
        title: latestNotice.title,
        description:
          latestNotice.description ??
          "모든 결제 정보는 PCI-DSS 기준으로 암호화되어 저장됩니다.",
        messagePrefix:
          latestNotice.messagePrefix ?? "청구 관련 문의는",
        contactEmail:
          latestNotice.contactEmail ?? "billing@ddeundeun.ai",
        messageSuffix:
          latestNotice.messageSuffix ??
          "로 연락해주세요. 결제 실패 시 자동으로 3회 재시도됩니다.",
      }
    : {
        title: "결제 보안 안내",
        description: "모든 결제 정보는 PCI-DSS 기준으로 암호화되어 저장됩니다.",
        messagePrefix: "청구 관련 문의는",
        contactEmail: "billing@ddeundeun.ai",
        messageSuffix:
          "로 연락해주세요. 결제 실패 시 자동으로 3회 재시도되며, 실패가 지속되면 프로젝트 자동화가 일시 정지됩니다.",
      };

  return {
    plan,
    paymentMethod: paymentSummary,
    invoices,
    securityNotice,
  };
}

