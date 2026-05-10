import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"
import {
  freeAllowsNewConnection,
  isPremiumPlan,
  MSG_FREE_CONNECTION_SEND_LIMIT,
  type UserPlan,
} from "@/lib/plan-limits"
import { fetchProfilesByIds } from "@/lib/data/profiles"
import type {
  IgnoredConnection,
  ReceivedConnection,
  RelationType,
  SentConnection,
} from "@/lib/types"

type Client = SupabaseClient<Database>

async function fetchProfilePlan(
  supabase: Client,
  profileId: string
): Promise<UserPlan> {
  const { data } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", profileId)
    .maybeSingle()
  return data?.plan === "premium" ? "premium" : "free"
}

/** Conexiones aceptadas donde el usuario es remitente o destinatario (una fila = una conexión). */
export async function countAcceptedConnectionsForProfile(
  supabase: Client,
  profileId: string
): Promise<number> {
  const [sent, recv] = await Promise.all([
    supabase
      .from("connections")
      .select("*", { count: "exact", head: true })
      .eq("status", "accepted")
      .eq("sender_id", profileId),
    supabase
      .from("connections")
      .select("*", { count: "exact", head: true })
      .eq("status", "accepted")
      .eq("receiver_id", profileId),
  ])
  return (sent.count ?? 0) + (recv.count ?? 0)
}

/** Estado de conexión con otro perfil (vista Descubrir / tarjeta). */
export type PeerConnectionHint =
  | { state: "none" }
  | {
      state: "connected"
      connectionId: string
      chatId: string | null
    }
  | { state: "request_sent"; connectionId: string }
  | { state: "request_received"; connectionId: string }

/**
 * Mapa peerProfileId → hint para el usuario actual (todas las filas relevantes en connections).
 */
export async function fetchPeerConnectionHints(
  supabase: Client,
  me: string
): Promise<Map<string, PeerConnectionHint>> {
  const { data: conns, error } = await supabase
    .from("connections")
    .select("id, sender_id, receiver_id, status")
    .or(`sender_id.eq.${me},receiver_id.eq.${me}`)

  if (error || !conns?.length) return new Map()

  const byPeer = new Map<
    string,
    { id: string; sender_id: string; receiver_id: string; status: string }[]
  >()
  for (const c of conns) {
    const peer = c.sender_id === me ? c.receiver_id : c.sender_id
    const list = byPeer.get(peer) ?? []
    list.push(c)
    byPeer.set(peer, list)
  }

  const result = new Map<string, PeerConnectionHint>()
  const acceptedConnIds: string[] = []

  for (const [peer, rows] of byPeer) {
    const accepted = rows.find((r) => r.status === "accepted")
    if (accepted) {
      acceptedConnIds.push(accepted.id)
      result.set(peer, {
        state: "connected",
        connectionId: accepted.id,
        chatId: null,
      })
      continue
    }
    const pending = rows.find((r) => r.status === "pending")
    if (pending) {
      const outgoing = pending.sender_id === me
      result.set(
        peer,
        outgoing
          ? { state: "request_sent", connectionId: pending.id }
          : { state: "request_received", connectionId: pending.id }
      )
    }
  }

  if (acceptedConnIds.length) {
    const chatMap = await fetchChatIdsByConnectionIds(supabase, acceptedConnIds)
    for (const [peer, hint] of [...result.entries()]) {
      if (hint.state === "connected") {
        result.set(peer, {
          ...hint,
          chatId: chatMap.get(hint.connectionId) ?? null,
        })
      }
    }
  }

  return result
}

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

/** Solicitud desde feed / perfil (sender = auth.uid() vía RLS). */
export async function sendConnectionRequest(
  supabase: Client,
  input: {
    senderId: string
    receiverId: string
    relation: RelationType
    message: string
    searchId?: string | null
  }
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (input.senderId === input.receiverId) {
    return { ok: false, error: "No puedes enviarte una solicitud a ti mismo." }
  }

  const { data: pendingSameDirection } = await supabase
    .from("connections")
    .select("id")
    .eq("sender_id", input.senderId)
    .eq("receiver_id", input.receiverId)
    .eq("status", "pending")
    .maybeSingle()

  if (pendingSameDirection) {
    return {
      ok: false,
      error: "Ya enviaste una solicitud pendiente a esta persona.",
    }
  }

  const { data: acceptedAB } = await supabase
    .from("connections")
    .select("id")
    .eq("sender_id", input.senderId)
    .eq("receiver_id", input.receiverId)
    .eq("status", "accepted")
    .maybeSingle()

  const { data: acceptedBA } = await supabase
    .from("connections")
    .select("id")
    .eq("sender_id", input.receiverId)
    .eq("receiver_id", input.senderId)
    .eq("status", "accepted")
    .maybeSingle()

  if (acceptedAB || acceptedBA) {
    return { ok: false, error: "Ya tienen una conexión aceptada." }
  }

  const senderPlan = await fetchProfilePlan(supabase, input.senderId)
  if (!isPremiumPlan(senderPlan)) {
    const acceptedN = await countAcceptedConnectionsForProfile(
      supabase,
      input.senderId
    )
    if (!freeAllowsNewConnection(acceptedN)) {
      return { ok: false, error: MSG_FREE_CONNECTION_SEND_LIMIT }
    }
  }

  const body = input.message.trim() || "—"
  const { error } = await supabase.from("connections").insert({
    sender_id: input.senderId,
    receiver_id: input.receiverId,
    relation: input.relation,
    message: body,
    search_id: input.searchId ?? null,
    status: "pending",
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
