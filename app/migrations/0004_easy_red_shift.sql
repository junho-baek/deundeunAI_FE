ALTER TABLE "admin_announcements" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "admin_system_metrics" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "admin_tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "select-admin-announcements-policy" ON "admin_announcements" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "profiles"
        WHERE "profiles"."id" = (select auth.uid())
        AND "profiles"."role" = 'admin'
      ));--> statement-breakpoint
CREATE POLICY "insert-admin-announcements-policy" ON "admin_announcements" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (
        SELECT 1 FROM "profiles"
        WHERE "profiles"."id" = (select auth.uid())
        AND "profiles"."role" = 'admin'
      ));--> statement-breakpoint
CREATE POLICY "update-admin-announcements-policy" ON "admin_announcements" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "profiles"
        WHERE "profiles"."id" = (select auth.uid())
        AND "profiles"."role" = 'admin'
      )) WITH CHECK (EXISTS (
        SELECT 1 FROM "profiles"
        WHERE "profiles"."id" = (select auth.uid())
        AND "profiles"."role" = 'admin'
      ));--> statement-breakpoint
CREATE POLICY "delete-admin-announcements-policy" ON "admin_announcements" AS PERMISSIVE FOR DELETE TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "profiles"
        WHERE "profiles"."id" = (select auth.uid())
        AND "profiles"."role" = 'admin'
      ));--> statement-breakpoint
CREATE POLICY "select-admin-system-metrics-policy" ON "admin_system_metrics" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "profiles"
        WHERE "profiles"."id" = (select auth.uid())
        AND "profiles"."role" = 'admin'
      ));--> statement-breakpoint
CREATE POLICY "insert-admin-system-metrics-policy" ON "admin_system_metrics" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (
        SELECT 1 FROM "profiles"
        WHERE "profiles"."id" = (select auth.uid())
        AND "profiles"."role" = 'admin'
      ));--> statement-breakpoint
CREATE POLICY "update-admin-system-metrics-policy" ON "admin_system_metrics" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "profiles"
        WHERE "profiles"."id" = (select auth.uid())
        AND "profiles"."role" = 'admin'
      )) WITH CHECK (EXISTS (
        SELECT 1 FROM "profiles"
        WHERE "profiles"."id" = (select auth.uid())
        AND "profiles"."role" = 'admin'
      ));--> statement-breakpoint
CREATE POLICY "delete-admin-system-metrics-policy" ON "admin_system_metrics" AS PERMISSIVE FOR DELETE TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "profiles"
        WHERE "profiles"."id" = (select auth.uid())
        AND "profiles"."role" = 'admin'
      ));--> statement-breakpoint
CREATE POLICY "select-admin-tasks-policy" ON "admin_tasks" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "profiles"
        WHERE "profiles"."id" = (select auth.uid())
        AND "profiles"."role" = 'admin'
      ));--> statement-breakpoint
CREATE POLICY "insert-admin-tasks-policy" ON "admin_tasks" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (
        SELECT 1 FROM "profiles"
        WHERE "profiles"."id" = (select auth.uid())
        AND "profiles"."role" = 'admin'
      ));--> statement-breakpoint
CREATE POLICY "update-admin-tasks-policy" ON "admin_tasks" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "profiles"
        WHERE "profiles"."id" = (select auth.uid())
        AND "profiles"."role" = 'admin'
      )) WITH CHECK (EXISTS (
        SELECT 1 FROM "profiles"
        WHERE "profiles"."id" = (select auth.uid())
        AND "profiles"."role" = 'admin'
      ));--> statement-breakpoint
CREATE POLICY "delete-admin-tasks-policy" ON "admin_tasks" AS PERMISSIVE FOR DELETE TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "profiles"
        WHERE "profiles"."id" = (select auth.uid())
        AND "profiles"."role" = 'admin'
      ));