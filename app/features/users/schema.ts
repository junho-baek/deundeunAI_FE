import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * 사용자 영역에서 활용할 스키마 정의
 *
 * 참고 컴포넌트:
 * - `features/users/components/profile-sections.tsx`
 * - `features/users/components/billing-sections.tsx`
 *
 * 위 UI에서 필요한 데이터가 평탄화된 형태로 제공될 수 있도록 테이블을 구성합니다.
 */

export const profileStatusEnum = pgEnum("profile_status", [
  "invited",
  "active",
  "suspended",
  "deactivated",
]);

export const billingPlanIntervalEnum = pgEnum("billing_plan_interval", [
  "monthly",
  "yearly",
  "lifetime",
]);

export const billingAutoTopupModeEnum = pgEnum("billing_auto_topup_mode", [
  "manual",
  "auto_low_balance",
  "auto_calendar",
]);

export const billingInvoiceStatusEnum = pgEnum("billing_invoice_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
  "void",
]);

export const creditTransactionTypeEnum = pgEnum("credit_transaction_type", [
  "granted",      // 지급 (구독 갱신 시)
  "consumed",     // 소비 (워크플로우 실행 시)
  "refunded",     // 환불
  "expired",      // 만료
  "manual_adjust", // 수동 조정
]);

export const creditUsageStatusEnum = pgEnum("credit_usage_status", [
  "pending",      // 대기 중
  "processing",  // 처리 중
  "completed",   // 완료
  "failed",       // 실패
  "refunded",     // 환불됨
]);

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // TODO: Supabase auth.users 연동이 결정되면 FK로 연결합니다.
    authUserId: uuid("auth_user_id"),

    slug: text("slug"),
    status: profileStatusEnum("status").default("invited").notNull(),

    name: text("name").notNull(),
    role: text("role"),
    company: text("company"),

    email: text("email").notNull(),
    timezone: text("timezone").default("Asia/Seoul").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    avatarUrl: text("avatar_url"),
    bio: text("bio"),

    preferences: jsonb("preferences")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    followersCount: integer("followers_count").default(0).notNull(),
    followingCount: integer("following_count").default(0).notNull(),
    projectCount: integer("project_count").default(0).notNull(),
    
    // 크레딧 관련 필드
    creditBalance: integer("credit_balance").default(0).notNull(),
    creditLastGrantedAt: timestamp("credit_last_granted_at", { withTimezone: true }),
    creditMonthlyAmount: integer("credit_monthly_amount").default(0).notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("profiles_slug_unique").on(table.slug),
    emailIdx: uniqueIndex("profiles_email_unique").on(table.email),
  })
);

export const profileFollows = pgTable(
  "profile_follows",
  {
    followerId: uuid("follower_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    followingId: uuid("following_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: uniqueIndex("profile_follows_unique").on(
      table.followerId,
      table.followingId
    ),
  })
);

export const profileActivityMetrics = pgTable(
  "profile_activity_metrics",
  {
    id: serial("id").primaryKey(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    metricKey: text("metric_key").notNull(),
    label: text("label").notNull(),
    value: text("value").notNull(),
    helper: text("helper"),
    order: integer("order").default(0).notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    profileMetricIdx: uniqueIndex(
      "profile_activity_metrics_profile_key_unique"
    ).on(table.profileId, table.metricKey),
  })
);

export const profileWorkspacePreferences = pgTable(
  "profile_workspace_preferences",
  {
    id: serial("id").primaryKey(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    preferenceKey: text("preference_key").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    ctaLabel: text("cta_label"),
    order: integer("order").default(0).notNull(),
    enabled: boolean("enabled").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    profilePreferenceIdx: uniqueIndex(
      "profile_workspace_preferences_profile_key_unique"
    ).on(table.profileId, table.preferenceKey),
  })
);

