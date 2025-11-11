import { sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const usecaseCategories = pgTable(
  "usecase_categories",
  {
    id: serial("id").primaryKey(),
    categoryId: uuid("category_id").defaultRandom().notNull(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
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
    categoryIdIdx: uniqueIndex("usecase_categories_category_id_unique").on(
      table.categoryId
    ),
    slugIdx: uniqueIndex("usecase_categories_slug_unique").on(table.slug),
  })
);

export const usecaseCaseStudies = pgTable(
  "usecase_case_studies",
  {
    id: serial("id").primaryKey(),
    caseId: uuid("case_id").defaultRandom().notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => usecaseCategories.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    summary: text("summary"),
    heroMediaUrl: text("hero_media_url"),
    ctaLabel: text("cta_label"),
    ctaHref: text("cta_href"),
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
    caseIdIdx: uniqueIndex("usecase_case_studies_case_id_unique").on(
      table.caseId
    ),
    caseOrderIdx: uniqueIndex("usecase_case_studies_category_order_unique").on(
      table.categoryId,
      table.displayOrder
    ),
  })
);

export const usecaseMetrics = pgTable(
  "usecase_metrics",
  {
    id: serial("id").primaryKey(),
    caseId: integer("case_id")
      .notNull()
      .references(() => usecaseCaseStudies.id, { onDelete: "cascade" }),
    metricId: uuid("metric_id").defaultRandom().notNull(),
    label: text("label").notNull(),
    value: text("value").notNull(),
    unit: text("unit"),
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
    metricIdIdx: uniqueIndex("usecase_metrics_metric_id_unique").on(
      table.metricId
    ),
    metricOrderIdx: uniqueIndex("usecase_metrics_case_order_unique").on(
      table.caseId,
      table.displayOrder
    ),
  })
);

export const usecaseTestimonials = pgTable(
  "usecase_testimonials",
  {
    id: serial("id").primaryKey(),
    caseId: integer("case_id")
      .notNull()
      .references(() => usecaseCaseStudies.id, { onDelete: "cascade" }),
    testimonialId: uuid("testimonial_id").defaultRandom().notNull(),
    quote: text("quote").notNull(),
    author: text("author"),
    role: text("role"),
    avatarUrl: text("avatar_url"),
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
    testimonialIdIdx: uniqueIndex(
      "usecase_testimonials_testimonial_id_unique"
    ).on(table.testimonialId),
    testimonialOrderIdx: uniqueIndex(
      "usecase_testimonials_case_order_unique"
    ).on(table.caseId, table.displayOrder),
  })
);

export type UsecaseCategory = typeof usecaseCategories.$inferSelect;
export type NewUsecaseCategory = typeof usecaseCategories.$inferInsert;

export type UsecaseCaseStudy = typeof usecaseCaseStudies.$inferSelect;
export type NewUsecaseCaseStudy = typeof usecaseCaseStudies.$inferInsert;

export type UsecaseMetric = typeof usecaseMetrics.$inferSelect;
export type NewUsecaseMetric = typeof usecaseMetrics.$inferInsert;

export type UsecaseTestimonial = typeof usecaseTestimonials.$inferSelect;
export type NewUsecaseTestimonial = typeof usecaseTestimonials.$inferInsert;
