CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text,
	"title" text NOT NULL,
	"description" text,
	"likes" integer DEFAULT 0 NOT NULL,
	"ctr" double precision,
	"budget" integer,
	"tiktok_url" text,
	"video_url" text,
	"thumbnail" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