export const profileBillingPlans = pgTable(
  "profile_billing_plans",
  {
    id: serial("id").primaryKey(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    planName: text("plan_name").notNull(),
    priceLabel: text("price_label").notNull(),
    currencyCode: text("currency_code").default("KRW"),
    amount: numeric("amount"),
    interval: billingPlanIntervalEnum("interval").default("monthly").notNull(),
    renewalDate: date("renewal_date"),
    renewalNote: text("renewal_note"),
    usageLabel: text("usage_label"),
    usageHighlightLabel: text("usage_highlight_label"),
    benefitsSummary: jsonb("benefits_summary")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    // 크레딧 관련 필드
    monthlyCredits: integer("monthly_credits").default(0).notNull(),
    creditOverageRate: numeric("credit_overage_rate"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    profilePlanIdx: uniqueIndex("profile_billing_plans_profile_unique").on(
      table.profileId
    ),
  })
);

export const profilePaymentMethods = pgTable(
  "profile_payment_methods",
  {
    id: serial("id").primaryKey(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    brand: text("brand"),
    last4: text("last4"),
    holderName: text("holder_name"),
    expiresMonth: integer("expires_month"),
    expiresYear: integer("expires_year"),
    billingEmail: text("billing_email"),
    autoTopupMode: billingAutoTopupModeEnum("auto_topup_mode")
      .default("manual")
      .notNull(),
    autoTopupThreshold: integer("auto_topup_threshold"),
    autoTopupAmount: integer("auto_topup_amount"),
    isDefault: boolean("is_default").default(false).notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    profileDefaultIdx: uniqueIndex(
      "profile_payment_methods_profile_default_unique"
    )
      .on(table.profileId, table.isDefault)
      .where(sql`${table.isDefault} = true`),
  })
);

export const profileInvoices = pgTable(
  "profile_invoices",
  {
    id: serial("id").primaryKey(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    invoiceNumber: text("invoice_number").notNull(),
    issuedDate: date("issued_date").notNull(),
    status: billingInvoiceStatusEnum("status").default("pending").notNull(),
    currencyCode: text("currency_code").default("KRW"),
    amount: numeric("amount"),
    amountLabel: text("amount_label"),
    downloadUrl: text("download_url"),
    summary: text("summary"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    profileInvoiceIdx: uniqueIndex("profile_invoices_profile_number_unique").on(
      table.profileId,
      table.invoiceNumber
    ),
  })
);

export const profileBillingNotices = pgTable(
  "profile_billing_notices",
  {
    id: serial("id").primaryKey(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    messagePrefix: text("message_prefix"),
    contactEmail: text("contact_email"),
    messageSuffix: text("message_suffix"),
    lastNotifiedAt: timestamp("last_notified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    profileNoticeIdx: uniqueIndex(
      "profile_billing_notices_profile_title_unique"
    ).on(table.profileId, table.title),
  })
);

export const messageThreadStatusEnum = pgEnum("message_thread_status", [
  "open",
  "pending",
  "resolved",
  "closed",
]);

export const messageSenderTypeEnum = pgEnum("message_sender_type", [
  "system",
  "assistant",
  "user",
]);

export const messageThreads = pgTable(
  "message_threads",
  {
    id: serial("id").primaryKey(),
    threadId: uuid("thread_id").defaultRandom().notNull(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    subject: text("subject").notNull(),
    status: messageThreadStatusEnum("status").default("open").notNull(),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    threadIdIdx: uniqueIndex("message_threads_thread_id_unique").on(
      table.threadId
    ),
    profileSubjectIdx: uniqueIndex("message_threads_profile_subject_unique").on(
      table.profileId,
      table.subject
    ),
  })
);

export const messageEntries = pgTable(
  "message_entries",
  {
    id: serial("id").primaryKey(),
    entryId: uuid("entry_id").defaultRandom().notNull(),
    threadId: integer("thread_id")
      .notNull()
      .references(() => messageThreads.id, { onDelete: "cascade" }),
    senderType: messageSenderTypeEnum("sender_type").notNull(),
    senderProfileId: uuid("sender_profile_id").references(() => profiles.id, {
      onDelete: "set null",
    }),
    body: text("body").notNull(),
    attachments: jsonb("attachments")
      .$type<Array<Record<string, unknown>>>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    entryIdIdx: uniqueIndex("message_entries_entry_id_unique").on(
      table.entryId
    ),
    threadCreatedIdx: uniqueIndex("message_entries_thread_created_unique").on(
      table.threadId,
      table.createdAt
    ),
  })
);

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    notificationId: uuid("notification_id").defaultRandom().notNull(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    body: text("body").notNull(),
    category: text("category"),
    ctaLabel: text("cta_label"),
    ctaHref: text("cta_href"),
    readAt: timestamp("read_at", { withTimezone: true }),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    notificationIdIdx: uniqueIndex("notifications_notification_id_unique").on(
      table.notificationId
    ),
    profileCreatedIdx: uniqueIndex("notifications_profile_created_unique").on(
      table.profileId,
      table.createdAt
    ),
  })
);

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type ProfileFollow = typeof profileFollows.$inferSelect;
export type NewProfileFollow = typeof profileFollows.$inferInsert;

