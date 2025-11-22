import { jsonb, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const eventType = pgEnum("event_type", [
  "project_view",
  "project_workspace_view",
  "profile_view",
  "project_list_view",
]);

export const events = pgTable("events", {
  event_id: uuid("event_id").primaryKey().defaultRandom(),
  event_type: eventType("event_type"),
  event_data: jsonb("event_data"),
  created_at: timestamp("created_at").defaultNow(),
});

