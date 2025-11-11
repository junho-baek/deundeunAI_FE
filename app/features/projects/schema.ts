import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  doublePrecision,
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

export const projectStatusEnum = pgEnum("project_status", [
  "draft",
  "generating",
  "active",
  "completed",
  "archived",
]);

export const projectVisibilityEnum = pgEnum("project_visibility", [
  "private",
  "team",
  "public",
]);

export const projectDocumentTypeEnum = pgEnum("project_document_type", [
  "brief",
  "script",
  "copy",
  "notes",
  "other",
]);

export const projectDocumentStatusEnum = pgEnum("project_document_status", [
  "draft",
  "review",
  "approved",
]);

export const projectMediaAssetTypeEnum = pgEnum("project_media_asset_type", [
  "image",
  "video",
  "audio",
  "document",
]);

export const projectMediaAssetSourceEnum = pgEnum(
  "project_media_asset_source",
  ["generated", "uploaded", "external"]
);

export const projectStepKeyEnum = pgEnum("project_step_key", [
  "brief",
  "script",
  "narration",
  "images",
  "videos",
  "final",
  "distribution",
]);

export const projectStepStatusEnum = pgEnum("project_step_status", [
  "pending",
  "in_progress",
  "blocked",
  "completed",
]);

export const projectMessageRoleEnum = pgEnum("project_message_role", [
  "system",
  "user",
  "assistant",
]);

export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),

    projectId: uuid("project_id").defaultRandom().notNull(),

    ownerProfileId: uuid("owner_profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),

    slug: text("slug"),

    title: text("title").notNull(),
    description: text("description"),

    status: projectStatusEnum("status").default("draft").notNull(),
    visibility: projectVisibilityEnum("visibility")
      .default("private")
      .notNull(),

    // Basic metrics shown in the card
    likes: integer("likes").default(0).notNull(),
    ctr: doublePrecision("ctr"),
    budget: integer("budget"),
    views: integer("views").default(0).notNull(),

    // Media fields
    tiktokUrl: text("tiktok_url"),
    videoUrl: text("video_url"),
    thumbnail: text("thumbnail"),
    coverImage: text("cover_image"),

    config: jsonb("config")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),

    publishedAt: timestamp("published_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    projectIdIdx: uniqueIndex("projects_project_id_unique").on(table.projectId),
    slugIdx: uniqueIndex("projects_slug_unique").on(table.slug),
  })
);

// 프로젝트 산출물(기획서, 대본 등)을 저장
export const projectDocuments = pgTable(
  "project_documents",
  {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    documentId: uuid("document_id").defaultRandom().notNull(),
    type: projectDocumentTypeEnum("type").default("other").notNull(),
    status: projectDocumentStatusEnum("status").default("draft").notNull(),
    title: text("title"),
    content: text("content"),
    // Structured content for components like ProjectScript
    contentJson: jsonb("content_json")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    order: integer("order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    documentIdIdx: uniqueIndex("project_documents_document_id_unique").on(
      table.documentId
    ),
    projectOrderIdx: uniqueIndex("project_documents_project_order_unique").on(
      table.projectId,
      table.order
    ),
  })
);

// 생성된 이미지/영상/오디오 자산
export const projectMediaAssets = pgTable(
  "project_media_assets",
  {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    assetId: uuid("asset_id").defaultRandom().notNull(),
    type: projectMediaAssetTypeEnum("type").notNull(),
    source: projectMediaAssetSourceEnum("source")
      .default("generated")
      .notNull(),
    label: text("label"),
    description: text("description"),
    timelineLabel: text("timeline_label"),
    sourceUrl: text("source_url"),
    previewUrl: text("preview_url"),
    durationSeconds: doublePrecision("duration_seconds"),
    selected: boolean("selected").default(false).notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    order: integer("order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    assetIdIdx: uniqueIndex("project_media_assets_asset_id_unique").on(
      table.assetId
    ),
    projectTypeOrderIdx: uniqueIndex(
      "project_media_assets_project_type_order_unique"
    ).on(table.projectId, table.type, table.order),
  })
);

export const projectMetrics = pgTable(
  "project_metrics",
  {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    recordedOn: date("recorded_on").notNull(),
    views: integer("views").default(0).notNull(),
    likes: integer("likes").default(0).notNull(),
    ctr: doublePrecision("ctr"),
    spend: doublePrecision("spend"),
    reach: integer("reach"),
    conversions: integer("conversions"),
    // Additional KPI buckets (e.g. watchTime, retention)
    metrics: jsonb("metrics")
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
    recordedOnIdx: uniqueIndex("project_metrics_project_day_unique").on(
      table.projectId,
      table.recordedOn
    ),
  })
);

export const projectSteps = pgTable(
  "project_steps",
  {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    stepId: uuid("step_id").defaultRandom().notNull(),
    key: projectStepKeyEnum("key").notNull(),
    status: projectStepStatusEnum("status").default("pending").notNull(),
    order: integer("order").default(0).notNull(),
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
    stepIdIdx: uniqueIndex("project_steps_step_id_unique").on(table.stepId),
    projectKeyIdx: uniqueIndex("project_steps_project_key_unique").on(
      table.projectId,
      table.key
    ),
  })
);

export const projectMessages = pgTable(
  "project_messages",
  {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    messageId: uuid("message_id").defaultRandom().notNull(),
    parentMessageId: uuid("parent_message_id"),
    role: projectMessageRoleEnum("role").notNull(),
    content: text("content").notNull(),
    // TODO: 메시지 페이로드 스키마(툴 호출 등) 정의
    payload: jsonb("payload")
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
  },
  (table) => ({
    messageIdIdx: uniqueIndex("project_messages_message_id_unique").on(
      table.messageId
    ),
    projectCreatedIdx: uniqueIndex(
      "project_messages_project_created_unique"
    ).on(table.projectId, table.createdAt),
  })
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type ProjectDocument = typeof projectDocuments.$inferSelect;
export type NewProjectDocument = typeof projectDocuments.$inferInsert;

export type ProjectMediaAsset = typeof projectMediaAssets.$inferSelect;
export type NewProjectMediaAsset = typeof projectMediaAssets.$inferInsert;

export type ProjectMetric = typeof projectMetrics.$inferSelect;
export type NewProjectMetric = typeof projectMetrics.$inferInsert;

export type ProjectStep = typeof projectSteps.$inferSelect;
export type NewProjectStep = typeof projectSteps.$inferInsert;

export type ProjectMessage = typeof projectMessages.$inferSelect;
export type NewProjectMessage = typeof projectMessages.$inferInsert;
