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
            index("features/projects/pages/project-page.tsx"),
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
            route("upload", "features/projects/pages/project-upload-page.tsx"),
            route("status", "features/projects/pages/project-status-page.tsx"),
            route(
              "analytics",
              "features/projects/pages/project-analytics-page.tsx"
            ),
          ]),
        ]),
      ]),

      // Settings
      ...prefix("/settings", [
        route("profile", "features/settings/pages/profile-page.tsx"),
        route("billing", "features/settings/pages/billing-page.tsx"),
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
