import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { billingPlanIntervalEnum } from "~/features/users/schema";

export const billingPlanVisibilityEnum = pgEnum("billing_plan_visibility", [
  "public",
  "private",
  "legacy",
]);

export const billingCheckoutProviderEnum = pgEnum("billing_checkout_provider", [
  "stripe",
  "toss",
  "paypal",
  "manual",
]);

export const billingProducts = pgTable(
  "billing_products",
  {
    id: serial("id").primaryKey(),
    productId: uuid("product_id").defaultRandom().notNull(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    headline: text("headline"),
    description: text("description"),
    visibility: billingPlanVisibilityEnum("visibility")
      .default("public")
      .notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
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
    productIdIdx: uniqueIndex("billing_products_product_id_unique").on(
      table.productId
    ),
    slugIdx: uniqueIndex("billing_products_slug_unique").on(table.slug),
  })
);

export const billingPlanFeatures = pgTable(
  "billing_plan_features",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => billingProducts.id, { onDelete: "cascade" }),
    icon: text("icon"),
    label: text("label").notNull(),
    description: text("description"),
    displayOrder: integer("display_order").default(0).notNull(),
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
    productOrderIdx: uniqueIndex(
      "billing_plan_features_product_order_unique"
    ).on(table.productId, table.displayOrder),
  })
);

export const billingPlanSteps = pgTable(
  "billing_plan_steps",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => billingProducts.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    planStepOrderIdx: uniqueIndex("billing_plan_steps_product_order_unique").on(
      table.productId,
      table.displayOrder
    ),
  })
);

export const billingPlanFaqs = pgTable(
  "billing_plan_faqs",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => billingProducts.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    planFaqOrderIdx: uniqueIndex("billing_plan_faqs_product_order_unique").on(
      table.productId,
      table.displayOrder
    ),
  })
);

export const billingCheckoutLinks = pgTable(
  "billing_checkout_links",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => billingProducts.id, { onDelete: "cascade" }),
    provider: billingCheckoutProviderEnum("provider")
      .default("stripe")
      .notNull(),
    ctaLabel: text("cta_label").notNull(),
    checkoutUrl: text("checkout_url"),
    successUrl: text("success_url"),
    cancelUrl: text("cancel_url"),
    trialDays: integer("trial_days"),
    interval: billingPlanIntervalEnum("interval"),
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
    productProviderIdx: uniqueIndex(
      "billing_checkout_links_product_provider_unique"
    ).on(table.productId, table.provider),
  })
);

export type BillingProduct = typeof billingProducts.$inferSelect;
export type NewBillingProduct = typeof billingProducts.$inferInsert;

export type BillingPlanFeature = typeof billingPlanFeatures.$inferSelect;
export type NewBillingPlanFeature = typeof billingPlanFeatures.$inferInsert;

export type BillingPlanStep = typeof billingPlanSteps.$inferSelect;
export type NewBillingPlanStep = typeof billingPlanSteps.$inferInsert;

export type BillingPlanFaq = typeof billingPlanFaqs.$inferSelect;
export type NewBillingPlanFaq = typeof billingPlanFaqs.$inferInsert;

export type BillingCheckoutLink = typeof billingCheckoutLinks.$inferSelect;
export type NewBillingCheckoutLink = typeof billingCheckoutLinks.$inferInsert;
