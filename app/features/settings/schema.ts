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

export const settingsSectionTypeEnum = pgEnum("settings_section_type", [
  "profile",
  "billing",
  "notification",
  "security",
  "integration",
]);

export const settingsSections = pgTable(
  "settings_sections",
  {
    id: serial("id").primaryKey(),
    sectionId: uuid("section_id").defaultRandom().notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    icon: text("icon"),
    sectionType: settingsSectionTypeEnum("section_type")
      .default("profile")
      .notNull(),
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
    sectionIdIdx: uniqueIndex("settings_sections_section_id_unique").on(
      table.sectionId
    ),
    slugIdx: uniqueIndex("settings_sections_slug_unique").on(table.slug),
  })
);

export const settingsTiles = pgTable(
  "settings_tiles",
  {
    id: serial("id").primaryKey(),
    sectionId: integer("section_id")
      .notNull()
      .references(() => settingsSections.id, { onDelete: "cascade" }),
    tileId: uuid("tile_id").defaultRandom().notNull(),
    title: text("title").notNull(),
    description: text("description"),
    ctaLabel: text("cta_label"),
    ctaHref: text("cta_href"),
    displayOrder: integer("display_order").default(0).notNull(),
    tags: jsonb("tags")
      .$type<string[]>()
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
    tileIdIdx: uniqueIndex("settings_tiles_tile_id_unique").on(table.tileId),
    tileOrderIdx: uniqueIndex("settings_tiles_section_order_unique").on(
      table.sectionId,
      table.displayOrder
    ),
  })
);

export const notificationChannelEnum = pgEnum("notification_channel", [
  "email",
  "sms",
  "push",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "weekly_summary",
  "product_update",
  "billing_alert",
  "automation_status",
]);

export const notificationPreferences = pgTable(
  "notification_preferences",
  {
    id: serial("id").primaryKey(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    channel: notificationChannelEnum("channel").notNull(),
    type: notificationTypeEnum("type").notNull(),
    enabled: boolean("enabled").default(true).notNull(),
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
    profilePreferenceIdx: uniqueIndex(
      "notification_preferences_profile_channel_type_unique"
    ).on(table.profileId, table.channel, table.type),
  })
);

export type SettingsSection = typeof settingsSections.$inferSelect;
export type NewSettingsSection = typeof settingsSections.$inferInsert;

export type SettingsTile = typeof settingsTiles.$inferSelect;
export type NewSettingsTile = typeof settingsTiles.$inferInsert;

export type NotificationPreference =
  typeof notificationPreferences.$inferSelect;
export type NewNotificationPreference =
  typeof notificationPreferences.$inferInsert;

