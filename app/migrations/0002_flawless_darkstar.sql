CREATE TYPE "public"."billing_auto_topup_mode" AS ENUM('manual', 'auto_low_balance', 'auto_calendar');--> statement-breakpoint
CREATE TYPE "public"."billing_invoice_status" AS ENUM('pending', 'paid', 'failed', 'refunded', 'void');--> statement-breakpoint
CREATE TYPE "public"."billing_plan_interval" AS ENUM('monthly', 'yearly', 'lifetime');--> statement-breakpoint
CREATE TYPE "public"."profile_status" AS ENUM('invited', 'active', 'suspended', 'deactivated');--> statement-breakpoint
CREATE TABLE "profile_activity_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" uuid NOT NULL,
	"metric_key" text NOT NULL,
	"label" text NOT NULL,
	"value" text NOT NULL,
	"helper" text,
	"order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_billing_notices" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"message_prefix" text,
	"contact_email" text,
	"message_suffix" text,
	"last_notified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_billing_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" uuid NOT NULL,
	"plan_name" text NOT NULL,
	"price_label" text NOT NULL,
	"currency_code" text DEFAULT 'KRW',
	"amount" numeric,
	"interval" "billing_plan_interval" DEFAULT 'monthly' NOT NULL,
	"renewal_date" date,
	"renewal_note" text,
	"usage_label" text,
	"usage_highlight_label" text,
	"benefits_summary" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_follows" (
	"follower_id" uuid NOT NULL,
	"following_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" uuid NOT NULL,
	"invoice_number" text NOT NULL,
	"issued_date" date NOT NULL,
	"status" "billing_invoice_status" DEFAULT 'pending' NOT NULL,
	"currency_code" text DEFAULT 'KRW',
	"amount" numeric,
	"amount_label" text,
	"download_url" text,
	"summary" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_payment_methods" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"brand" text,
	"last4" text,
	"holder_name" text,
	"expires_month" integer,
	"expires_year" integer,
	"billing_email" text,
	"auto_topup_mode" "billing_auto_topup_mode" DEFAULT 'manual' NOT NULL,
	"auto_topup_threshold" integer,
	"auto_topup_amount" integer,
	"is_default" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_workspace_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" uuid NOT NULL,
	"preference_key" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"cta_label" text,
	"order" integer DEFAULT 0 NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" uuid,
	"slug" text,
	"status" "profile_status" DEFAULT 'invited' NOT NULL,
	"name" text NOT NULL,
	"role" text,
	"company" text,
	"email" text NOT NULL,
	"timezone" text DEFAULT 'Asia/Seoul' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"avatar_url" text,
	"bio" text,
	"preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"followers_count" integer DEFAULT 0 NOT NULL,
	"following_count" integer DEFAULT 0 NOT NULL,
	"project_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile_activity_metrics" ADD CONSTRAINT "profile_activity_metrics_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_billing_notices" ADD CONSTRAINT "profile_billing_notices_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_billing_plans" ADD CONSTRAINT "profile_billing_plans_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_follows" ADD CONSTRAINT "profile_follows_follower_id_profiles_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_follows" ADD CONSTRAINT "profile_follows_following_id_profiles_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_invoices" ADD CONSTRAINT "profile_invoices_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_payment_methods" ADD CONSTRAINT "profile_payment_methods_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_workspace_preferences" ADD CONSTRAINT "profile_workspace_preferences_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "profile_activity_metrics_profile_key_unique" ON "profile_activity_metrics" USING btree ("profile_id","metric_key");--> statement-breakpoint
CREATE UNIQUE INDEX "profile_billing_notices_profile_title_unique" ON "profile_billing_notices" USING btree ("profile_id","title");--> statement-breakpoint
CREATE UNIQUE INDEX "profile_billing_plans_profile_unique" ON "profile_billing_plans" USING btree ("profile_id");--> statement-breakpoint
CREATE UNIQUE INDEX "profile_follows_unique" ON "profile_follows" USING btree ("follower_id","following_id");--> statement-breakpoint
CREATE UNIQUE INDEX "profile_invoices_profile_number_unique" ON "profile_invoices" USING btree ("profile_id","invoice_number");--> statement-breakpoint
CREATE UNIQUE INDEX "profile_payment_methods_profile_default_unique" ON "profile_payment_methods" USING btree ("profile_id","is_default") WHERE "profile_payment_methods"."is_default" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "profile_workspace_preferences_profile_key_unique" ON "profile_workspace_preferences" USING btree ("profile_id","preference_key");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_slug_unique" ON "profiles" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_email_unique" ON "profiles" USING btree ("email");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_profile_id_profiles_id_fk" FOREIGN KEY ("owner_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;