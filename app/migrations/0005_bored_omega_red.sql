ALTER TABLE "projects" DROP CONSTRAINT "projects_owner_profile_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_to_profiles" FOREIGN KEY ("owner_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;