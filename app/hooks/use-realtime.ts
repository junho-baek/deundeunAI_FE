import { useEffect } from "react";
import { useRevalidator } from "react-router";
import type { SupabaseClient } from "@supabase/supabase-js";

type UseRealtimeProps = {
  supabase: SupabaseClient;
  channelName: string;
  table: string;
  filter?: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  enabled?: boolean;
};

export function useRealtime({
  supabase,
  channelName,
  table,
  filter,
  event = "*",
  enabled = true,
}: UseRealtimeProps) {
  const revalidator = useRevalidator();

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event, schema: "public", table, filter },
        () => {
          console.log(`🔔 Realtime Update: ${table}`);
          revalidator.revalidate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, channelName, table, filter, event, enabled, revalidator]);
}
