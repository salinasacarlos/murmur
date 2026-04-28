"use client"

import * as React from "react"

import { EventCodeJoin } from "@/components/feed/event-code-join"
import { ProfileCard } from "@/components/feed/profile-card"
import { ProfileDetailPanel } from "@/components/feed/profile-detail-panel"
import { RadarCTA } from "@/components/feed/radar-cta"
import { SearchChipBar } from "@/components/feed/search-chip-bar"
import { FiltersDrawer } from "@/components/feed/filters-drawer"
import { IconSpark, IconX } from "@/components/icons"
import { mockProfiles, mockSearches } from "@/lib/mock-data"
import type { EventEntry, Profile } from "@/lib/types"

export default function FeedPage() {
  const [activated, setActivated] = React.useState(false)
  const [activeSearch, setActiveSearch] = React.useState<string>("all")
  const [selected, setSelected] = React.useState<Profile | null>(null)
  const [filtersOpen, setFiltersOpen] = React.useState(false)
  const [eventOpen, setEventOpen] = React.useState(false)
  const [activeEvent, setActiveEvent] = React.useState<EventEntry | null>(null)

  if (!activated) {
    return <RadarCTA onActivate={() => setActivated(true)} />
  }

  const visibleProfiles = activeEvent
    ? mockProfiles.filter((p) => p.eventCodes?.includes(activeEvent.code))
    : mockProfiles

  return (
    <div className="flex flex-col">
      <SearchChipBar
        searches={mockSearches}
        activeId={activeSearch}
        onSelect={setActiveSearch}
        onOpenFilters={() => setFiltersOpen(true)}
        onOpenEvent={() => setEventOpen(true)}
        eventActive={activeEvent !== null}
      />

      {activeEvent && (
        <div
          className="flex items-center gap-3 px-4 md:px-6 py-2.5 border-b-[0.5px] border-[var(--border)]"
          style={{
            backgroundColor: "var(--pl)",
          }}
        >
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--pm)", color: "var(--p)" }}
            aria-hidden
          >
            <IconSpark size={14} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2 text-[12px] text-[var(--text)]">
              <span
                className="font-mono uppercase tracking-[0.18em] text-[var(--p)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {activeEvent.code}
              </span>
              <span className="font-semibold truncate">{activeEvent.name}</span>
            </div>
            <p className="text-[11px] text-[var(--text2)]">
              {visibleProfiles.length}{" "}
              {visibleProfiles.length === 1
                ? "persona conectada"
                : "personas conectadas"}{" "}
              en este evento
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveEvent(null)}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-[11px] text-[var(--text2)] transition-colors hover:border-[var(--border2)] hover:text-[var(--text)]"
          >
            <IconX size={12} />
            Salir del evento
          </button>
        </div>
      )}

      <div className="px-4 md:px-6 py-5">
        {visibleProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--pm)", color: "var(--p)" }}
              aria-hidden
            >
              <IconSpark size={20} />
            </div>
            <h3 className="text-[15px] font-bold text-[var(--text)]">
              Aún no hay nadie más conectado a este evento
            </h3>
            <p className="mt-1 max-w-xs text-[12px] text-[var(--text2)]">
              Cuando alguien se una con el código{" "}
              <span
                className="font-mono uppercase tracking-[0.12em] text-[var(--text)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {activeEvent?.code}
              </span>
              , aparecerá aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {visibleProfiles.map((p) => (
              <ProfileCard
                key={p.id}
                profile={p}
                onClick={() => setSelected(p)}
              />
            ))}
          </div>
        )}
      </div>

      <ProfileDetailPanel
        profile={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />

      <FiltersDrawer open={filtersOpen} onOpenChange={setFiltersOpen} />

      <EventCodeJoin
        open={eventOpen}
        onOpenChange={setEventOpen}
        onJoin={(event) => {
          setActiveEvent(event)
          setEventOpen(false)
        }}
      />
    </div>
  )
}
