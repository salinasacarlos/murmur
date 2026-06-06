"use client"

import * as React from "react"
import Link from "next/link"

import { Avatar } from "@/components/ui/avatar"
import { ChatBubble } from "@/components/messages/chat-bubble"
import { MessageComposer } from "@/components/messages/message-composer"
import { ReportUserDrawer } from "@/components/report/report-user-drawer"
import { IconArrowLeft, IconUser } from "@/components/icons"
import { sendChatMessage } from "@/lib/data/chats"
import { useChatMessagesRealtime } from "@/hooks/use-chat-messages-realtime"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Chat, Message } from "@/lib/types"

interface ChatConversationProps {
  chatId: string
  currentUserId: string
  initialChat: Chat
}

export function ChatConversation({
  chatId,
  currentUserId,
  initialChat,
}: ChatConversationProps) {
  const [messages, setMessages] = React.useState<Message[]>(
    initialChat.messages
  )
  const [reportOpen, setReportOpen] = React.useState(false)

  const appendIfNew = React.useCallback((msg: Message) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev
      return [...prev, msg]
    })
  }, [])

  useChatMessagesRealtime(chatId, currentUserId, appendIfNew)

  const scrollRef = React.useRef<HTMLDivElement>(null)
  React.useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages.length])

  async function handleSend(text: string) {
    const supabase = getSupabaseBrowserClient()
    const res = await sendChatMessage(supabase, {
      chatId,
      senderId: currentUserId,
      body: text,
    })
    if (!res.ok) {
      console.error(res.error)
      return
    }
    appendIfNew(res.message)
  }

  const chat = initialChat
  const groups = groupMessages(messages)

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--bg)]">
      <header
        className="flex items-center gap-3 px-4 py-3 border-b-[0.5px] border-[var(--border)] sticky top-0 bg-[var(--bg)] z-10"
      >
        <Link
          href="/messages"
          className="md:hidden text-[var(--text2)] hover:text-[var(--text)]"
          aria-label="Volver"
        >
          <IconArrowLeft size={16} />
        </Link>
        <Avatar
          initials={chat.profile.initials}
          imageUrl={chat.profile.photoUrl}
          alt={`Foto de ${chat.profile.name}`}
          size="sm"
          online={chat.profile.online}
        />
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold truncate">
            {chat.profile.name}
          </div>
          <div className="text-[10px] text-[var(--text3)]">
            {chat.profile.online ? "En línea" : chat.lastSeen}
          </div>
        </div>
        <Link
          href="/feed"
          className="p-2 rounded-md hover:bg-[var(--bg2)] text-[var(--text2)]"
          aria-label="Ver perfil"
        >
          <IconUser size={14} />
        </Link>
        <button
          type="button"
          onClick={() => setReportOpen(true)}
          className="text-[11px] font-medium text-[var(--text3)] hover:text-[var(--red)] px-2 py-1 rounded-md transition-colors"
        >
          Reportar
        </button>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pt-4 flex flex-col gap-4 max-md:pb-[calc(7rem+var(--sab))] md:py-4"
      >
        {groups.map((group, gi) => (
          <div key={gi} className="flex flex-col gap-1">
            <div className="text-[10px] uppercase tracking-[0.07em] font-semibold text-[var(--text3)] text-center mb-1">
              {formatTimestamp(group[0].sentAt)}
            </div>
            {group.map((m, mi) => (
              <ChatBubble
                key={m.id}
                fromMe={m.fromMe}
                isFirstInGroup={mi === 0}
                isLastInGroup={mi === group.length - 1}
              >
                {m.text}
              </ChatBubble>
            ))}
          </div>
        ))}
      </div>

      <MessageComposer onSend={(t) => void handleSend(t)} />

      <ReportUserDrawer
        open={reportOpen}
        onOpenChange={setReportOpen}
        reportedUserId={chat.profile.id}
        reportedUserName={chat.profile.name}
        contextType="chat"
        contextId={chatId}
      />
    </div>
  )
}

function groupMessages(messages: Message[]): Message[][] {
  const groups: Message[][] = []
  let current: Message[] = []
  let lastFromMe: boolean | null = null
  let lastTime = 0

  for (const m of messages) {
    const t = new Date(m.sentAt).getTime()
    const sameAuthor = lastFromMe === m.fromMe
    const closeInTime = t - lastTime < 1000 * 60 * 5
    if (sameAuthor && closeInTime && current.length > 0) {
      current.push(m)
    } else {
      if (current.length > 0) groups.push(current)
      current = [m]
    }
    lastFromMe = m.fromMe
    lastTime = t
  }
  if (current.length > 0) groups.push(current)
  return groups
}

function formatTimestamp(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString("es-MX", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}
