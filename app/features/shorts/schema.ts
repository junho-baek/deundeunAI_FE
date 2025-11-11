import { sql } from "drizzle-orm";
import {
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

import { profiles } from "~/features/users/schema";
import { projects } from "~/features/projects/schema";

export const shortsPromptCategoryEnum = pgEnum("shorts_prompt_category", [
  "onboarding",
  "campaign",
  "education",
  "custom",
]);

export const shortsGenerationStatusEnum = pgEnum("shorts_generation_status", [
  "queued",
  "processing",
  "succeeded",
  "failed",
  "cancelled",
]);

export const shortsPrompts = pgTable(
  "shorts_prompts",
  {
    id: serial("id").primaryKey(),
    promptId: uuid("prompt_id").defaultRandom().notNull(),
    profileId: uuid("profile_id").references(() => profiles.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    description: text("description"),
    ctaLabel: text("cta_label"),
    ctaHref: text("cta_href"),
    category: shortsPromptCategoryEnum("category").default("onboarding"),
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
    promptIdIdx: uniqueIndex("shorts_prompts_prompt_id_unique").on(
      table.promptId
    ),
    profileOrderIdx: uniqueIndex("shorts_prompts_profile_order_unique").on(
      table.profileId,
      table.displayOrder
    ),
  })
);

export const shortsGenerationRequests = pgTable(
  "shorts_generation_requests",
  {
    id: serial("id").primaryKey(),
    requestId: uuid("request_id").defaultRandom().notNull(),
    profileId: uuid("profile_id").references(() => profiles.id, {
      onDelete: "set null",
    }),
    projectId: integer("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    promptText: text("prompt_text").notNull(),
    status: shortsGenerationStatusEnum("status").default("queued").notNull(),
    responseJson: jsonb("response_json")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    requestIdIdx: uniqueIndex(
      "shorts_generation_requests_request_id_unique"
    ).on(table.requestId),
  })
);

export const shortsFaqs = pgTable(
  "shorts_faqs",
  {
    id: serial("id").primaryKey(),
    faqId: uuid("faq_id").defaultRandom().notNull(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
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
    faqIdIdx: uniqueIndex("shorts_faqs_faq_id_unique").on(table.faqId),
    faqOrderIdx: uniqueIndex("shorts_faqs_order_unique").on(table.displayOrder),
  })
);

export type ShortsPrompt = typeof shortsPrompts.$inferSelect;
export type NewShortsPrompt = typeof shortsPrompts.$inferInsert;

export type ShortsGenerationRequest =
  typeof shortsGenerationRequests.$inferSelect;
export type NewShortsGenerationRequest =
  typeof shortsGenerationRequests.$inferInsert;

export type ShortsFaq = typeof shortsFaqs.$inferSelect;
export type NewShortsFaq = typeof shortsFaqs.$inferInsert;
