import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  doublePrecision,
  foreignKey,
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

import { profiles } from "~/features/users/schema";
import {
  SHORT_WORKFLOW_CATEGORY_OPTIONS,
  SHORT_WORKFLOW_IMAGE_MODEL_OPTIONS,
} from "./short-workflow.constants";

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

export const projectChannelEnum = pgEnum("project_channel", [
  "youtube",
  "instagram",
  "linkedin",
  "tiktok",
  "custom",
]);

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

export const projectFlowStatusEnum = pgEnum("project_flow_status", [
  "draft",
  "processing",
  "paused",
  "completed",
  "failed",
]);

export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),

    projectId: uuid("project_id").defaultRandom().notNull(),

    ownerProfileId: uuid("owner_profile_id").notNull(),

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
    projectsToProfilesFk: foreignKey({
      columns: [table.ownerProfileId],
      foreignColumns: [profiles.id],
      name: "projects_to_profiles",
    }).onDelete("cascade"),
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

// Short workflow (에어테이블 이관)용 공통 Enum
export const shortWorkflowKeywordStatusEnum = pgEnum(
  "short_workflow_keyword_status",
  ["wait", "reserve", "complete"]
);

export const shortWorkflowCategoryEnum = pgEnum(
  "short_workflow_category",
  SHORT_WORKFLOW_CATEGORY_OPTIONS
);

export const shortWorkflowImageModelEnum = pgEnum(
  "short_workflow_image_model",
  SHORT_WORKFLOW_IMAGE_MODEL_OPTIONS
);

export const shortWorkflowJobStatusEnum = pgEnum(
  "short_workflow_job_status",
  ["wait", "reserve", "processing", "complete"]
);

export const shortWorkflowImageStatusEnum = pgEnum(
  "short_workflow_image_status",
  ["success", "in_progress"]
);

