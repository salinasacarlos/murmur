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
    <div className="flex min-h-0 w-full flex-1 flex-col md:flex-row">
      <ChatList
        className={
          hasActiveChat
            ? "hidden md:flex md:h-auto md:w-[280px] md:flex-shrink-0"
            : "flex h-full min-h-0 w-full md:h-auto md:w-[280px] md:flex-shrink-0"
        }
      />
      <div
        className={
          hasActiveChat
            ? "flex min-h-0 flex-1 flex-col min-w-0"
            : "hidden md:flex md:min-h-0 md:flex-1 md:flex-col md:min-w-0"
        }
      >
        {children}
      </div>
    </div>
  )
}
