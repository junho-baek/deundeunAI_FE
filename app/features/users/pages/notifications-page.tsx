import {
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
} from "react-router";
import NotificationCard from "~/features/users/components/notification-card";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInProfileId, getNotifications } from "~/features/users/queries";
import { Typography } from "~/common/components/typography";

type LoaderData = Awaited<ReturnType<typeof loader>>;

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const diff = date.getTime() - Date.now();
  const intervals: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["week", 1000 * 60 * 60 * 24 * 7],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
  ];
  const rtf = new Intl.RelativeTimeFormat("ko", { numeric: "auto" });

  for (const [unit, ms] of intervals) {
    if (Math.abs(diff) >= ms || unit === "minute") {
      const value = Math.round(diff / ms);
      return rtf.format(value, unit);
    }
  }
  return rtf.format(0, "minute");
}

export const meta: MetaFunction = () => {
  return [
    { title: "알림 센터 - 든든AI" },
    {
      name: "description",
      content: "프로젝트 진행 상황과 시스템 메시지를 한 곳에서 확인하세요.",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = makeSSRClient(request);
  const profileId = await getLoggedInProfileId(client);
  const notifications = await getNotifications(client, { profileId, limit: 50 });
  return { notifications };
}

export default function NotificationsPage() {
  const { notifications } = useLoaderData<LoaderData>();

  return (
    <section className="mx-auto flex h-full w-full max-w-3xl flex-col gap-6 p-6">
      <div className="space-y-2">
        <Typography
          as="h1"
          variant="h2"
          className="text-2xl font-semibold text-foreground"
        >
          알림 센터
        </Typography>
        <Typography variant="muted">
          프로젝트 단계 진행 상황과 시스템 알림을 확인하세요.
        </Typography>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed bg-muted/30 p-10 text-center">
          <div className="space-y-2">
            <Typography variant="h4">새로운 알림이 없습니다.</Typography>
            <Typography variant="muted">
              프로젝트를 생성하고 단계를 완료하면 이곳에 알림이 표시됩니다.
            </Typography>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.notification_id}
              id={notification.notification_id}
              title={notification.title}
              body={notification.body}
              timestamp={formatRelativeTime(notification.created_at)}
              seen={notification.read_at !== null}
              category={notification.category}
              ctaHref={notification.cta_href ?? undefined}
              ctaLabel={notification.cta_label ?? undefined}
              metadata={
                notification.metadata as Record<string, unknown> | null
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
