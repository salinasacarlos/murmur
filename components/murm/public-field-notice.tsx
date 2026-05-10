import * as React from "react"

import { cn } from "@/lib/utils"

export interface PublicFieldNoticeProps {
  className?: string
  /** Texto más corto en layouts densos */
  compact?: boolean
}

/**
 * Aviso para campos que formarán parte del perfil visible cuando el usuario decida mostrarse.
 */
export function PublicFieldNotice({
  className,
  compact = false,
}: PublicFieldNoticeProps) {
  return (
    <p
      className={cn(
        "text-[11px] leading-snug text-[var(--text3)]",
        className
      )}
      role="note"
    >
      {compact
        ? "Visible para otras personas cuando decidas mostrarte."
        : "Así lo verán otras personas en Murmur cuando decidas mostrarte (no compartimos tu ubicación exacta ni mensajes fuera de conexión aceptada)."}
    </p>
  )
}