export type ProfileActivityMetric = typeof profileActivityMetrics.$inferSelect;
export type NewProfileActivityMetric =
  typeof profileActivityMetrics.$inferInsert;

export type ProfileWorkspacePreference =
  typeof profileWorkspacePreferences.$inferSelect;
export type NewProfileWorkspacePreference =
  typeof profileWorkspacePreferences.$inferInsert;

export type ProfileBillingPlan = typeof profileBillingPlans.$inferSelect;
export type NewProfileBillingPlan = typeof profileBillingPlans.$inferInsert;

export type ProfilePaymentMethod = typeof profilePaymentMethods.$inferSelect;
export type NewProfilePaymentMethod = typeof profilePaymentMethods.$inferInsert;

export type ProfileInvoice = typeof profileInvoices.$inferSelect;
export type NewProfileInvoice = typeof profileInvoices.$inferInsert;

export type ProfileBillingNotice = typeof profileBillingNotices.$inferSelect;
export type NewProfileBillingNotice = typeof profileBillingNotices.$inferInsert;

export type MessageThread = typeof messageThreads.$inferSelect;
export type NewMessageThread = typeof messageThreads.$inferInsert;

export type MessageEntry = typeof messageEntries.$inferSelect;
export type NewMessageEntry = typeof messageEntries.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

// 크레딧 관련 테이블
export const profileCreditTransactions = pgTable(
  "profile_credit_transactions",
  {
    id: serial("id").primaryKey(),
    transactionId: uuid("transaction_id").defaultRandom().notNull(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    type: creditTransactionTypeEnum("type").notNull(),
    amount: integer("amount").notNull(), // 양수: 지급, 음수: 차감
    balanceBefore: integer("balance_before").notNull(),
    balanceAfter: integer("balance_after").notNull(),
    description: text("description"),
    relatedProjectId: uuid("related_project_id"),
    relatedStepKey: text("related_step_key"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    transactionIdIdx: uniqueIndex("credit_transactions_transaction_id_unique").on(
      table.transactionId
    ),
    profileCreatedIdx: uniqueIndex("credit_transactions_profile_created_unique").on(
      table.profileId,
      table.createdAt
    ),
  })
);

export const profileCreditUsages = pgTable(
  "profile_credit_usages",
  {
    id: serial("id").primaryKey(),
    usageId: uuid("usage_id").defaultRandom().notNull(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").notNull(),
    stepKey: text("step_key").notNull(),
    creditsUsed: integer("credits_used").notNull(),
    status: creditUsageStatusEnum("status").default("pending").notNull(),
    workflowExecutionId: text("workflow_execution_id"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    usageIdIdx: uniqueIndex("credit_usages_usage_id_unique").on(
      table.usageId
    ),
    projectStepIdx: uniqueIndex("credit_usages_project_step_unique").on(
      table.projectId,
      table.stepKey
    ),
  })
);

export type ProfileCreditTransaction = typeof profileCreditTransactions.$inferSelect;
export type NewProfileCreditTransaction = typeof profileCreditTransactions.$inferInsert;

export type ProfileCreditUsage = typeof profileCreditUsages.$inferSelect;
export type NewProfileCreditUsage = typeof profileCreditUsages.$inferInsert;
