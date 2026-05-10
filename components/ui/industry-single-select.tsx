"use client"

import * as React from "react"

import { INDUSTRIES } from "@/lib/profile-taxonomy"
import { cn } from "@/lib/utils"

interface IndustrySingleSelectProps {
  value: string | null
  onChange: (slug: string) => void
  className?: string
}

export function IndustrySingleSelect({
  value,
  onChange,
  className,
}: IndustrySingleSelectProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap gap-1.5">
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
        Elige <strong>una</strong> industria; después podrás marcar hasta 5 áreas de expertise
        dentro de ella.
      </p>
    </div>
  )
}
