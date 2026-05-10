import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"
import { fetchProfilesByIds } from "@/lib/data/profiles"
import type {
  IgnoredConnection,
  ReceivedConnection,
  SentConnection,
} from "@/lib/types"

type Client = SupabaseClient<Database>

export interface ConnectionsBoard {
  received: ReceivedConnection[]
  sent: SentConnection[]
  ignored: IgnoredConnection[]
}

export async function fetchConnectionsBoard(
  supabase: Client,
  profileId: string
): Promise<ConnectionsBoard> {
  const { data: conns, error } = await supabase
    .from("connections")
    .select("*")
    .or(`sender_id.eq.${profileId},receiver_id.eq.${profileId}`)
    .order("created_at", { ascending: false })

  if (error || !conns) {
    return { received: [], sent: [], ignored: [] }
  }

  const others = new Set<string>()
  const searchIds = new Set<string>()
  for (const c of conns) {
    if (c.sender_id !== profileId) others.add(c.sender_id)
    if (c.receiver_id !== profileId) others.add(c.receiver_id)
    if (c.search_id) searchIds.add(c.search_id)
  }

  const [profileMap, searchTitles, chatByConn] = await Promise.all([
    fetchProfilesByIds(supabase, [...others]),
    fetchSearchTitles(supabase, [...searchIds]),
    fetchChatIdsByConnectionIds(
      supabase,
      conns.filter((c) => c.status === "accepted").map((c) => c.id)
    ),
  ])

  const received: ReceivedConnection[] = []
  const sent: SentConnection[] = []
  const ignored: IgnoredConnection[] = []

  for (const c of conns) {
    const isSender = c.sender_id === profileId

    if (c.status === "ignored") {
      if (c.receiver_id === profileId) {
        const p = profileMap.get(c.sender_id)
        if (!p) continue
        ignored.push({
          id: c.id,
          profile: p,
          relation: c.relation,
          ignoredAt: (c.updated_at ?? c.created_at).slice(0, 10),
        })
      } else if (c.sender_id === profileId) {
        const p = profileMap.get(c.receiver_id)
        if (!p) continue
        sent.push({
          id: c.id,
          profile: p,
          relation: c.relation,
          message: c.message,
          status: "rejected",
          sentAt: (c.updated_at ?? c.created_at).slice(0, 10),
        })
      }
      continue
    }

    if (c.status === "pending") {
      if (!isSender && c.receiver_id === profileId) {
        const p = profileMap.get(c.sender_id)
        if (!p) continue
        received.push({
          id: c.id,
          profile: p,
          relation: c.relation,
          message: c.message,
          searchTitle: c.search_id ? searchTitles.get(c.search_id) : undefined,
          receivedAt: c.created_at.slice(0, 10),
        })
      } else if (isSender) {
        const p = profileMap.get(c.receiver_id)
        if (!p) continue
        sent.push({
          id: c.id,
          profile: p,
          relation: c.relation,
          message: c.message,
          status: "pending",
          sentAt: c.created_at.slice(0, 10),
        })
      }
      continue
    }

    if (c.status === "accepted") {
      if (isSender) {
        const p = profileMap.get(c.receiver_id)
        if (!p) continue
        sent.push({
          id: c.id,
          profile: p,
          relation: c.relation,
          message: c.message,
          status: "accepted",
          sentAt: (c.responded_at ?? c.updated_at ?? c.created_at).slice(0, 10),
          chatId: chatByConn.get(c.id) ?? null,
        })
      }
      continue
    }

    if (c.status === "rejected") {
      if (isSender) {
        const p = profileMap.get(c.receiver_id)
        if (!p) continue
        sent.push({
          id: c.id,
          profile: p,
          relation: c.relation,
          message: c.message,
          status: "rejected",
          sentAt: (c.responded_at ?? c.updated_at ?? c.created_at).slice(0, 10),
        })
      }
    }
  }

  return { received, sent, ignored }
}

async function fetchSearchTitles(
  supabase: Client,
  ids: string[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  if (!ids.length) return map
  const { data } = await supabase.from("searches").select("id, title").in("id", ids)
  for (const row of data ?? []) {
    map.set(row.id, row.title)
  }
  return map
}

async function fetchChatIdsByConnectionIds(
  supabase: Client,
  connectionIds: string[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  if (!connectionIds.length) return map
  const { data } = await supabase
    .from("chats")
    .select("id, connection_id")
    .in("connection_id", connectionIds)

  for (const row of data ?? []) {
    if (row.connection_id) map.set(row.connection_id, row.id)
  }
  return map
}

export async function acceptConnectionRpc(
  supabase: Client,
  connectionId: string
): Promise<
  { ok: true; chatId: string | null } | { ok: false; message: string }
> {
  const { data, error } = await supabase.rpc("accept_connection", {
    p_connection_id: connectionId,
  })
  if (error) return { ok: false, message: error.message }
  const row = Array.isArray(data) ? data[0] : data
  const chatId =
    row && typeof row === "object" && "chat_id" in row
      ? (row as { chat_id: string }).chat_id
      : null
  return { ok: true, chatId }
}

export async function ignoreConnectionRpc(
  supabase: Client,
  connectionId: string
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.rpc("ignore_connection", {
    p_connection_id: connectionId,
  })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function cancelPendingConnection(
  supabase: Client,
  connectionId: string,
  senderId: string
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("connections")
    .delete()
    .eq("id", connectionId)
    .eq("sender_id", senderId)
    .eq("status", "pending")

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
