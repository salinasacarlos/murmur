import * as React from "react"

import { cn } from "@/lib/utils"

interface ChatBubbleProps {
  fromMe: boolean
  children: React.ReactNode
  isFirstInGroup?: boolean
  isLastInGroup?: boolean
}

export function ChatBubble({
  fromMe,
  children,
  isFirstInGroup,
  isLastInGroup,
}: ChatBubbleProps) {
  return (
    <div className={cn("flex w-full", fromMe ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[78%] px-3.5 py-2 text-[13px] leading-[1.45] whitespace-pre-wrap",
          fromMe
            ? "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)]"
            : "bg-[var(--bg2)] text-[var(--text)] border border-[var(--border)]",
          // bubble corner shaping for grouped messages
          isFirstInGroup && isLastInGroup && "rounded-[14px]",
          isFirstInGroup && !isLastInGroup && fromMe && "rounded-[14px_14px_4px_14px]",
          !isFirstInGroup && isLastInGroup && fromMe && "rounded-[4px_14px_14px_14px]",
          !isFirstInGroup && !isLastInGroup && fromMe && "rounded-[4px_14px_4px_14px]",
          isFirstInGroup && !isLastInGroup && !fromMe && "rounded-[14px_14px_14px_4px]",
          !isFirstInGroup && isLastInGroup && !fromMe && "rounded-[14px_14px_14px_4px]",
          !isFirstInGroup && !isLastInGroup && !fromMe && "rounded-[14px_14px_14px_4px]"
        )}
      >
        {children}
      </div>
    </div>
  )
}
