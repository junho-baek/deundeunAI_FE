import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  // ───────────────
  // Public Pages
  // ───────────────
  index("common/pages/home-page.tsx"),

  ...prefix("/auth", [
    layout("features/auth/layouts/auth-layout.tsx", [
      route("login", "features/auth/pages/login-page.tsx"),
      route("join", "features/auth/pages/join-page.tsx"),
    ]),
    // 소셜 로그인 라우트 (레이아웃 없이 직접 처리)
    ...prefix("social", [
      ...prefix(":provider", [
        route("start", "features/auth/pages/social-start-page.tsx"),
        route("complete", "features/auth/pages/social-complete-page.tsx"),
      ]),
    ]),
  ]),

  route("/logout", "features/auth/pages/logout-page.tsx"),

  ...prefix("/pricing", [
    index("features/pricing/pages/pricing-page.tsx"),
    route("subscribe", "features/pricing/pages/subscribe-action.tsx"),
  ]),

  // ───────────────
  // Public User Profiles
  // ───────────────
  ...prefix("/users/:username", [
    layout("features/users/layouts/public-profile-layout.tsx", [
      index("features/users/pages/public-profile-page.tsx"),
      route(
        "projects",
        "features/users/pages/public-profile-projects-page.tsx"
      ),
    ]),
  ]),

  ...prefix("/usecases", [
    layout("features/usecases/layouts/usecases-layout.tsx", [
      index("features/usecases/pages/usecases-index-page.tsx"),
      route("senior", "features/usecases/pages/usecases-senior-page.tsx"),
      route(
        "freelancer",
        "features/usecases/pages/usecases-freelancer-page.tsx"
      ),
      route("company", "features/usecases/pages/usecases-company-page.tsx"),
    ]),
  ]),

  ...prefix("/resources", [
    layout("features/resources/layouts/resources-layout.tsx", [
      index("features/resources/pages/resources-index-page.tsx"),
      route("about", "features/resources/pages/resources-about-page.tsx"),
      route("blog", "features/resources/pages/resources-blog-page.tsx"),
      route(
        "newsletter",
        "features/resources/pages/resources-newsletter-page.tsx"
      ),
      route("free", "features/resources/pages/resources-free-page.tsx"),
    ]),
  ]),

  route("/api/docs", "features/api/pages/api-docs-page.tsx"),

  ...prefix("/subscribe", [
    index("features/billing/pages/subscribe-page.tsx"),
    route("success", "features/billing/pages/subscribe-success-page.tsx"),
    route("fail", "features/billing/pages/subscribe-fail-page.tsx"),
  ]),

  // ───────────────
  // Authenticated User Area
  // ───────────────
  ...prefix("/my", [
    layout("features/users/layouts/app-layout.tsx", [
      // Dashboard
      ...prefix("/dashboard", [
        index("features/dashboard/pages/dashboard-page.tsx"),

        // Project Lifecycle
        ...prefix("/project", [
          index("features/projects/pages/project-list-page.tsx"),
          route("create", "features/projects/pages/project-create-page.tsx"),
          ...prefix("/:projectId", [
            layout("features/projects/layouts/project-detail-layout.tsx", [
              index("features/projects/pages/project-workspace-page.tsx"),
              route(
                "form/submit",
                "features/projects/pages/project-form-submit-action.tsx"
              ),
              route(
                "generate",
                "features/projects/pages/project-generate-page.tsx"
              ),
              route(
                "realtime",
                "features/projects/pages/project-realtime-page.tsx"
              ),
              route(
                "preview",
                "features/projects/pages/project-preview-page.tsx"
              ),
              route(
                "upload",
                "features/projects/pages/project-upload-page.tsx"
              ),
              route(
                "status",
                "features/projects/pages/project-status-page.tsx"
              ),
              // Brief Actions
              route(
                "brief/submit",
                "features/projects/pages/project-brief-submit-action.tsx"
              ),
              route(
                "brief/update",
                "features/projects/pages/project-brief-update-action.tsx"
              ),
              // Script Actions
              route(
                "script/submit",
                "features/projects/pages/project-script-submit-action.tsx"
              ),
              route(
                "script/update",
                "features/projects/pages/project-script-update-action.tsx"
              ),
              // Narration Actions
              route(
                "narration/regenerate",
                "features/projects/pages/project-narration-regenerate-action.tsx"
              ),
              route(
                "narration/submit",
                "features/projects/pages/project-narration-submit-action.tsx"
              ),
              // Images Actions
              route(
                "images/regenerate",
                "features/projects/pages/project-images-regenerate-action.tsx"
              ),
              route(
                "images/submit",
                "features/projects/pages/project-images-submit-action.tsx"
              ),
              // Videos Actions
              route(
                "videos/regenerate",
                "features/projects/pages/project-videos-regenerate-action.tsx"
              ),
              route(
                "videos/submit",
                "features/projects/pages/project-videos-submit-action.tsx"
              ),
              // Deploy Action
              route(
                "deploy",
                "features/projects/pages/project-deploy-action.tsx"
              ),
            ]),
            route(
              "analytics",
              "features/projects/pages/project-analytics-page.tsx"
            ),
          ]),
        ]),

        // Settings
        ...prefix("/settings", [
          route("profile", "features/users/pages/profile-page.tsx"),
          route("profile/edit", "features/users/pages/profile-edit-page.tsx"),
          route(
            "profile/avatar",
            "features/users/pages/profile-avatar-upload-action.tsx"
          ),
          route("billing", "features/users/pages/billing-page.tsx"),
        ]),
      ]),
    ]),
  ]),

  // ───────────────
  // Service (Shorts Entry Point)
  // ───────────────
  ...prefix("/service/shorts", [
    index("features/shorts/pages/shorts-landing-page.tsx"),
    route("create", "features/shorts/pages/shorts-create-page.tsx"),
  ]),

  // ───────────────
  // Admin (Optional)
  // ───────────────
  ...prefix("/admin", [
    layout("features/admin/layouts/admin-layout.tsx", [
      index("features/admin/pages/admin-dashboard-page.tsx"),
    ]),
  ]),

  // ───────────────
  // Error / Fallback
  // ───────────────
  route("/error", "common/pages/error-page.tsx"),
  route("*", "common/pages/not-found-page.tsx"),
] satisfies RouteConfig;
