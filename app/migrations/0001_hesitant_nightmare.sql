CREATE TYPE "public"."project_document_status" AS ENUM('draft', 'review', 'approved');--> statement-breakpoint
CREATE TYPE "public"."project_document_type" AS ENUM('brief', 'script', 'copy', 'notes', 'other');--> statement-breakpoint
CREATE TYPE "public"."project_media_asset_source" AS ENUM('generated', 'uploaded', 'external');--> statement-breakpoint
CREATE TYPE "public"."project_media_asset_type" AS ENUM('image', 'video', 'audio', 'document');--> statement-breakpoint
CREATE TYPE "public"."project_message_role" AS ENUM('system', 'user', 'assistant');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('draft', 'generating', 'active', 'completed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."project_step_key" AS ENUM('brief', 'script', 'narration', 'images', 'videos', 'final', 'distribution');--> statement-breakpoint
CREATE TYPE "public"."project_step_status" AS ENUM('pending', 'in_progress', 'blocked', 'completed');--> statement-breakpoint
CREATE TYPE "public"."project_visibility" AS ENUM('private', 'team', 'public');--> statement-breakpoint
CREATE TABLE "project_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"document_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"type" "project_document_type" DEFAULT 'other' NOT NULL,
	"status" "project_document_status" DEFAULT 'draft' NOT NULL,
	"title" text,
	"content" text,
	"content_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_media_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"asset_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"type" "project_media_asset_type" NOT NULL,
	"source" "project_media_asset_source" DEFAULT 'generated' NOT NULL,
	"label" text,
	"description" text,
	"timeline_label" text,
	"source_url" text,
	"preview_url" text,
	"duration_seconds" double precision,
	"selected" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"message_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"parent_message_id" uuid,
	"role" "project_message_role" NOT NULL,
	"content" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"recorded_on" date NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"ctr" double precision,
	"spend" double precision,
	"reach" integer,
	"conversions" integer,
	"metrics" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_steps" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"step_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"key" "project_step_key" NOT NULL,
	"status" "project_step_status" DEFAULT 'pending' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "project_id" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "owner_profile_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "status" "project_status" DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "visibility" "project_visibility" DEFAULT 'private' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "views" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "cover_image" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "config" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "published_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "project_documents" ADD CONSTRAINT "project_documents_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_media_assets" ADD CONSTRAINT "project_media_assets_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_messages" ADD CONSTRAINT "project_messages_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_metrics" ADD CONSTRAINT "project_metrics_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_steps" ADD CONSTRAINT "project_steps_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "project_documents_document_id_unique" ON "project_documents" USING btree ("document_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_documents_project_order_unique" ON "project_documents" USING btree ("project_id","order");--> statement-breakpoint
CREATE UNIQUE INDEX "project_media_assets_asset_id_unique" ON "project_media_assets" USING btree ("asset_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_media_assets_project_type_order_unique" ON "project_media_assets" USING btree ("project_id","type","order");--> statement-breakpoint
CREATE UNIQUE INDEX "project_messages_message_id_unique" ON "project_messages" USING btree ("message_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_messages_project_created_unique" ON "project_messages" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "project_metrics_project_day_unique" ON "project_metrics" USING btree ("project_id","recorded_on");--> statement-breakpoint
CREATE UNIQUE INDEX "project_steps_step_id_unique" ON "project_steps" USING btree ("step_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_steps_project_key_unique" ON "project_steps" USING btree ("project_id","key");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_project_id_unique" ON "projects" USING btree ("project_id");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_slug_unique" ON "projects" USING btree ("slug");