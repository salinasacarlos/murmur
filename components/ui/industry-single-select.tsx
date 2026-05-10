"use client"

import * as React from "react"

import { INDUSTRIES } from "@/lib/profile-taxonomy"
import { cn } from "@/lib/utils"

interface IndustrySingleSelectProps {
  value: string | null
  onChange: (slug: string | null) => void
  /** Si es true, muestra «Cualquiera» para volver a null (p. ej. filtros). */
  allowClear?: boolean
  className?: string
}

export function IndustrySingleSelect({
  value,
  onChange,
  allowClear = false,
  className,
}: IndustrySingleSelectProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap gap-1.5">
        {allowClear ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            className={cn(
              "px-2.5 py-1 rounded-full text-[12px] border transition-colors text-left max-w-full",
              value == null
                ? "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] border-[var(--primary-solid)] font-medium"
                : "bg-[var(--bg)] text-[var(--text2)] border-[var(--border)] hover:border-[var(--border2)] hover:text-[var(--text)]"
            )}
          >
            Cualquiera
          </button>
        ) : null}
        {INDUSTRIES.map((ind) => {
          const selected = value === ind.slug
          return (
            <button
              key={ind.slug}
              type="button"
              onClick={() => onChange(ind.slug)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[12px] border transition-colors text-left max-w-full",
                selected
                  ? "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] border-[var(--primary-solid)] font-medium"
                  : "bg-[var(--bg)] text-[var(--text2)] border-[var(--border)] hover:border-[var(--border2)] hover:text-[var(--text)]"
              )}
            >
              {ind.label}
            </button>
          )
        })}
      </div>
      <p className="text-[11px] text-[var(--text3)]">
        Elige <strong>una</strong> industria; después marca hasta 5 verticales dentro de ella.
      </p>
    </div>
  )
}
