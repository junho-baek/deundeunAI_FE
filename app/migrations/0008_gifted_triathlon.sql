ALTER TABLE "project_messages" ADD COLUMN "attachments" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "project_messages" ADD COLUMN "aspect_ratio" text;--> statement-breakpoint
ALTER TABLE "project_messages" ADD COLUMN "step_key" "project_step_key";