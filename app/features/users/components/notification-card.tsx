import { Link, useFetcher } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import { cn } from "~/lib/utils";

type NotificationCardProps = {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  seen?: boolean;
  category?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  metadata?: Record<string, unknown> | null;
};

export function NotificationCard({
  id,
  title,
  body,
  timestamp,
  seen = false,
  category,
  ctaLabel,
  ctaHref,
  metadata,
}: NotificationCardProps) {
  const badgeLabel =
    category && category.trim().length > 0 ? category : "알림";
  const projectIdFromMetadata =
    metadata && typeof (metadata as { project_id?: unknown }).project_id === "string"
      ? (metadata as { project_id?: string }).project_id
      : undefined;
  const fallbackHref = projectIdFromMetadata
    ? `/my/dashboard/project/${projectIdFromMetadata}`
    : undefined;
  const resolvedHref = ctaHref || fallbackHref;
  const fetcher = useFetcher();
  const isMarking = fetcher.state !== "idle";
  const optimisticSeen = seen || isMarking;

  return (
    <Card
      className={cn(
        "w-full transition-colors",
        !optimisticSeen && "border-primary/60 bg-primary/5"
      )}
    >
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {badgeLabel ? (
            <Badge variant="outline" className="text-[11px] uppercase">
              {badgeLabel}
            </Badge>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">{timestamp}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-foreground/80">{body}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-2">
        {resolvedHref ? (
          <Button asChild size="sm" variant="secondary">
            <Link to={resolvedHref}>{ctaLabel || "바로가기"}</Link>
          </Button>
        ) : (
          <span />
        )}
        {!optimisticSeen && (
          <fetcher.Form
            method="post"
            action={`/my/notifications/${id}/see`}
            className="flex"
          >
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              disabled={isMarking}
            >
              읽음 처리
            </Button>
          </fetcher.Form>
        )}
      </CardFooter>
    </Card>
  );
}

export default NotificationCard;
