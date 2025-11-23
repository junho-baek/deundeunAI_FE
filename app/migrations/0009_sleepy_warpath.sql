CREATE TYPE "public"."short_workflow_category" AS ENUM('역사', '과학', '한자', '이야기');--> statement-breakpoint
CREATE TYPE "public"."short_workflow_image_model" AS ENUM('openai/gpt-image-1', 'google/imagen-4', 'black-forest-labs/flux-1.1-pro', 'bytedance/seedream-3');--> statement-breakpoint
CREATE TYPE "public"."short_workflow_image_status" AS ENUM('success', 'in_progress');--> statement-breakpoint
CREATE TYPE "public"."short_workflow_job_status" AS ENUM('wait', 'reserve', 'processing', 'complete');--> statement-breakpoint
CREATE TYPE "public"."short_workflow_keyword_status" AS ENUM('wait', 'reserve', 'complete');--> statement-breakpoint
CREATE TABLE "short_workflow_completions" (
	"id" serial PRIMARY KEY NOT NULL,
	"pid" text NOT NULL,
	"render_id" text,
	"duration" numeric(10, 1),
	"render_status" text,
	"render_url" text,
	"youtube_url" text,
	"title" text,
	"description" text,
	"tags" text,
	"project_id" integer,
	"owner_profile_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "short_workflow_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"pid" text NOT NULL,
	"status" "short_workflow_image_status" DEFAULT 'in_progress' NOT NULL,
	"duration" text,
	"source_text" text,
	"image_prompt" text,
	"image_url" text,
	"movie_prompt" text,
	"movie_url" text,
	"video_task_id" text,
	"position" text,
	"datetime" timestamp with time zone,
	"project_id" integer,
	"owner_profile_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "short_workflow_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"status" "short_workflow_job_status" DEFAULT 'wait' NOT NULL,
	"keyword" text,
	"length" numeric(10, 1),
	"intro" text,
	"base" text,
	"cta" text,
	"tags" text,
	"category" "short_workflow_category",
	"description" text,
	"image_model" "short_workflow_image_model",
	"audio_file" text,
	"audio_alignment" text,
	"output" text,
	"project_id" integer,
	"owner_profile_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "short_workflow_keywords" (
	"id" serial PRIMARY KEY NOT NULL,
	"keyword" text NOT NULL,
	"status" "short_workflow_keyword_status" DEFAULT 'wait' NOT NULL,
	"reference" text,
	"category" "short_workflow_category",
	"image_model" "short_workflow_image_model",
	"project_id" integer,
	"owner_profile_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "short_workflow_prompts" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"prompt" text,
	"output" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "short_workflow_completions" ADD CONSTRAINT "short_workflow_completions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "short_workflow_completions" ADD CONSTRAINT "short_workflow_completions_owner_profile_id_profiles_id_fk" FOREIGN KEY ("owner_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "short_workflow_images" ADD CONSTRAINT "short_workflow_images_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "short_workflow_images" ADD CONSTRAINT "short_workflow_images_owner_profile_id_profiles_id_fk" FOREIGN KEY ("owner_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "short_workflow_jobs" ADD CONSTRAINT "short_workflow_jobs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "short_workflow_jobs" ADD CONSTRAINT "short_workflow_jobs_owner_profile_id_profiles_id_fk" FOREIGN KEY ("owner_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "short_workflow_keywords" ADD CONSTRAINT "short_workflow_keywords_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "short_workflow_keywords" ADD CONSTRAINT "short_workflow_keywords_owner_profile_id_profiles_id_fk" FOREIGN KEY ("owner_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;