"use client"

import * as React from "react"
import Link from "next/link"

import { Avatar } from "@/components/ui/avatar"
import { ProfileDetailPanel } from "@/components/feed/profile-detail-panel"
import { ChatBubble } from "@/components/messages/chat-bubble"
import { MessageComposer } from "@/components/messages/message-composer"
import { ReportUserDrawer } from "@/components/report/report-user-drawer"
import { IconArrowLeft, IconUser } from "@/components/icons"
import {
  attachReplyPreview,
  buildReplyPreview,
} from "@/lib/chat-replies"
import {
  formatChatMessageTime,
  layoutChatMessages,
} from "@/lib/chat-message-layout"
import {
  fetchPeerConnectionHints,
  type PeerConnectionHint,
} from "@/lib/data/connections"
import { fetchMyRecommendationsForProfiles } from "@/lib/data/recommendations"
import { sendChatMessage } from "@/lib/data/chats"
import { useChatMessagesRealtime } from "@/hooks/use-chat-messages-realtime"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { ProfileRecommendationVote } from "@/lib/recommendation-types"
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
  const [replyTarget, setReplyTarget] = React.useState<Message | null>(null)
  const [reportOpen, setReportOpen] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)
  const [connectionHint, setConnectionHint] =
    React.useState<PeerConnectionHint>({ state: "none" })
  const [myRecommendationVote, setMyRecommendationVote] =
    React.useState<ProfileRecommendationVote | null>(null)

  const peerName = initialChat.profile.name

  React.useEffect(() => {
    if (!currentUserId) return
    const supabase = getSupabaseBrowserClient()
    const peerId = initialChat.profile.id
    void fetchPeerConnectionHints(supabase, currentUserId).then((hints) => {
      setConnectionHint(
        hints.get(peerId) ?? {
          state: "connected",
          connectionId: "",
          chatId,
        }
      )
    })
    void fetchMyRecommendationsForProfiles(supabase, [peerId]).then((map) => {
      setMyRecommendationVote(map.get(peerId) ?? null)
    })
  }, [currentUserId, initialChat.profile.id, chatId])

  const appendIfNew = React.useCallback(
    (msg: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    },
    []
  )

  useChatMessagesRealtime(chatId, currentUserId, (msg) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev
      let enriched = msg
      if (msg.replyToMessageId) {
        const quoted = prev.find((m) => m.id === msg.replyToMessageId)
        enriched = quoted
          ? attachReplyPreview(msg, quoted, peerName)
          : {
              ...msg,
              replyTo: {
                id: msg.replyToMessageId,
                fromMe: false,
                authorLabel: "Mensaje",
                text: "…",
              },
            }
      }
      return [...prev, enriched]
    })
  })

  const scrollRef = React.useRef<HTMLDivElement>(null)
  React.useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages.length, replyTarget?.id])

  async function handleSend(text: string) {
    const supabase = getSupabaseBrowserClient()
    const res = await sendChatMessage(supabase, {
      chatId,
      senderId: currentUserId,
      body: text,
      replyToMessageId: replyTarget?.id ?? null,
    })
    if (!res.ok) {
      console.error(res.error)
      return
    }
    appendIfNew(
      attachReplyPreview(res.message, replyTarget, peerName)
    )
    setReplyTarget(null)
  }

  const chat = initialChat
  const daySections = layoutChatMessages(messages)

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--bg)]">
      <header className="flex items-center gap-3 px-4 py-3 border-b-[0.5px] border-[var(--border)] sticky top-0 bg-[var(--bg)] z-10">
        <Link
          href="/messages"
          className="md:hidden text-[var(--text2)] hover:text-[var(--text)]"
          aria-label="Volver"
        >
          <IconArrowLeft size={16} />
        </Link>
        <button
          type="button"
          onClick={() => setProfileOpen(true)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left rounded-md hover:bg-[var(--bg2)]/80 -my-1 py-1 pr-2 transition-colors"
          aria-label={`Ver perfil de ${chat.profile.name}`}
        >
          <Avatar
            initials={chat.profile.initials}
            imageUrl={chat.profile.photoUrl}
            alt={`Foto de ${chat.profile.name}`}
            size="sm"
            online={chat.profile.online}
          />
          <div className="min-w-0 flex-1">
            <div className="person-name-compact">{chat.profile.name}</div>
            <div className="card-meta mt-0.5">
              {chat.profile.online ? "En línea" : chat.lastSeen}
            </div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setProfileOpen(true)}
          className="p-2 rounded-md hover:bg-[var(--bg2)] text-[var(--text2)]"
          aria-label="Ver perfil"
        >
          <IconUser size={14} />
        </button>
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
        className="flex-1 overflow-y-auto px-4 pt-4 flex flex-col gap-3 max-md:pb-[calc(7rem+var(--sab))] md:py-4"
      >
        {daySections.map((section) => (
          <div key={section.dayKey} className="flex flex-col gap-2">
            <div className="sticky top-0 z-[1] flex justify-center py-1">
              <span className="rounded-full bg-[var(--bg2)] border border-[var(--border)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--text3)]">
                {section.label}
              </span>
            </div>
            {section.groups.map((group, gi) => (
              <div key={`${section.dayKey}-${gi}`} className="flex flex-col gap-0.5">
                {group.map((m, mi) => (
                  <ChatBubble
                    key={m.id}
                    fromMe={m.fromMe}
                    isFirstInGroup={mi === 0}
                    isLastInGroup={mi === group.length - 1}
                    time={formatChatMessageTime(m.sentAt)}
                    replyTo={m.replyTo}
                    onReply={() => setReplyTarget(m)}
                  >
                    {m.text}
                  </ChatBubble>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <MessageComposer
        onSend={(t) => void handleSend(t)}
        replyTo={
          replyTarget
            ? buildReplyPreview(replyTarget, peerName)
            : null
        }
        onCancelReply={() => setReplyTarget(null)}
      />

      <ReportUserDrawer
        open={reportOpen}
        onOpenChange={setReportOpen}
        reportedUserId={chat.profile.id}
        reportedUserName={chat.profile.name}
        contextType="chat"
        contextId={chatId}
      />

      <ProfileDetailPanel
        profile={chat.profile}
        open={profileOpen}
        onOpenChange={setProfileOpen}
        connectionHint={connectionHint}
        myRecommendationVote={myRecommendationVote}
        onRecommendationChange={(vote) => {
          setMyRecommendationVote(vote)
        }}
      />
    </div>
  )
}
