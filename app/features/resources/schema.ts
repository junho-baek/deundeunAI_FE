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

export const resourceCollectionTypeEnum = pgEnum(
  "resource_collection_type",
  ["free", "newsletter", "case_study", "guide"]
);

export const resourceCollections = pgTable(
  "resource_collections",
  {
    id: serial("id").primaryKey(),
    collectionId: uuid("collection_id").defaultRandom().notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    badgeLabel: text("badge_label"),
    badgeIcon: text("badge_icon"),
    heroPlaceholderUrl: text("hero_placeholder_url"),
    collectionType: resourceCollectionTypeEnum("collection_type")
      .default("free")
      .notNull(),
    ctaPrimaryLabel: text("cta_primary_label"),
    ctaPrimaryHref: text("cta_primary_href"),
    ctaSecondaryLabel: text("cta_secondary_label"),
    ctaSecondaryHref: text("cta_secondary_href"),
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
    collectionIdIdx: uniqueIndex(
      "resource_collections_collection_id_unique"
    ).on(table.collectionId),
    slugIdx: uniqueIndex("resource_collections_slug_unique").on(table.slug),
  })
);

export const resourceCollectionItems = pgTable(
  "resource_collection_items",
  {
    id: serial("id").primaryKey(),
    collectionId: integer("collection_id")
      .notNull()
      .references(() => resourceCollections.id, { onDelete: "cascade" }),
    itemId: uuid("item_id").defaultRandom().notNull(),
    itemType: text("item_type").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    icon: text("icon"),
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
    itemIdIdx: uniqueIndex(
      "resource_collection_items_item_id_unique"
    ).on(table.itemId),
    collectionOrderIdx: uniqueIndex(
      "resource_collection_items_collection_order_unique"
    ).on(table.collectionId, table.displayOrder),
  })
);

export const resourceFaqs = pgTable(
  "resource_faqs",
  {
    id: serial("id").primaryKey(),
    collectionId: integer("collection_id")
      .notNull()
      .references(() => resourceCollections.id, { onDelete: "cascade" }),
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
    faqIdIdx: uniqueIndex("resource_faqs_faq_id_unique").on(table.faqId),
    faqOrderIdx: uniqueIndex("resource_faqs_collection_order_unique").on(
      table.collectionId,
      table.displayOrder
    ),
  })
);

export const resourceDownloads = pgTable(
  "resource_downloads",
  {
    id: serial("id").primaryKey(),
    collectionId: integer("collection_id")
      .notNull()
      .references(() => resourceCollections.id, { onDelete: "cascade" }),
    downloadId: uuid("download_id").defaultRandom().notNull(),
    downloadUrl: text("download_url").notNull(),
    format: text("format"),
    sizeLabel: text("size_label"),
    requiresEmail: boolean("requires_email").default(true).notNull(),
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
    downloadIdIdx: uniqueIndex(
      "resource_downloads_download_id_unique"
    ).on(table.downloadId),
  })
);

export type ResourceCollection = typeof resourceCollections.$inferSelect;
export type NewResourceCollection = typeof resourceCollections.$inferInsert;

export type ResourceCollectionItem =
  typeof resourceCollectionItems.$inferSelect;
export type NewResourceCollectionItem =
  typeof resourceCollectionItems.$inferInsert;

export type ResourceFaq = typeof resourceFaqs.$inferSelect;
export type NewResourceFaq = typeof resourceFaqs.$inferInsert;

export type ResourceDownload = typeof resourceDownloads.$inferSelect;
export type NewResourceDownload = typeof resourceDownloads.$inferInsert;

