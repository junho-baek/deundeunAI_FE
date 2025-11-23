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
import { makeSSRClient } from "./lib/supa-client";
import {
  getUserById,
  getCreditBalance,
  countUnreadNotifications,
} from "./features/users/queries";

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

export const loader = async ({ request }: Route.LoaderArgs) => {
  try {
    const { client } = makeSSRClient(request);
    const {
      data: { user },
    } = await client.auth.getUser();
    
    if (user) {
      try {
        const profile = await getUserById(client, { id: user.id });
        let creditBalance = 0;
        
        let hasNotifications = false;

        if (profile?.id) {
          try {
            const balance = await getCreditBalance(client, profile.id);
            creditBalance = balance ?? 0;
          } catch (error) {
            // 크레딧 조회 실패는 치명적이지 않음
            console.error("크레딧 잔액 조회 실패:", error);
          }

          const unreadCount = await countUnreadNotifications(
            client,
            profile.id
          );
          hasNotifications = unreadCount > 0;
        }
        
        return { user, profile, creditBalance, hasNotifications };
      } catch (error: any) {
        // Rate limit 에러인 경우 재시도하지 않도록 처리
        if (error?.status === 429 || error?.code === "over_request_rate_limit") {
          console.error("Rate limit 도달 - 프로필 조회 건너뜀:", error);
          return { user, profile: null, creditBalance: 0, hasNotifications: false };
        }
        // 프로필이 없을 수 있음 (아직 생성되지 않았을 수 있음)
        console.error("프로필 조회 실패:", error);
        return { user, profile: null, creditBalance: 0, hasNotifications: false };
      }
    }
    
    return { user: null, profile: null, creditBalance: 0, hasNotifications: false };
  } catch (error: any) {
    // Rate limit 에러인 경우 재시도하지 않도록 처리
    if (error?.status === 429 || error?.code === "over_request_rate_limit") {
      console.error("Rate limit 도달 - 인증 확인 건너뜀:", error);
      return { user: null, profile: null, creditBalance: 0, hasNotifications: false };
    }
    // 인증 확인 실패 시 null 반환 (인증되지 않은 상태로 처리)
    console.error("사용자 인증 상태 확인 실패:", error);
    return { user: null, profile: null, creditBalance: 0, hasNotifications: false };
  }
};

export default function App({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const isLoggedIn = loaderData?.user !== null;
  
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
            isLoggedIn={isLoggedIn}
            username={loaderData?.profile?.slug || undefined}
            avatar={loaderData?.profile?.avatar_url || undefined}
            name={loaderData?.profile?.name || undefined}
            creditBalance={loaderData?.creditBalance || 0}
            hasNotifications={loaderData?.hasNotifications ?? false}
            hasMessages={true}
            compact={isAuth}
          />
        )}
        <div className={contentClass}>
          <Outlet
            context={{
              isLoggedIn,
              name: loaderData?.profile?.name,
              username: loaderData?.profile?.slug,
              avatar: loaderData?.profile?.avatar_url,
              creditBalance: loaderData?.creditBalance || 0,
            }}
          />
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
