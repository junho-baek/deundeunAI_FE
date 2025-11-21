import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useLocation, useNavigation } from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import Navigation from "./common/components/navigation";
import { cn } from "./lib/utils";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <main className="bg-background text-foreground">{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  
  const isMy = location.pathname.startsWith("/my");
  const isAuth = location.pathname.startsWith("/auth");
  const surfaceClass = isMy
    ? ""
    : isAuth
      ? "bg-[#F5E9D5] text-foreground"
      : "bg-background text-foreground";
  const contentClass = [
    "flex-1 w-full overflow-y-auto",
    !isMy && !isAuth ? "pt-16" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const layoutClass = cn(
    "flex h-full w-full flex-col",
    surfaceClass,
    isLoading && "animate-pulse transition-opacity"
  );

  return (
    <div className="w-screen h-screen overflow-hidden">
      <div className={layoutClass}>
        {!isMy && (
          <Navigation
            isLoggedIn={false}
            hasNotifications={true}
            hasMessages={true}
            compact={isAuth}
          />
        )}
        <div className={contentClass}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
