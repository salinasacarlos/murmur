"use client"

import * as React from "react"
import { useSelectedLayoutSegment } from "next/navigation"

import { ChatList } from "@/components/messages/chat-list"

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const segment = useSelectedLayoutSegment()
  const hasActiveChat = !!segment

  return (
    <div className="flex h-[calc(100svh-var(--sat))] md:h-[calc(100svh-var(--topbar-h)-var(--sat))]">
      <ChatList
        className={
          hasActiveChat
            ? "hidden md:flex md:w-[280px] md:flex-shrink-0"
            : "flex w-full md:w-[280px] md:flex-shrink-0"
        }
      />
      <div
        className={
          hasActiveChat
            ? "flex-1 flex flex-col min-w-0"
            : "hidden md:flex md:flex-1 md:flex-col md:min-w-0"
        }
      >
        {children}
      </div>
    </div>
  )
}
