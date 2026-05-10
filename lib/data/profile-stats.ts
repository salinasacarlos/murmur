import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"

type Client = SupabaseClient<Database>

export type LiveProfileStats = {
  matches: number
  connections: number
  messages: number
}

/**
 * Cuentas reales desde tablas (las columnas profiles.stats_* no se mantienen con triggers).
 */
export async function fetchLiveProfileStats(
  supabase: Client,
  userId: string
): Promise<LiveProfileStats> {
  const [searchesRes, sentRes, recvRes, participantsRes] = await Promise.all([
    supabase.from("searches").select("matches_count").eq("owner_id", userId),
    supabase
      .from("connections")
      .select("*", { count: "exact", head: true })
      .eq("status", "accepted")
      .eq("sender_id", userId),
    supabase
      .from("connections")
      .select("*", { count: "exact", head: true })
      .eq("status", "accepted")
      .eq("receiver_id", userId),
    supabase.from("chat_participants").select("chat_id").eq("profile_id", userId),
  ])

  const matches =
    searchesRes.data?.reduce((s, r) => s + (r.matches_count ?? 0), 0) ?? 0

  const connections = (sentRes.count ?? 0) + (recvRes.count ?? 0)

  const chatIds = participantsRes.data?.map((r) => r.chat_id) ?? []

  let messages = 0
  if (chatIds.length > 0) {
    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .in("chat_id", chatIds)
    messages = count ?? 0
  }

  return { matches, connections, messages }
}
