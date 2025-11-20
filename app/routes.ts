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
  ]),

  route("/pricing", "features/pricing/pages/pricing-page.tsx"),

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
