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

export const authProviderEnum = pgEnum("auth_provider", [
  "google",
  "github",
  "apple",
  "kakao",
  "otp",
  "magic_link",
]);

export const authAuditEventEnum = pgEnum("auth_audit_event", [
  "login_success",
  "login_failure",
  "logout",
  "password_reset",
  "magic_link_sent",
  "otp_sent",
  "otp_verified",
]);

export const authMagicLinks = pgTable(
  "auth_magic_links",
  {
    id: serial("id").primaryKey(),
    token: uuid("token").defaultRandom().notNull(),
    email: text("email").notNull(),
    redirectTo: text("redirect_to"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    tokenIdx: uniqueIndex("auth_magic_links_token_unique").on(table.token),
  })
);

export const authOtpCodes = pgTable(
  "auth_otp_codes",
  {
    id: serial("id").primaryKey(),
    target: text("target").notNull(),
    codeHash: text("code_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    attemptCount: integer("attempt_count").default(0).notNull(),
    throttledUntil: timestamp("throttled_until", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    targetIdx: uniqueIndex("auth_otp_codes_target_unique").on(table.target),
  })
);

export const authSocialProviders = pgTable(
  "auth_social_providers",
  {
    id: serial("id").primaryKey(),
    provider: authProviderEnum("provider").notNull(),
    clientId: text("client_id").notNull(),
    clientSecret: text("client_secret"),
    redirectUri: text("redirect_uri"),
    scopes: text("scopes"),
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
    providerIdx: uniqueIndex("auth_social_providers_provider_unique").on(
      table.provider
    ),
  })
);

export const authAuditLogs = pgTable("auth_audit_logs", {
  id: serial("id").primaryKey(),
  profileId: uuid("profile_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  event: authAuditEventEnum("event").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  location: text("location"),
  metadata: jsonb("metadata")
    .$type<Record<string, unknown>>()
    .default(sql`'{}'::jsonb`)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type AuthMagicLink = typeof authMagicLinks.$inferSelect;
export type NewAuthMagicLink = typeof authMagicLinks.$inferInsert;

export type AuthOtpCode = typeof authOtpCodes.$inferSelect;
export type NewAuthOtpCode = typeof authOtpCodes.$inferInsert;

export type AuthSocialProvider = typeof authSocialProviders.$inferSelect;
export type NewAuthSocialProvider = typeof authSocialProviders.$inferInsert;

export type AuthAuditLog = typeof authAuditLogs.$inferSelect;
export type NewAuthAuditLog = typeof authAuditLogs.$inferInsert;

