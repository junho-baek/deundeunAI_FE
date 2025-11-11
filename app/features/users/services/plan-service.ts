import { eq } from "drizzle-orm";

import db from "~/db";
import { formatDateLabel } from "~/lib/format";
import { profileBillingPlans } from "~/features/users/schema";

export type PlanOverview = {
  planName: string | null;
  priceLabel: string | null;
  renewalDate: Date | null;
  renewalDateLabel: string | null;
  renewalNote: string | null;
  usageLabel: string | null;
  usageHighlightLabel: string | null;
  benefits: string[];
};

export async function getPlanOverview(
  profileId: string
): Promise<PlanOverview> {
  const [plan] = await db
    .select({
      planName: profileBillingPlans.planName,
      priceLabel: profileBillingPlans.priceLabel,
      renewalDate: profileBillingPlans.renewalDate,
      renewalNote: profileBillingPlans.renewalNote,
      usageLabel: profileBillingPlans.usageLabel,
      usageHighlightLabel: profileBillingPlans.usageHighlightLabel,
      benefitsSummary: profileBillingPlans.benefitsSummary,
    })
    .from(profileBillingPlans)
    .where(eq(profileBillingPlans.profileId, profileId))
    .limit(1);

  if (!plan) {
    return {
      planName: null,
      priceLabel: null,
      renewalDate: null,
      renewalDateLabel: null,
      renewalNote: null,
      usageLabel: null,
      usageHighlightLabel: null,
      benefits: [],
    };
  }

  const benefits =
    Array.isArray(plan.benefitsSummary) && plan.benefitsSummary.length > 0
      ? plan.benefitsSummary
      : [];

  return {
    planName: plan.planName,
    priceLabel: plan.priceLabel,
    renewalDate: plan.renewalDate,
    renewalDateLabel: formatDateLabel(plan.renewalDate),
    renewalNote: plan.renewalNote,
    usageLabel: plan.usageLabel,
    usageHighlightLabel: plan.usageHighlightLabel,
    benefits,
  };
}

