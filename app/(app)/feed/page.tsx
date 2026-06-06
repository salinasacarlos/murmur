"use client"

import * as React from "react"
import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { EventCodeJoin } from "@/components/feed/event-code-join"
import { ProfileCard } from "@/components/feed/profile-card"
import { ProfileDetailPanel } from "@/components/feed/profile-detail-panel"
import { RadarCTA } from "@/components/feed/radar-cta"
import { DiscoverProfileSearch } from "@/components/feed/discover-profile-search"
import { SearchChipBar } from "@/components/feed/search-chip-bar"
import { FiltersDrawer } from "@/components/feed/filters-drawer"
import { IconSpark, IconX } from "@/components/icons"
import { useCurrentUser } from "@/components/providers/current-user-provider"
import { useDiscoverFeed } from "@/components/providers/discover-feed-provider"
import { fetchPeerConnectionHints, type PeerConnectionHint } from "@/lib/data/connections"
import { profileMatchesDiscoverFilters, profileMatchesDiscoverQuery } from "@/lib/feed-filters"
import { isPremiumPlan } from "@/lib/plan-limits"
import { resolveHeroIndustrySlug } from "@/lib/profile-taxonomy"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
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
  const { user, profile } = useCurrentUser()
  const userId = user?.id ?? null

  const [peerHints, setPeerHints] = React.useState<
    Map<string, PeerConnectionHint>
  >(() => new Map())

  const loadPeerHints = React.useCallback(async () => {
    if (!userId) return
    const supabase = getSupabaseBrowserClient()
    const hints = await fetchPeerConnectionHints(supabase, userId)
    setPeerHints(hints)
  }, [userId])

  React.useEffect(() => {
    void loadPeerHints()
  }, [loadPeerHints])

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

  const activeSearchSlots = searches.filter((s) => s.status === "active").length
  const canAddSearch =
    isPremiumPlan(profile?.plan) || activeSearchSlots === 0
  const [filtersOpen, setFiltersOpen] = React.useState(false)
  const [eventOpen, setEventOpen] = React.useState(false)
  const [profileQuery, setProfileQuery] = React.useState("")

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
    if (profileQuery.trim()) {
      list = list.filter((p) => profileMatchesDiscoverQuery(p, profileQuery))
    }
    return list
  }, [profiles, discoverFilters, activeSearch, searches, profileQuery])

  const hasProfileQuery = profileQuery.trim().length > 0

  if (!activated) {
    return <RadarCTA onActivate={activateFeed} />
  }

  return (
    <div className="flex flex-col">
      {/*
        Un solo bloque sticky: chips + franja de evento. Así la franja no queda
        tapada por los chips al hacer scroll (antes solo los chips eran sticky).
      */}
      <div
        className={cn(
          "sticky z-20 bg-[var(--bg)] shadow-[0_1px_0_var(--border)]",
          "top-[calc(3.5rem+var(--sat))] md:top-[calc(var(--topbar-h)+var(--sat))]"
        )}
      >
        <SearchChipBar
          searches={searches}
          activeId={activeSearch}
          onSelect={setActiveSearch}
          onOpenFilters={() => setFiltersOpen(true)}
          onOpenEvent={() => setEventOpen(true)}
          eventActive={activeEvent !== null}
          canAddSearch={canAddSearch}
        />

        <DiscoverProfileSearch
          value={profileQuery}
          onChange={setProfileQuery}
        />

        {activeEvent ? (
          <div
            className="flex items-start gap-3 px-4 md:px-6 py-3 border-t-[0.5px] border-b-[0.5px] border-[var(--border)]"
            style={{
              backgroundColor: "var(--pl)",
            }}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--pm)", color: "var(--p)" }}
              aria-hidden
            >
              <IconSpark size={15} />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[13px] text-[var(--text)]">
                <span
                  className="font-mono text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--p)] sm:text-[13px]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {activeEvent.code}
                </span>
                <span className="font-semibold leading-snug">{activeEvent.name}</span>
              </div>
              <p className="text-[12px] leading-snug text-[var(--text2)]">
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
              className="inline-flex shrink-0 items-center gap-1 self-center rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--text2)] transition-colors hover:border-[var(--border2)] hover:text-[var(--text)]"
            >
              <IconX size={12} aria-hidden />
              <span className="hidden min-[420px]:inline">Salir del evento</span>
              <span className="min-[420px]:hidden">Salir</span>
            </button>
          </div>
        ) : null}
      </div>

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
              {hasProfileQuery
                ? "Nadie coincide con tu búsqueda"
                : activeEvent
                  ? "Aún no hay nadie más conectado a este evento"
                  : "Nadie coincide con lo que pediste"}
            </h3>
            <p className="mt-1 max-w-xs text-[12px] text-[var(--text2)]">
              {hasProfileQuery ? (
                <>
                  Prueba otro nombre, rol o ciudad, o{" "}
                  <button
                    type="button"
                    onClick={() => setProfileQuery("")}
                    className="font-semibold text-[var(--p)] hover:underline underline-offset-2"
                  >
                    limpia la búsqueda
                  </button>
                  .
                </>
              ) : activeEvent ? (
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
                connectionHint={peerHints.get(p.id) ?? { state: "none" }}
                onClick={() => setSelected(p)}
              />
            ))}
          </div>
        )}
      </div>

      <ProfileDetailPanel
        profile={selected}
        open={selected !== null}
        connectionHint={
          selected
            ? (peerHints.get(selected.id) ?? { state: "none" })
            : { state: "none" }
        }
        onConnectionsChanged={() => void loadPeerHints()}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />

      <FiltersDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={discoverFilters}
        onFiltersChange={setDiscoverFilters}
        isPremium={profile?.plan === "premium"}
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
