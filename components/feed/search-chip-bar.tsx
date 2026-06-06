"use client"

import * as React from "react"
import Link from "next/link"

import { IconPlus, IconFilter, IconMapPin, IconHeart } from "@/components/icons"
import { MSG_FREE_SEARCH_LIMIT } from "@/lib/plan-limits"
import { cn } from "@/lib/utils"
import type { Search } from "@/lib/types"

interface SearchChipBarProps {
  searches: Search[]
  activeId: string
  onSelect: (id: string) => void
  onOpenFilters?: () => void
  onOpenEvent?: () => void
  eventActive?: boolean
  /** Free: false cuando ya hay una búsqueda activa (no abrir /searches/new). */
  canAddSearch?: boolean
  addSearchBlockedTitle?: string
  recommendedOnly?: boolean
  recommendedCount?: number
  onToggleRecommendedOnly?: () => void
}

export function SearchChipBar({
  searches,
  activeId,
  onSelect,
  onOpenFilters,
  onOpenEvent,
  eventActive,
  canAddSearch = true,
  addSearchBlockedTitle = MSG_FREE_SEARCH_LIMIT,
  recommendedOnly = false,
  recommendedCount,
  onToggleRecommendedOnly,
}: SearchChipBarProps) {
  return (
    <div className="flex items-center gap-2 px-4 md:px-6 py-3 border-b-[0.5px] border-[var(--border)] bg-[var(--bg)]">
      <div className="flex items-center gap-1.5 overflow-x-auto flex-1 [&::-webkit-scrollbar]:hidden">
        <Chip
          label="Todas"
          active={activeId === "all" && !recommendedOnly}
          onClick={() => {
            if (recommendedOnly) onToggleRecommendedOnly?.()
            onSelect("all")
          }}
        />
        {onToggleRecommendedOnly ? (
          <Chip
            label="Recomendados"
            icon={<IconHeart size={11} />}
            count={recommendedCount}
            active={recommendedOnly}
            onClick={onToggleRecommendedOnly}
          />
        ) : null}
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
        {canAddSearch ? (
          <Link
            href="/searches/new"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-dashed border-[var(--border2)] text-[var(--text2)] hover:text-[var(--p)] hover:border-[var(--p)] text-[12px] whitespace-nowrap transition-colors"
          >
            <IconPlus size={12} />
            Nueva
          </Link>
        ) : (
          <span
            role="button"
            tabIndex={-1}
            aria-disabled="true"
            title={addSearchBlockedTitle}
            className="inline-flex cursor-not-allowed items-center gap-1 px-2.5 py-1 rounded-full border border-dashed border-[var(--border)] text-[var(--text3)] text-[12px] whitespace-nowrap opacity-70"
          >
            <IconPlus size={12} />
            Nueva
          </span>
        )}
      </div>

      {onOpenEvent && (
        <button
          type="button"
          onClick={onOpenEvent}
          aria-pressed={eventActive ? "true" : "false"}
          aria-label={
            eventActive ? "Evento activo. Abrir opciones de evento" : "Unirme o crear evento en vivo"
          }
          className={cn(
            "ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] transition-colors border",
            eventActive
              ? "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] border-[var(--primary-solid)] font-semibold"
              : "border-[var(--border)] text-[var(--text2)] hover:border-[var(--border2)] hover:text-[var(--text)]"
          )}
        >
          <IconMapPin size={12} aria-hidden />
          <span className="hidden sm:inline">
            {eventActive ? "En evento" : "Evento"}
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
  icon,
}: {
  label: string
  count?: number
  active: boolean
  onClick: () => void
  icon?: React.ReactNode
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
      {icon}
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
