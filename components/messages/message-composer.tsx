"use client"

import * as React from "react"

import { IconSend, IconX } from "@/components/icons"
import type { MessageReplyPreview } from "@/lib/types"
import { cn } from "@/lib/utils"

interface MessageComposerProps {
  onSend: (text: string) => void
  replyTo?: MessageReplyPreview | null
  onCancelReply?: () => void
}

export function MessageComposer({
  onSend,
  replyTo,
  onCancelReply,
}: MessageComposerProps) {
  const [value, setValue] = React.useState("")
  const ref = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (replyTo) ref.current?.focus()
  }, [replyTo])

  function send() {
    const text = value.trim()
    if (!text) return
    onSend(text)
    setValue("")
    if (ref.current) ref.current.style.height = "auto"
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
    if (e.key === "Escape" && replyTo) {
      e.preventDefault()
      onCancelReply?.()
    }
  }

  function autoResize(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`
  }

  return (
    <div
      className={cn(
        "shrink-0 border-t-[0.5px] border-[var(--border)] bg-[var(--bg)] touch-manipulation",
        "max-md:fixed max-md:left-0 max-md:right-0 max-md:z-40 max-md:bottom-[calc(var(--mobile-nav-h)+var(--sab))]",
        "md:relative md:z-10 md:left-auto md:right-auto md:bottom-auto"
      )}
      style={{ paddingBottom: "calc(12px + var(--sab))" }}
    >
      {replyTo ? (
        <div className="flex items-start gap-2 border-b border-[var(--border)] bg-[var(--bg2)]/80 px-3 py-2">
          <div
            className="min-w-0 flex-1 border-l-2 border-[var(--p)] pl-2"
            aria-live="polite"
          >
            <p className="text-[11px] font-semibold text-[var(--p)]">
              Respondiendo a {replyTo.authorLabel}
            </p>
            <p className="text-[12px] text-[var(--text2)] line-clamp-2 break-words [overflow-wrap:anywhere]">
              {replyTo.text}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancelReply}
            className="shrink-0 rounded-md p-1 text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--bg2)]"
            aria-label="Cancelar respuesta"
          >
            <IconX size={14} />
          </button>
        </div>
      ) : null}

      <div className="flex items-end gap-2 px-3 py-3">
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={autoResize}
          onKeyDown={onKeyDown}
          placeholder={replyTo ? "Escribe tu respuesta…" : "Escribe un mensaje..."}
          enterKeyHint="send"
          autoComplete="off"
          autoCorrect="on"
          className={cn(
            "ds-input flex-1 min-h-[44px] max-h-[140px] resize-none py-2.5 text-[16px] leading-snug md:min-h-[38px] md:py-2 md:text-[13px] md:leading-normal"
          )}
        />
        <button
          type="button"
          onClick={send}
          disabled={!value.trim()}
          className={cn(
            "p-2 rounded-lg transition-colors flex-shrink-0",
            value.trim()
              ? "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] hover:opacity-85"
              : "bg-[var(--bg2)] text-[var(--text3)] cursor-not-allowed"
          )}
          aria-label="Enviar"
        >
          <IconSend size={16} />
        </button>
      </div>
    </div>
  )
}
