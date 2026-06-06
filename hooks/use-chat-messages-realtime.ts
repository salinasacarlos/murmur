"use client"

import * as React from "react"

import { mapMessageRow } from "@/lib/data/mappers"
import type { Database } from "@/lib/database.types"
import { REALTIME_IN_FILTER_MAX } from "@/lib/platform-defaults"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Message } from "@/lib/types"

type MessagesRow = Database["public"]["Tables"]["messages"]["Row"]

export { REALTIME_IN_FILTER_MAX }

/**
 * Suscripción a INSERT en `messages` para un solo chat (pantalla de conversación).
 */
export function useChatMessagesRealtime(
  chatId: string | null | undefined,
  currentUserId: string | null | undefined,
  onInsert: (message: Message) => void
) {
  const onInsertRef = React.useRef(onInsert)
  onInsertRef.current = onInsert

  React.useEffect(() => {
    if (!chatId || !currentUserId) return

    const supabase = getSupabaseBrowserClient()
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const row = payload.new as MessagesRow
          if (!row?.id || row.chat_id !== chatId) return
          onInsertRef.current(mapMessageRow(row, currentUserId))
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [chatId, currentUserId])
}

export function buildMessagesInboxFilter(chatIds: string[]): string | null {
  const ids = [...new Set(chatIds.filter(Boolean))]
  if (!ids.length) return null
  if (ids.length === 1) return `chat_id=eq.${ids[0]}`
  const slice = ids.slice(0, REALTIME_IN_FILTER_MAX)
  return `chat_id=in.(${slice.join(",")})`
}
