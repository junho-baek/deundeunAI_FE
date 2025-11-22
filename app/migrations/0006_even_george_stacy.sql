CREATE TYPE "public"."event_type" AS ENUM('project_view', 'project_workspace_view', 'profile_view', 'project_list_view');--> statement-breakpoint
CREATE TABLE "events" (
	"event_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" "event_type",
	"event_data" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
-- 이벤트 트래킹을 위한 RPC 함수
CREATE OR REPLACE FUNCTION track_event(
    event_type event_type,
    event_data jsonb
) RETURNS void AS $$
BEGIN
    INSERT INTO events (event_type, event_data) 
    VALUES (event_type, event_data);
END;
$$ LANGUAGE plpgsql;
