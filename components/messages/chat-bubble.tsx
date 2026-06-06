import * as React from "react"

import type { MessageReplyPreview } from "@/lib/types"
import { IconReply } from "@/components/icons"
import { cn } from "@/lib/utils"

interface ChatBubbleProps {
  fromMe: boolean
  children: React.ReactNode
  isFirstInGroup?: boolean
  isLastInGroup?: boolean
  time?: string
  replyTo?: MessageReplyPreview | null
  onReply?: () => void
}

export function ChatBubble({
  fromMe,
  children,
  isFirstInGroup,
  isLastInGroup,
  time,
  replyTo,
  onReply,
}: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "group/bubble flex w-full items-end gap-1",
        fromMe ? "justify-end" : "justify-start"
      )}
    >
      {fromMe && onReply ? (
        <button
          type="button"
          onClick={onReply}
          aria-label="Responder"
          className={cn(
            "mb-0.5 shrink-0 rounded-full p-1.5 transition-opacity",
            "text-[var(--text3)] hover:text-[var(--p)] hover:bg-[var(--bg2)]",
            "opacity-70 sm:opacity-0 sm:group-hover/bubble:opacity-100 sm:focus-visible:opacity-100"
          )}
        >
          <IconReply size={14} />
        </button>
      ) : null}
      <div
        className={cn(
          "max-w-[min(78%,20rem)] px-3.5 py-2 text-[13px] leading-[1.45] whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
          fromMe
            ? "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)]"
            : "bg-[var(--bg2)] text-[var(--text)] border border-[var(--border)]",
          isFirstInGroup && isLastInGroup && "rounded-[14px]",
          isFirstInGroup && !isLastInGroup && fromMe && "rounded-[14px_14px_4px_14px]",
          !isFirstInGroup && isLastInGroup && fromMe && "rounded-[4px_14px_14px_14px]",
          !isFirstInGroup && !isLastInGroup && fromMe && "rounded-[4px_14px_4px_14px]",
          isFirstInGroup && !isLastInGroup && !fromMe && "rounded-[14px_14px_14px_4px]",
          !isFirstInGroup && isLastInGroup && !fromMe && "rounded-[14px_4px_14px_14px]",
          !isFirstInGroup && !isLastInGroup && !fromMe && "rounded-[14px_4px_14px_4px]"
        )}
      >
        {replyTo ? (
          <div
            className={cn(
              "mb-2 rounded-md border-l-2 pl-2 pr-1 py-1 text-[11px] leading-snug",
              fromMe
                ? "border-white/70 bg-white/10 text-[var(--primary-solid-foreground)]/90"
                : "border-[var(--p)] bg-[var(--pl)]/60 text-[var(--text2)]"
            )}
          >
            <p
              className={cn(
                "font-semibold mb-0.5",
                fromMe ? "text-white" : "text-[var(--p)]"
              )}
            >
              {replyTo.authorLabel}
            </p>
            <p className="line-clamp-2 opacity-90">{replyTo.text}</p>
          </div>
        ) : null}
        {children}
        {time && isLastInGroup ? (
          <p
            className={cn(
              "mt-1 text-[10px] leading-none text-right tabular-nums",
              fromMe ? "text-white/75" : "text-[var(--text3)]"
            )}
          >
            {time}
          </p>
        ) : null}
      </div>
      {!fromMe && onReply ? (
        <button
          type="button"
          onClick={onReply}
          aria-label="Responder"
          className={cn(
            "mb-0.5 shrink-0 rounded-full p-1.5 transition-opacity",
            "text-[var(--text3)] hover:text-[var(--p)] hover:bg-[var(--bg2)]",
            "opacity-70 sm:opacity-0 sm:group-hover/bubble:opacity-100 sm:focus-visible:opacity-100"
          )}
        >
          <IconReply size={14} />
        </button>
      ) : null}
    </div>
  )
}
