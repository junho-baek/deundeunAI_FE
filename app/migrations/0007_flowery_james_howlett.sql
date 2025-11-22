CREATE TYPE "public"."credit_transaction_type" AS ENUM('granted', 'consumed', 'refunded', 'expired', 'manual_adjust');--> statement-breakpoint
CREATE TYPE "public"."credit_usage_status" AS ENUM('pending', 'processing', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TABLE "profile_credit_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"type" "credit_transaction_type" NOT NULL,
	"amount" integer NOT NULL,
	"balance_before" integer NOT NULL,
	"balance_after" integer NOT NULL,
	"description" text,
	"related_project_id" uuid,
	"related_step_key" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_credit_usages" (
	"id" serial PRIMARY KEY NOT NULL,
	"usage_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"step_key" text NOT NULL,
	"credits_used" integer NOT NULL,
	"status" "credit_usage_status" DEFAULT 'pending' NOT NULL,
	"workflow_execution_id" text,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile_billing_plans" ADD COLUMN "monthly_credits" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profile_billing_plans" ADD COLUMN "credit_overage_rate" numeric;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "credit_balance" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "credit_last_granted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "credit_monthly_amount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profile_credit_transactions" ADD CONSTRAINT "profile_credit_transactions_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_credit_usages" ADD CONSTRAINT "profile_credit_usages_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "credit_transactions_transaction_id_unique" ON "profile_credit_transactions" USING btree ("transaction_id");--> statement-breakpoint
CREATE UNIQUE INDEX "credit_transactions_profile_created_unique" ON "profile_credit_transactions" USING btree ("profile_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "credit_usages_usage_id_unique" ON "profile_credit_usages" USING btree ("usage_id");--> statement-breakpoint
CREATE UNIQUE INDEX "credit_usages_project_step_unique" ON "profile_credit_usages" USING btree ("project_id","step_key");