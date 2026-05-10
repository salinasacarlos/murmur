import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"
import { mapMessageRow } from "@/lib/data/mappers"
import { fetchProfileById } from "@/lib/data/profiles"
import type { Chat, Message, Profile } from "@/lib/types"

type Client = SupabaseClient<Database>

export async function fetchChatsForProfile(
  supabase: Client,
  profileId: string
): Promise<Chat[]> {
  const { data: myParts, error: pErr } = await supabase
    .from("chat_participants")
    .select("chat_id, unread_count")
    .eq("profile_id", profileId)

  if (pErr || !myParts?.length) return []

  const chatIds = myParts.map((p) => p.chat_id)
  const unreadByChat = new Map(
    myParts.map((p) => [p.chat_id, p.unread_count] as const)
  )

  const { data: chats, error: cErr } = await supabase
    .from("chats")
    .select("*")
    .in("id", chatIds)
    .order("last_message_at", { ascending: false, nullsFirst: false })

  if (cErr || !chats?.length) return []

  const { data: allParticipants } = await supabase
    .from("chat_participants")
    .select("chat_id, profile_id")
    .in("chat_id", chatIds)

  const otherIdByChat = new Map<string, string>()
  for (const cid of chatIds) {
    const parts =
      allParticipants?.filter((x) => x.chat_id === cid).map((x) => x.profile_id) ??
      []
    const other = parts.find((id) => id !== profileId)
    if (other) otherIdByChat.set(cid, other)
  }

  const otherIds = [...new Set(otherIdByChat.values())]
  const profiles = new Map<string, Profile>()
  await Promise.all(
    otherIds.map(async (oid) => {
      const p = await fetchProfileById(supabase, oid)
      if (p) profiles.set(oid, p)
    })
  )

  const result: Chat[] = []

  for (const chat of chats) {
    const otherId = otherIdByChat.get(chat.id)
    if (!otherId) continue
    const profile = profiles.get(otherId)
    if (!profile) continue

    const { data: lastMsg } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chat.id)
      .order("sent_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    const messages: Message[] = lastMsg
      ? [mapMessageRow(lastMsg, profileId)]
      : []

    result.push({
      id: chat.id,
      profile,
      messages,
      unread: unreadByChat.get(chat.id) ?? 0,
      lastSeen: chat.last_message_at
        ? formatShortDate(chat.last_message_at)
        : undefined,
    })
  }

  return result
}

function formatShortDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
    })
  } catch {
    return undefined
  }
}

export async function fetchChatConversation(
  supabase: Client,
  chatId: string,
  currentUserId: string
): Promise<Chat | null> {
  const { data: mine } = await supabase
    .from("chat_participants")
    .select("chat_id")
    .eq("chat_id", chatId)
    .eq("profile_id", currentUserId)
    .maybeSingle()

  if (!mine) return null

  const { data: row } = await supabase
    .from("chat_participants")
    .select("profile_id, unread_count")
    .eq("chat_id", chatId)

  const otherId = row?.find((r) => r.profile_id !== currentUserId)?.profile_id
  if (!otherId) return null

  const myUnread = row?.find((r) => r.profile_id === currentUserId)?.unread_count

  const profile = await fetchProfileById(supabase, otherId)
  if (!profile) return null

  const { data: chatMeta } = await supabase
    .from("chats")
    .select("*")
    .eq("id", chatId)
    .maybeSingle()

  const { data: msgs } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("sent_at", { ascending: true })
    .limit(200)

  const messages = (msgs ?? []).map((m) => mapMessageRow(m, currentUserId))

  return {
    id: chatId,
    profile,
    messages,
    unread: myUnread ?? 0,
    lastSeen: chatMeta?.last_message_at
      ? formatShortDate(chatMeta.last_message_at)
      : undefined,
  }
}

export async function sendChatMessage(
  supabase: Client,
  args: { chatId: string; senderId: string; body: string }
): Promise<
  { ok: true; message: Message } | { ok: false; error: string }
> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      chat_id: args.chatId,
      sender_id: args.senderId,
      body: args.body,
      sent_at: new Date().toISOString(),
    })
    .select("*")
    .single()

  if (error || !data) {
    return { ok: false, error: error?.message ?? "No se pudo enviar" }
  }

  return { ok: true, message: mapMessageRow(data, args.senderId) }
}

export async function markChatReadRpc(
  supabase: Client,
  chatId: string
): Promise<void> {
  await supabase.rpc("mark_chat_read", { p_chat_id: chatId })
}
