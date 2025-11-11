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

import { profiles } from "~/features/users/schema";

export const dashboardWidgetTypeEnum = pgEnum("dashboard_widget_type", [
  "metric",
  "chart",
  "list",
  "cta",
]);

export const dashboardWidgets = pgTable(
  "dashboard_widgets",
  {
    id: serial("id").primaryKey(),
    widgetId: uuid("widget_id").defaultRandom().notNull(),
    profileId: uuid("profile_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    widgetKey: dashboardWidgetTypeEnum("widget_key").default("metric").notNull(),
    title: text("title").notNull(),
    position: integer("position").default(0).notNull(),
    size: text("size"),
    config: jsonb("config")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    isPinned: boolean("is_pinned").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    widgetUniqueIdx: uniqueIndex("dashboard_widgets_widget_unique").on(
      table.profileId,
      table.widgetKey
    ),
    widgetIdIdx: uniqueIndex("dashboard_widgets_widget_id_unique").on(
      table.widgetId
    ),
  })
);

export const dashboardActivityFeed = pgTable(
  "dashboard_activity_feed",
  {
    id: serial("id").primaryKey(),
    profileId: uuid("profile_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    category: text("category").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    icon: text("icon"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    profileCreatedIdx: uniqueIndex(
      "dashboard_activity_feed_profile_created_unique"
    ).on(table.profileId, table.createdAt),
  })
);

export const dashboardGoalStatusEnum = pgEnum("dashboard_goal_status", [
  "active",
  "paused",
  "completed",
  "failed",
]);

export const dashboardGoals = pgTable(
  "dashboard_goals",
  {
    id: serial("id").primaryKey(),
    goalId: uuid("goal_id").defaultRandom().notNull(),
    profileId: uuid("profile_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    goalKey: text("goal_key").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    targetMetric: text("target_metric"),
    targetValue: integer("target_value"),
    currentValue: integer("current_value").default(0).notNull(),
    periodStart: timestamp("period_start", { withTimezone: true }),
    periodEnd: timestamp("period_end", { withTimezone: true }),
    status: dashboardGoalStatusEnum("status").default("active").notNull(),
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
    goalIdIdx: uniqueIndex("dashboard_goals_goal_id_unique").on(table.goalId),
    goalKeyIdx: uniqueIndex("dashboard_goals_profile_goal_key_unique").on(
      table.profileId,
      table.goalKey
    ),
  })
);

export type DashboardWidget = typeof dashboardWidgets.$inferSelect;
export type NewDashboardWidget = typeof dashboardWidgets.$inferInsert;

export type DashboardActivity = typeof dashboardActivityFeed.$inferSelect;
export type NewDashboardActivity = typeof dashboardActivityFeed.$inferInsert;

export type DashboardGoal = typeof dashboardGoals.$inferSelect;
export type NewDashboardGoal = typeof dashboardGoals.$inferInsert;

