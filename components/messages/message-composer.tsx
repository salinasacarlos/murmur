"use client"

import * as React from "react"

import { IconSend } from "@/components/icons"
import { cn } from "@/lib/utils"

interface MessageComposerProps {
  onSend: (text: string) => void
}

export function MessageComposer({ onSend }: MessageComposerProps) {
  const [value, setValue] = React.useState("")
  const ref = React.useRef<HTMLTextAreaElement>(null)

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
  }

  function autoResize(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`
  }

  return (
    <div
      className={cn(
        "shrink-0 border-t-[0.5px] border-[var(--border)] bg-[var(--bg)] px-3 py-3 flex items-end gap-2 touch-manipulation",
        /* Móvil: fijo respecto al viewport, inmediatamente encima del bottom nav (z-50). */
        "max-md:fixed max-md:left-0 max-md:right-0 max-md:z-40 max-md:bottom-[calc(var(--mobile-nav-h)+var(--sab))]",
        "md:relative md:z-10 md:left-auto md:right-auto md:bottom-auto"
      )}
      style={{ paddingBottom: "calc(12px + var(--sab))" }}
    >
      <textarea
        ref={ref}
        rows={1}
        value={value}
        onChange={autoResize}
        onKeyDown={onKeyDown}
        placeholder="Escribe un mensaje..."
        enterKeyHint="send"
        autoComplete="off"
        autoCorrect="on"
        className={cn(
          /* ≥16px en móvil evita zoom automático de iOS/Safari al enfocar (rompe foco/teclado). */
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
  )
}
