import { sql } from "drizzle-orm";
import {
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

export const adminAnnouncementStatusEnum = pgEnum(
  "admin_announcement_status",
  ["draft", "scheduled", "published", "archived"]
);

export const adminTaskStatusEnum = pgEnum("admin_task_status", [
  "open",
  "in_progress",
  "done",
  "cancelled",
]);

export const adminTaskPriorityEnum = pgEnum("admin_task_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const adminAnnouncements = pgTable(
  "admin_announcements",
  {
    id: serial("id").primaryKey(),
    announcementId: uuid("announcement_id").defaultRandom().notNull(),
    title: text("title").notNull(),
    body: text("body"),
    status: adminAnnouncementStatusEnum("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    authorProfileId: uuid("author_profile_id").references(() => profiles.id, {
      onDelete: "set null",
    }),
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
    announcementIdIdx: uniqueIndex(
      "admin_announcements_announcement_id_unique"
    ).on(table.announcementId),
  })
);

export const adminTasks = pgTable(
  "admin_tasks",
  {
    id: serial("id").primaryKey(),
    taskId: uuid("task_id").defaultRandom().notNull(),
    title: text("title").notNull(),
    description: text("description"),
    status: adminTaskStatusEnum("status").default("open").notNull(),
    priority: adminTaskPriorityEnum("priority").default("medium").notNull(),
    assigneeProfileId: uuid("assignee_profile_id").references(
      () => profiles.id,
      { onDelete: "set null" }
    ),
    dueAt: timestamp("due_at", { withTimezone: true }),
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
    taskIdIdx: uniqueIndex("admin_tasks_task_id_unique").on(table.taskId),
  })
);

export const adminSystemMetrics = pgTable("admin_system_metrics", {
  id: serial("id").primaryKey(),
  metricKey: text("metric_key").notNull(),
  label: text("label").notNull(),
  category: text("category"),
  numericValue: numeric("numeric_value"),
  textValue: text("text_value"),
  targetValue: numeric("target_value"),
  trendDirection: text("trend_direction"),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).defaultNow(),
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
});

export type AdminAnnouncement = typeof adminAnnouncements.$inferSelect;
export type NewAdminAnnouncement = typeof adminAnnouncements.$inferInsert;

export type AdminTask = typeof adminTasks.$inferSelect;
export type NewAdminTask = typeof adminTasks.$inferInsert;

export type AdminSystemMetric = typeof adminSystemMetrics.$inferSelect;
export type NewAdminSystemMetric = typeof adminSystemMetrics.$inferInsert;

