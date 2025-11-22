import { makeSSRClient } from "~/lib/supa-client";
import { redirect, type LoaderFunctionArgs } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = makeSSRClient(request);
  await client.auth.signOut();
  return redirect("/", { headers });
};