// short_workflow_keywords: 기존 Airtable "키워드"
export const shortWorkflowKeywords = pgTable("short_workflow_keywords", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull(),
  status: shortWorkflowKeywordStatusEnum("status").default("wait").notNull(),
  reference: text("reference"),
  category: shortWorkflowCategoryEnum("category"),
  imageModel: shortWorkflowImageModelEnum("image_model"),
  projectId: integer("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  ownerProfileId: uuid("owner_profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// short_workflow_jobs: 기존 Airtable "작업"
export const shortWorkflowJobs = pgTable("short_workflow_jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  status: shortWorkflowJobStatusEnum("status").default("wait").notNull(),
  keyword: text("keyword"),
  length: numeric("length", { precision: 10, scale: 1 }),
  intro: text("intro"),
  base: text("base"),
  cta: text("cta"),
  tags: text("tags"),
  category: shortWorkflowCategoryEnum("category"),
  description: text("description"),
  imageModel: shortWorkflowImageModelEnum("image_model"),
  audioFile: text("audio_file"),
  audioAlignment: text("audio_alignment"),
  output: text("output"),
  projectId: integer("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  ownerProfileId: uuid("owner_profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// short_workflow_images: 기존 Airtable "이미지"
export const shortWorkflowImages = pgTable("short_workflow_images", {
  id: serial("id").primaryKey(),
  pid: text("pid").notNull(),
  status: shortWorkflowImageStatusEnum("status")
    .default("in_progress")
    .notNull(),
  duration: text("duration"),
  sourceText: text("source_text"),
  imagePrompt: text("image_prompt"),
  imageUrl: text("image_url"),
  moviePrompt: text("movie_prompt"),
  movieUrl: text("movie_url"),
  videoTaskId: text("video_task_id"),
  position: text("position"),
  datetime: timestamp("datetime", { withTimezone: true }),
  projectId: integer("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  ownerProfileId: uuid("owner_profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// short_workflow_prompts: 기존 Airtable "프롬프트"
export const shortWorkflowPrompts = pgTable("short_workflow_prompts", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  prompt: text("prompt"),
  output: text("output"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// short_workflow_completions: 기존 Airtable "완료"
export const shortWorkflowCompletions = pgTable(
  "short_workflow_completions",
  {
    id: serial("id").primaryKey(),
    pid: text("pid").notNull(),
    renderId: text("render_id"),
    duration: numeric("duration", { precision: 10, scale: 1 }),
    renderStatus: text("render_status"),
    renderUrl: text("render_url"),
  youtubeUrl: text("youtube_url"),
  title: text("title"),
  description: text("description"),
  tags: text("tags"),
  projectId: integer("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  ownerProfileId: uuid("owner_profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
      .notNull(),
  }
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

export const projectFlows = pgTable(
  "project_flows",
  {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    flowKey: text("flow_key").notNull().default("default"),
    status: projectFlowStatusEnum("status").default("draft").notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    lastMessageId: uuid("last_message_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    projectFlowKeyIdx: uniqueIndex("project_flows_project_flow_key_unique").on(
      table.projectId,
      table.flowKey
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
    flowId: integer("flow_id").references(() => projectFlows.id, {
      onDelete: "cascade",
    }),
    messageId: uuid("message_id").defaultRandom().notNull(),
    parentMessageId: uuid("parent_message_id"),
    role: projectMessageRoleEnum("role").notNull(),
    content: text("content").notNull(),
    // 채팅 관련 필드 추가 (n8n과 공유)
    attachments: jsonb("attachments")
      .$type<Array<{ name: string; size?: number; url?: string }>>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    aspectRatio: text("aspect_ratio"), // "9:16", "16:9", "1:1"
    stepKey: projectStepKeyEnum("step_key"), // 어떤 스텝에서 생성된 메시지인지
    // n8n에서 사용할 수 있는 추가 메타데이터
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

export const projectChannelLinks = pgTable(
  "project_channel_links",
  {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    channel: projectChannelEnum("channel").default("custom").notNull(),
    url: text("url").notNull(),
    syncedAt: timestamp("synced_at", { withTimezone: true }),
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
    projectChannelIdx: uniqueIndex(
      "project_channel_links_project_channel_unique"
    ).on(table.projectId, table.channel),
  })
);

export const projectHighlights = pgTable(
  "project_highlights",
  {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    highlightId: uuid("highlight_id").defaultRandom().notNull(),
    highlightText: text("highlight_text").notNull(),
    category: text("category"),
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
    highlightIdIdx: uniqueIndex("project_highlights_highlight_id_unique").on(
      table.highlightId
    ),
    highlightOrderIdx: uniqueIndex(
      "project_highlights_project_order_unique"
    ).on(table.projectId, table.displayOrder),
  })
);

export const projectRecommendations = pgTable(
  "project_recommendations",
  {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    recommendationId: uuid("recommendation_id").defaultRandom().notNull(),
    recommendationText: text("recommendation_text").notNull(),
    category: text("category"),
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
    recommendationIdIdx: uniqueIndex(
      "project_recommendations_recommendation_id_unique"
    ).on(table.recommendationId),
    recommendationOrderIdx: uniqueIndex(
      "project_recommendations_project_order_unique"
    ).on(table.projectId, table.displayOrder),
  })
);

export const projectRevenueForecasts = pgTable(
  "project_revenue_forecasts",
  {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    forecastId: uuid("forecast_id").defaultRandom().notNull(),
    month: date("month").notNull(),
    expectedRevenue: numeric("expected_revenue"),
    actualRevenue: numeric("actual_revenue"),
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
    forecastIdIdx: uniqueIndex(
      "project_revenue_forecasts_forecast_id_unique"
    ).on(table.forecastId),
    projectMonthIdx: uniqueIndex(
      "project_revenue_forecasts_project_month_unique"
    ).on(table.projectId, table.month),
  })
);

export const projectSurveys = pgTable(
  "project_surveys",
  {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    surveyId: uuid("survey_id").defaultRandom().notNull(),
    surveyKey: text("survey_key").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    multiple: boolean("multiple").default(false).notNull(),
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
    surveyIdIdx: uniqueIndex("project_surveys_survey_id_unique").on(
      table.surveyId
    ),
    surveyKeyIdx: uniqueIndex("project_surveys_project_key_unique").on(
      table.projectId,
      table.surveyKey
    ),
  })
);

export const projectSurveyOptions = pgTable(
  "project_survey_options",
  {
    id: serial("id").primaryKey(),
    surveyId: integer("survey_id")
      .notNull()
      .references(() => projectSurveys.id, { onDelete: "cascade" }),
    optionId: uuid("option_id").defaultRandom().notNull(),
    optionKey: text("option_key").notNull(),
    label: text("label").notNull(),
    value: text("value"),
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
    optionIdIdx: uniqueIndex("project_survey_options_option_id_unique").on(
      table.optionId
    ),
    optionKeyIdx: uniqueIndex("project_survey_options_survey_key_unique").on(
      table.surveyId,
      table.optionKey
    ),
    optionOrderIdx: uniqueIndex(
      "project_survey_options_survey_order_unique"
    ).on(table.surveyId, table.displayOrder),
  })
);

export const projectScriptSegments = pgTable(
  "project_script_segments",
  {
    id: serial("id").primaryKey(),
    documentId: integer("document_id")
      .notNull()
      .references(() => projectDocuments.id, { onDelete: "cascade" }),
    segmentId: uuid("segment_id").defaultRandom().notNull(),
    paragraphOrder: integer("paragraph_order").default(0).notNull(),
    content: text("content").notNull(),
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
    segmentIdIdx: uniqueIndex("project_script_segments_segment_id_unique").on(
      table.segmentId
    ),
    paragraphOrderIdx: uniqueIndex(
      "project_script_segments_document_order_unique"
    ).on(table.documentId, table.paragraphOrder),
  })
);

export const projectAudioSegments = pgTable(
  "project_audio_segments",
  {
    id: serial("id").primaryKey(),
    documentId: integer("document_id")
      .notNull()
      .references(() => projectDocuments.id, { onDelete: "cascade" }),
    segmentId: uuid("segment_id").defaultRandom().notNull(),
    segmentOrder: integer("segment_order").default(0).notNull(),
    label: text("label").notNull(),
    audioUrl: text("audio_url").notNull(),
    durationMs: integer("duration_ms"),
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
    audioSegmentIdIdx: uniqueIndex(
      "project_audio_segments_segment_id_unique"
    ).on(table.segmentId),
    audioSegmentOrderIdx: uniqueIndex(
      "project_audio_segments_document_order_unique"
    ).on(table.documentId, table.segmentOrder),
  })
);

export const projectMediaTimelines = pgTable(
  "project_media_timelines",
  {
    id: serial("id").primaryKey(),
    mediaAssetId: integer("media_asset_id")
      .notNull()
      .references(() => projectMediaAssets.id, { onDelete: "cascade" }),
    timelineId: uuid("timeline_id").defaultRandom().notNull(),
    timelineLabel: text("timeline_label").notNull(),
    ordinal: integer("ordinal").default(0).notNull(),
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
    timelineIdIdx: uniqueIndex("project_media_timelines_timeline_id_unique").on(
      table.timelineId
    ),
    mediaOrdinalIdx: uniqueIndex(
      "project_media_timelines_media_ordinal_unique"
    ).on(table.mediaAssetId, table.ordinal),
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

export type ProjectFlow = typeof projectFlows.$inferSelect;
export type NewProjectFlow = typeof projectFlows.$inferInsert;

export type ProjectMessage = typeof projectMessages.$inferSelect;
export type NewProjectMessage = typeof projectMessages.$inferInsert;

export type ProjectChannelLink = typeof projectChannelLinks.$inferSelect;
export type NewProjectChannelLink = typeof projectChannelLinks.$inferInsert;

export type ProjectHighlight = typeof projectHighlights.$inferSelect;
export type NewProjectHighlight = typeof projectHighlights.$inferInsert;

export type ProjectRecommendation = typeof projectRecommendations.$inferSelect;
export type NewProjectRecommendation =
  typeof projectRecommendations.$inferInsert;

export type ProjectRevenueForecast =
  typeof projectRevenueForecasts.$inferSelect;
export type NewProjectRevenueForecast =
  typeof projectRevenueForecasts.$inferInsert;

export type ProjectSurvey = typeof projectSurveys.$inferSelect;
export type NewProjectSurvey = typeof projectSurveys.$inferInsert;

export type ProjectSurveyOption = typeof projectSurveyOptions.$inferSelect;
export type NewProjectSurveyOption = typeof projectSurveyOptions.$inferInsert;

export type ProjectScriptSegment = typeof projectScriptSegments.$inferSelect;
export type NewProjectScriptSegment = typeof projectScriptSegments.$inferInsert;

export type ProjectAudioSegment = typeof projectAudioSegments.$inferSelect;
export type NewProjectAudioSegment = typeof projectAudioSegments.$inferInsert;

export type ProjectMediaTimeline = typeof projectMediaTimelines.$inferSelect;
export type NewProjectMediaTimeline = typeof projectMediaTimelines.$inferInsert;
