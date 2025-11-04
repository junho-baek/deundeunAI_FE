import {
  pgTable,
  serial,
  text,
  integer,
  doublePrecision,
  timestamp,
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  // For routing or human-readable path if desired (optional)
  slug: text("slug"),

  title: text("title").notNull(),
  description: text("description"),

  // Basic metrics shown in the card
  likes: integer("likes").default(0).notNull(),
  ctr: doublePrecision("ctr"), // e.g. 3.5 -> 3.5%
  budget: integer("budget"), // store in smallest currency unit or whole number

  // Media fields
  tiktokUrl: text("tiktok_url"),
  videoUrl: text("video_url"),
  thumbnail: text("thumbnail"),

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
