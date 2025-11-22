import { Link, Outlet, useLoaderData, useLocation } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";
import { Badge } from "~/common/components/ui/badge";
import { cn } from "~/lib/utils";
import { getUserProfile } from "../queries";
import type { Route } from "./+types/public-profile-layout";

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: `${data.profile.name} | 든든AI` }];
};

export async function loader({ params }: Route.LoaderArgs) {
  const profile = await getUserProfile(params.username);

  if (!profile) {
    throw new Response("Profile not found", { status: 404 });
  }

  return {
    profile,
    headline: profile.bio || "",
    bio: profile.bio || "",
  };
}

export default function PublicProfileLayout() {
  const { profile, headline, bio } = useLoaderData<typeof loader>();
  const location = useLocation();

  const navItems = [
    { label: "소개", to: `/users/${profile.slug}` },
    { label: "프로젝트", to: `/users/${profile.slug}/projects` },
  ];

  const avatarFallback = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="space-y-10">
      {/* 프로필 헤더 */}
      <div className="flex items-center gap-4">
        <Avatar className="size-40">
          {profile.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt={profile.name} />
          ) : null}
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-semibold">{profile.name}</h1>
          </div>
          <div className="flex gap-2 items-center">
            {profile.slug && (
              <span className="text-sm text-muted-foreground">@{profile.slug}</span>
            )}
            {profile.role && (
              <Badge variant="secondary">{profile.role}</Badge>
            )}
            {profile.company && (
              <Badge variant="secondary">{profile.company}</Badge>
            )}
            {profile.project_count !== undefined && (
              <Badge variant="secondary">{profile.project_count}개 프로젝트</Badge>
            )}
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-5">
        {navItems.map((item) => {
          const isActive =
            item.to === `/users/${profile.slug}`
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                isActive
                  ? "text-foreground border-b-2 border-foreground pb-2"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* 하위 페이지 */}
      <div className="max-w-screen-md">
        <Outlet context={{ headline, bio }} />
      </div>
    </div>
  );
}

