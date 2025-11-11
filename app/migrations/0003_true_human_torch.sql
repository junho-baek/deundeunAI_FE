CREATE TYPE "public"."admin_announcement_status" AS ENUM('draft', 'scheduled', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."admin_task_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."admin_task_status" AS ENUM('open', 'in_progress', 'done', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."auth_audit_event" AS ENUM('login_success', 'login_failure', 'logout', 'password_reset', 'magic_link_sent', 'otp_sent', 'otp_verified');--> statement-breakpoint
CREATE TYPE "public"."auth_provider" AS ENUM('google', 'github', 'apple', 'kakao', 'otp', 'magic_link');--> statement-breakpoint
CREATE TYPE "public"."billing_checkout_provider" AS ENUM('stripe', 'toss', 'paypal', 'manual');--> statement-breakpoint
CREATE TYPE "public"."billing_plan_visibility" AS ENUM('public', 'private', 'legacy');--> statement-breakpoint
CREATE TYPE "public"."dashboard_goal_status" AS ENUM('active', 'paused', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."dashboard_widget_type" AS ENUM('metric', 'chart', 'list', 'cta');--> statement-breakpoint
CREATE TYPE "public"."project_channel" AS ENUM('youtube', 'instagram', 'linkedin', 'tiktok', 'custom');--> statement-breakpoint
CREATE TYPE "public"."project_flow_status" AS ENUM('draft', 'processing', 'paused', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."resource_collection_type" AS ENUM('free', 'newsletter', 'case_study', 'guide');--> statement-breakpoint
CREATE TYPE "public"."notification_channel" AS ENUM('email', 'sms', 'push');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('weekly_summary', 'product_update', 'billing_alert', 'automation_status');--> statement-breakpoint
CREATE TYPE "public"."settings_section_type" AS ENUM('profile', 'billing', 'notification', 'security', 'integration');--> statement-breakpoint
CREATE TYPE "public"."shorts_generation_status" AS ENUM('queued', 'processing', 'succeeded', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."shorts_prompt_category" AS ENUM('onboarding', 'campaign', 'education', 'custom');--> statement-breakpoint
CREATE TYPE "public"."message_sender_type" AS ENUM('system', 'assistant', 'user');--> statement-breakpoint
CREATE TYPE "public"."message_thread_status" AS ENUM('open', 'pending', 'resolved', 'closed');--> statement-breakpoint
CREATE TABLE "admin_announcements" (
	"id" serial PRIMARY KEY NOT NULL,
	"announcement_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"status" "admin_announcement_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"author_profile_id" uuid,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_system_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"metric_key" text NOT NULL,
	"label" text NOT NULL,
	"category" text,
	"numeric_value" numeric,
	"text_value" text,
	"target_value" numeric,
	"trend_direction" text,
	"recorded_at" timestamp with time zone DEFAULT now(),
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "admin_task_status" DEFAULT 'open' NOT NULL,
	"priority" "admin_task_priority" DEFAULT 'medium' NOT NULL,
	"assignee_profile_id" uuid,
	"due_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" uuid,
	"event" "auth_audit_event" NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"location" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_magic_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"redirect_to" text,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_otp_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"target" text NOT NULL,
	"code_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"throttled_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_social_providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider" "auth_provider" NOT NULL,
	"client_id" text NOT NULL,
	"client_secret" text,
	"redirect_uri" text,
	"scopes" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "billing_checkout_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"provider" "billing_checkout_provider" DEFAULT 'stripe' NOT NULL,
	"cta_label" text NOT NULL,
	"checkout_url" text,
	"success_url" text,
	"cancel_url" text,
	"trial_days" integer,
	"interval" "billing_plan_interval",
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "billing_plan_faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "billing_plan_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"icon" text,
	"label" text NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "billing_plan_steps" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "billing_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"headline" text,
	"description" text,
	"visibility" "billing_plan_visibility" DEFAULT 'public' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dashboard_activity_feed" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" uuid NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"icon" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dashboard_goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"goal_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"goal_key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"target_metric" text,
	"target_value" integer,
	"current_value" integer DEFAULT 0 NOT NULL,
	"period_start" timestamp with time zone,
	"period_end" timestamp with time zone,
	"status" "dashboard_goal_status" DEFAULT 'active' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dashboard_widgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"widget_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"widget_key" "dashboard_widget_type" DEFAULT 'metric' NOT NULL,
	"title" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"size" text,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_audio_segments" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" integer NOT NULL,
	"segment_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"segment_order" integer DEFAULT 0 NOT NULL,
	"label" text NOT NULL,
	"audio_url" text NOT NULL,
	"duration_ms" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_channel_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"channel" "project_channel" DEFAULT 'custom' NOT NULL,
	"url" text NOT NULL,
	"synced_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_flows" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"flow_key" text DEFAULT 'default' NOT NULL,
	"status" "project_flow_status" DEFAULT 'draft' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"last_message_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_highlights" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"highlight_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"highlight_text" text NOT NULL,
	"category" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_media_timelines" (
	"id" serial PRIMARY KEY NOT NULL,
	"media_asset_id" integer NOT NULL,
	"timeline_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"timeline_label" text NOT NULL,
	"ordinal" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_recommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"recommendation_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"recommendation_text" text NOT NULL,
	"category" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_revenue_forecasts" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"forecast_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"month" date NOT NULL,
	"expected_revenue" numeric,
	"actual_revenue" numeric,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_script_segments" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" integer NOT NULL,
	"segment_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"paragraph_order" integer DEFAULT 0 NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_survey_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"survey_id" integer NOT NULL,
	"option_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"option_key" text NOT NULL,
	"label" text NOT NULL,
	"value" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_surveys" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"survey_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"survey_key" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"multiple" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resource_collection_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"collection_id" integer NOT NULL,
	"item_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"item_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"icon" text,
	"cta_label" text,
	"cta_href" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resource_collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"collection_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"badge_label" text,
	"badge_icon" text,
	"hero_placeholder_url" text,
	"collection_type" "resource_collection_type" DEFAULT 'free' NOT NULL,
	"cta_primary_label" text,
	"cta_primary_href" text,
	"cta_secondary_label" text,
	"cta_secondary_href" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resource_downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"collection_id" integer NOT NULL,
	"download_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"download_url" text NOT NULL,
	"format" text,
	"size_label" text,
	"requires_email" boolean DEFAULT true NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resource_faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"collection_id" integer NOT NULL,
	"faq_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" uuid NOT NULL,
	"channel" "notification_channel" NOT NULL,
	"type" "notification_type" NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"icon" text,
	"section_type" "settings_section_type" DEFAULT 'profile' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings_tiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" integer NOT NULL,
	"tile_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"cta_label" text,
	"cta_href" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shorts_faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"faq_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shorts_generation_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid,
	"project_id" integer,
	"prompt_text" text NOT NULL,
	"status" "shorts_generation_status" DEFAULT 'queued' NOT NULL,
	"response_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shorts_prompts" (
	"id" serial PRIMARY KEY NOT NULL,
	"prompt_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"cta_label" text,
	"cta_href" text,
	"category" "shorts_prompt_category" DEFAULT 'onboarding',
	"display_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usecase_case_studies" (
	"id" serial PRIMARY KEY NOT NULL,
	"case_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"category_id" integer NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"summary" text,
	"hero_media_url" text,
	"cta_label" text,
	"cta_href" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usecase_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usecase_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"case_id" integer NOT NULL,
	"metric_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"value" text NOT NULL,
	"unit" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usecase_testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"case_id" integer NOT NULL,
	"testimonial_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"quote" text NOT NULL,
	"author" text,
	"role" text,
	"avatar_url" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"entry_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" integer NOT NULL,
	"sender_type" "message_sender_type" NOT NULL,
	"sender_profile_id" uuid,
	"body" text NOT NULL,
	"attachments" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_threads" (
	"id" serial PRIMARY KEY NOT NULL,
	"thread_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"subject" text NOT NULL,
	"status" "message_thread_status" DEFAULT 'open' NOT NULL,
	"last_message_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"notification_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"category" text,
	"cta_label" text,
	"cta_href" text,
	"read_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_messages" ADD COLUMN "flow_id" integer;--> statement-breakpoint
ALTER TABLE "admin_announcements" ADD CONSTRAINT "admin_announcements_author_profile_id_profiles_id_fk" FOREIGN KEY ("author_profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_tasks" ADD CONSTRAINT "admin_tasks_assignee_profile_id_profiles_id_fk" FOREIGN KEY ("assignee_profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_audit_logs" ADD CONSTRAINT "auth_audit_logs_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_checkout_links" ADD CONSTRAINT "billing_checkout_links_product_id_billing_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."billing_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_plan_faqs" ADD CONSTRAINT "billing_plan_faqs_product_id_billing_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."billing_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_plan_features" ADD CONSTRAINT "billing_plan_features_product_id_billing_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."billing_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_plan_steps" ADD CONSTRAINT "billing_plan_steps_product_id_billing_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."billing_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dashboard_activity_feed" ADD CONSTRAINT "dashboard_activity_feed_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dashboard_goals" ADD CONSTRAINT "dashboard_goals_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dashboard_widgets" ADD CONSTRAINT "dashboard_widgets_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_audio_segments" ADD CONSTRAINT "project_audio_segments_document_id_project_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."project_documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_channel_links" ADD CONSTRAINT "project_channel_links_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_flows" ADD CONSTRAINT "project_flows_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_highlights" ADD CONSTRAINT "project_highlights_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_media_timelines" ADD CONSTRAINT "project_media_timelines_media_asset_id_project_media_assets_id_fk" FOREIGN KEY ("media_asset_id") REFERENCES "public"."project_media_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_recommendations" ADD CONSTRAINT "project_recommendations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_revenue_forecasts" ADD CONSTRAINT "project_revenue_forecasts_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_script_segments" ADD CONSTRAINT "project_script_segments_document_id_project_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."project_documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_survey_options" ADD CONSTRAINT "project_survey_options_survey_id_project_surveys_id_fk" FOREIGN KEY ("survey_id") REFERENCES "public"."project_surveys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_surveys" ADD CONSTRAINT "project_surveys_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_collection_items" ADD CONSTRAINT "resource_collection_items_collection_id_resource_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."resource_collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_downloads" ADD CONSTRAINT "resource_downloads_collection_id_resource_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."resource_collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_faqs" ADD CONSTRAINT "resource_faqs_collection_id_resource_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."resource_collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings_tiles" ADD CONSTRAINT "settings_tiles_section_id_settings_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."settings_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shorts_generation_requests" ADD CONSTRAINT "shorts_generation_requests_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shorts_generation_requests" ADD CONSTRAINT "shorts_generation_requests_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shorts_prompts" ADD CONSTRAINT "shorts_prompts_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usecase_case_studies" ADD CONSTRAINT "usecase_case_studies_category_id_usecase_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."usecase_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usecase_metrics" ADD CONSTRAINT "usecase_metrics_case_id_usecase_case_studies_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."usecase_case_studies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usecase_testimonials" ADD CONSTRAINT "usecase_testimonials_case_id_usecase_case_studies_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."usecase_case_studies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_entries" ADD CONSTRAINT "message_entries_thread_id_message_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."message_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_entries" ADD CONSTRAINT "message_entries_sender_profile_id_profiles_id_fk" FOREIGN KEY ("sender_profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "admin_announcements_announcement_id_unique" ON "admin_announcements" USING btree ("announcement_id");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_tasks_task_id_unique" ON "admin_tasks" USING btree ("task_id");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_magic_links_token_unique" ON "auth_magic_links" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_otp_codes_target_unique" ON "auth_otp_codes" USING btree ("target");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_social_providers_provider_unique" ON "auth_social_providers" USING btree ("provider");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_checkout_links_product_provider_unique" ON "billing_checkout_links" USING btree ("product_id","provider");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_plan_faqs_product_order_unique" ON "billing_plan_faqs" USING btree ("product_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_plan_features_product_order_unique" ON "billing_plan_features" USING btree ("product_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_plan_steps_product_order_unique" ON "billing_plan_steps" USING btree ("product_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_products_product_id_unique" ON "billing_products" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_products_slug_unique" ON "billing_products" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "dashboard_activity_feed_profile_created_unique" ON "dashboard_activity_feed" USING btree ("profile_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "dashboard_goals_goal_id_unique" ON "dashboard_goals" USING btree ("goal_id");--> statement-breakpoint
CREATE UNIQUE INDEX "dashboard_goals_profile_goal_key_unique" ON "dashboard_goals" USING btree ("profile_id","goal_key");--> statement-breakpoint
CREATE UNIQUE INDEX "dashboard_widgets_widget_unique" ON "dashboard_widgets" USING btree ("profile_id","widget_key");--> statement-breakpoint
CREATE UNIQUE INDEX "dashboard_widgets_widget_id_unique" ON "dashboard_widgets" USING btree ("widget_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_audio_segments_segment_id_unique" ON "project_audio_segments" USING btree ("segment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_audio_segments_document_order_unique" ON "project_audio_segments" USING btree ("document_id","segment_order");--> statement-breakpoint
CREATE UNIQUE INDEX "project_channel_links_project_channel_unique" ON "project_channel_links" USING btree ("project_id","channel");--> statement-breakpoint
CREATE UNIQUE INDEX "project_flows_project_flow_key_unique" ON "project_flows" USING btree ("project_id","flow_key");--> statement-breakpoint
CREATE UNIQUE INDEX "project_highlights_highlight_id_unique" ON "project_highlights" USING btree ("highlight_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_highlights_project_order_unique" ON "project_highlights" USING btree ("project_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "project_media_timelines_timeline_id_unique" ON "project_media_timelines" USING btree ("timeline_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_media_timelines_media_ordinal_unique" ON "project_media_timelines" USING btree ("media_asset_id","ordinal");--> statement-breakpoint
CREATE UNIQUE INDEX "project_recommendations_recommendation_id_unique" ON "project_recommendations" USING btree ("recommendation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_recommendations_project_order_unique" ON "project_recommendations" USING btree ("project_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "project_revenue_forecasts_forecast_id_unique" ON "project_revenue_forecasts" USING btree ("forecast_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_revenue_forecasts_project_month_unique" ON "project_revenue_forecasts" USING btree ("project_id","month");--> statement-breakpoint
CREATE UNIQUE INDEX "project_script_segments_segment_id_unique" ON "project_script_segments" USING btree ("segment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_script_segments_document_order_unique" ON "project_script_segments" USING btree ("document_id","paragraph_order");--> statement-breakpoint
CREATE UNIQUE INDEX "project_survey_options_option_id_unique" ON "project_survey_options" USING btree ("option_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_survey_options_survey_key_unique" ON "project_survey_options" USING btree ("survey_id","option_key");--> statement-breakpoint
CREATE UNIQUE INDEX "project_survey_options_survey_order_unique" ON "project_survey_options" USING btree ("survey_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "project_surveys_survey_id_unique" ON "project_surveys" USING btree ("survey_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_surveys_project_key_unique" ON "project_surveys" USING btree ("project_id","survey_key");--> statement-breakpoint
CREATE UNIQUE INDEX "resource_collection_items_item_id_unique" ON "resource_collection_items" USING btree ("item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "resource_collection_items_collection_order_unique" ON "resource_collection_items" USING btree ("collection_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "resource_collections_collection_id_unique" ON "resource_collections" USING btree ("collection_id");--> statement-breakpoint
CREATE UNIQUE INDEX "resource_collections_slug_unique" ON "resource_collections" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "resource_downloads_download_id_unique" ON "resource_downloads" USING btree ("download_id");--> statement-breakpoint
CREATE UNIQUE INDEX "resource_faqs_faq_id_unique" ON "resource_faqs" USING btree ("faq_id");--> statement-breakpoint
CREATE UNIQUE INDEX "resource_faqs_collection_order_unique" ON "resource_faqs" USING btree ("collection_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "notification_preferences_profile_channel_type_unique" ON "notification_preferences" USING btree ("profile_id","channel","type");--> statement-breakpoint
CREATE UNIQUE INDEX "settings_sections_section_id_unique" ON "settings_sections" USING btree ("section_id");--> statement-breakpoint
CREATE UNIQUE INDEX "settings_sections_slug_unique" ON "settings_sections" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "settings_tiles_tile_id_unique" ON "settings_tiles" USING btree ("tile_id");--> statement-breakpoint
CREATE UNIQUE INDEX "settings_tiles_section_order_unique" ON "settings_tiles" USING btree ("section_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "shorts_faqs_faq_id_unique" ON "shorts_faqs" USING btree ("faq_id");--> statement-breakpoint
CREATE UNIQUE INDEX "shorts_faqs_order_unique" ON "shorts_faqs" USING btree ("display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "shorts_generation_requests_request_id_unique" ON "shorts_generation_requests" USING btree ("request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "shorts_prompts_prompt_id_unique" ON "shorts_prompts" USING btree ("prompt_id");--> statement-breakpoint
CREATE UNIQUE INDEX "shorts_prompts_profile_order_unique" ON "shorts_prompts" USING btree ("profile_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "usecase_case_studies_case_id_unique" ON "usecase_case_studies" USING btree ("case_id");--> statement-breakpoint
CREATE UNIQUE INDEX "usecase_case_studies_category_order_unique" ON "usecase_case_studies" USING btree ("category_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "usecase_categories_category_id_unique" ON "usecase_categories" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "usecase_categories_slug_unique" ON "usecase_categories" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "usecase_metrics_metric_id_unique" ON "usecase_metrics" USING btree ("metric_id");--> statement-breakpoint
CREATE UNIQUE INDEX "usecase_metrics_case_order_unique" ON "usecase_metrics" USING btree ("case_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "usecase_testimonials_testimonial_id_unique" ON "usecase_testimonials" USING btree ("testimonial_id");--> statement-breakpoint
CREATE UNIQUE INDEX "usecase_testimonials_case_order_unique" ON "usecase_testimonials" USING btree ("case_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "message_entries_entry_id_unique" ON "message_entries" USING btree ("entry_id");--> statement-breakpoint
CREATE UNIQUE INDEX "message_entries_thread_created_unique" ON "message_entries" USING btree ("thread_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "message_threads_thread_id_unique" ON "message_threads" USING btree ("thread_id");--> statement-breakpoint
CREATE UNIQUE INDEX "message_threads_profile_subject_unique" ON "message_threads" USING btree ("profile_id","subject");--> statement-breakpoint
CREATE UNIQUE INDEX "notifications_notification_id_unique" ON "notifications" USING btree ("notification_id");--> statement-breakpoint
CREATE UNIQUE INDEX "notifications_profile_created_unique" ON "notifications" USING btree ("profile_id","created_at");--> statement-breakpoint
ALTER TABLE "project_messages" ADD CONSTRAINT "project_messages_flow_id_project_flows_id_fk" FOREIGN KEY ("flow_id") REFERENCES "public"."project_flows"("id") ON DELETE cascade ON UPDATE no action;