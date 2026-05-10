"use client"

import * as React from "react"
import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { EventCodeJoin } from "@/components/feed/event-code-join"
import { ProfileCard } from "@/components/feed/profile-card"
import { ProfileDetailPanel } from "@/components/feed/profile-detail-panel"
import { RadarCTA } from "@/components/feed/radar-cta"
import { SearchChipBar } from "@/components/feed/search-chip-bar"
import { FiltersDrawer } from "@/components/feed/filters-drawer"
import { IconSpark, IconX } from "@/components/icons"
import { useDiscoverFeed } from "@/components/providers/discover-feed-provider"
import { profileMatchesDiscoverFilters } from "@/lib/feed-filters"
import { resolveHeroIndustrySlug } from "@/lib/profile-taxonomy"
import type { Profile, Search } from "@/lib/types"

/** Alinea tarjeta de búsqueda activa con criterios del perfil. */
function profileMatchesSearchChip(p: Profile, s: Search): boolean {
  if (s.primaryIndustrySlug) {
    const hero = resolveHeroIndustrySlug({
      primaryIndustrySlug: p.primaryIndustrySlug,
      expertiseSlugs: p.expertiseSlugs,
      functionalAreaTags: p.functionalAreaTags,
      area: p.area,
    })
    if (hero !== s.primaryIndustrySlug) return false
  }
  if (s.expertiseSlugs?.length) {
    const pe = new Set(
      p.expertiseSlugs?.length ? p.expertiseSlugs : p.functionalAreaTags ?? []
    )
    if (!s.expertiseSlugs.some((x) => pe.has(x))) return false
  }
  if (s.talentSlugs?.length) {
    const pt = new Set(p.talentSlugs ?? [])
    if (!s.talentSlugs.some((x) => pt.has(x))) return false
  }
  if (s.relations?.length) {
    if (!s.relations.some((r) => p.relationsLooking.includes(r))) return false
  }
  return true
}

function FeedPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    activated,
    activateFeed,
    activeSearch,
    setActiveSearch,
    selected,
    setSelected,
    discoverFilters,
    setDiscoverFilters,
    activeEvent,
    setActiveEvent,
    profiles,
    searches,
    feedLoading,
  } = useDiscoverFeed()

  const [filtersOpen, setFiltersOpen] = React.useState(false)
  const [eventOpen, setEventOpen] = React.useState(false)

  React.useEffect(() => {
    const spotlight = searchParams.get("spotlight")
    if (!spotlight || feedLoading) return

    const match = profiles.find((p) => p.id === spotlight)
    if (match) setSelected(match)
    router.replace("/feed")
  }, [searchParams, profiles, feedLoading, setSelected, router])

  const visibleProfiles = React.useMemo(() => {
    let list = profiles.filter((p) =>
      profileMatchesDiscoverFilters(p, discoverFilters)
    )
    if (activeSearch !== "all") {
      const s = searches.find((x) => x.id === activeSearch)
      if (!s) return list
      list = list.filter((p) => profileMatchesSearchChip(p, s))
    }
    return list
  }, [profiles, discoverFilters, activeSearch, searches])

  if (!activated) {
    return <RadarCTA onActivate={activateFeed} />
  }

  return (
    <div className="flex flex-col">
      <SearchChipBar
        searches={searches}
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
        {feedLoading && visibleProfiles.length === 0 ? (
          <p className="text-center text-[12px] text-[var(--text2)] py-16">
            Cargando perfiles…
          </p>
        ) : visibleProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--pm)", color: "var(--p)" }}
              aria-hidden
            >
              <IconSpark size={20} />
            </div>
            <h3 className="text-[15px] font-bold text-[var(--text)]">
              {activeEvent
                ? "Aún no hay nadie más conectado a este evento"
                : "Nadie coincide con lo que pediste"}
            </h3>
            <p className="mt-1 max-w-xs text-[12px] text-[var(--text2)]">
              {activeEvent ? (
                <>
                  Cuando alguien se una con el código{" "}
                  <span
                    className="font-mono uppercase tracking-[0.12em] text-[var(--text)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {activeEvent.code}
                  </span>
                  , aparecerá aquí.
                </>
              ) : (
                <>
                  Prueba otros filtros, otra búsqueda activa, o vuelve en un rato
                  al radar.
                </>
              )}
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

      <FiltersDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={discoverFilters}
        onFiltersChange={setDiscoverFilters}
      />

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

export default function FeedPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 md:px-6 py-16 text-center text-[12px] text-[var(--text2)]">
          Cargando…
        </div>
      }
    >
      <FeedPageContent />
    </Suspense>
  )
}
