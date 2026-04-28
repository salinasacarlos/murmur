"use client"

import * as React from "react"
import Link from "next/link"

import { IconPlus, IconFilter, IconSpark } from "@/components/icons"
import { cn } from "@/lib/utils"
import type { Search } from "@/lib/types"

interface SearchChipBarProps {
  searches: Search[]
  activeId: string
  onSelect: (id: string) => void
  onOpenFilters?: () => void
  onOpenEvent?: () => void
  eventActive?: boolean
}

export function SearchChipBar({
  searches,
  activeId,
  onSelect,
  onOpenFilters,
  onOpenEvent,
  eventActive,
}: SearchChipBarProps) {
  return (
    <div className="flex items-center gap-2 px-4 md:px-6 py-3 border-b-[0.5px] border-[var(--border)] bg-[var(--bg)] sticky top-[calc(var(--topbar-h)+var(--sat))] z-20 md:top-[calc(var(--topbar-h)+var(--sat))]">
      <div className="flex items-center gap-1.5 overflow-x-auto flex-1 [&::-webkit-scrollbar]:hidden">
        <Chip
          label="Todas"
          active={activeId === "all"}
          onClick={() => onSelect("all")}
        />
        {searches
          .filter((s) => s.status === "active")
          .map((s) => (
            <Chip
              key={s.id}
              label={s.title}
              count={s.matchesCount}
              active={activeId === s.id}
              onClick={() => onSelect(s.id)}
            />
          ))}
        <Link
          href="/searches/new"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-dashed border-[var(--border2)] text-[var(--text2)] hover:text-[var(--p)] hover:border-[var(--p)] text-[12px] whitespace-nowrap transition-colors"
        >
          <IconPlus size={12} />
          Nueva
        </Link>
      </div>

      {onOpenEvent && (
        <button
          type="button"
          onClick={onOpenEvent}
          aria-pressed={eventActive ? "true" : "false"}
          className={cn(
            "ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] transition-colors border",
            eventActive
              ? "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] border-[var(--primary-solid)] font-semibold"
              : "border-[var(--border)] text-[var(--text2)] hover:border-[var(--border2)] hover:text-[var(--text)]"
          )}
        >
          <IconSpark size={12} />
          <span className="hidden sm:inline">
            {eventActive ? "Evento" : "Estoy en un evento"}
          </span>
        </button>
      )}

      {onOpenFilters && (
        <button
          type="button"
          onClick={onOpenFilters}
          className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[var(--border)] text-[12px] text-[var(--text2)] hover:border-[var(--border2)] hover:text-[var(--text)]"
        >
          <IconFilter size={12} />
          <span className="hidden sm:inline">Filtros</span>
        </button>
      )}
    </div>
  )
}

function Chip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count?: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] whitespace-nowrap transition-colors border",
        active
          ? "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] border-[var(--primary-solid)] font-semibold"
          : "bg-[var(--bg)] text-[var(--text2)] border-[var(--border)] hover:border-[var(--border2)] hover:text-[var(--text)]"
      )}
    >
      {label}
      {typeof count === "number" && (
        <span
          className={cn(
            "text-[10px] font-bold rounded-full px-1.5",
            active
              ? "bg-white/20 text-[var(--primary-solid-foreground)]"
              : "bg-[var(--bg2)] text-[var(--text3)]"
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}
