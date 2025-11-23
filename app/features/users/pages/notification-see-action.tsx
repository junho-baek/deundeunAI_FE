import { type ActionFunctionArgs } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInProfileId } from "~/features/users/queries";

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const notificationId = params.notificationId;
  if (!notificationId) {
    return new Response("Invalid notification id", { status: 400 });
  }

  const { client } = makeSSRClient(request);
  const profileId = await getLoggedInProfileId(client);

  const { error } = await client
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("notification_id", notificationId)
    .eq("profile_id", profileId)
    .is("read_at", null);

  if (error) {
    console.error("알림 읽음 처리 실패:", error);
    return new Response("Failed to mark notification", { status: 500 });
  }

  return { ok: true };
}
