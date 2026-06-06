"use client"

import * as React from "react"
import { Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { EventCodeJoin } from "@/components/feed/event-code-join"
import { ProfileCard } from "@/components/feed/profile-card"
import { ProfileDetailPanel } from "@/components/feed/profile-detail-panel"
import { RadarCTA } from "@/components/feed/radar-cta"
import { DiscoverProfileSearch } from "@/components/feed/discover-profile-search"
import { SearchChipBar } from "@/components/feed/search-chip-bar"
import { FiltersDrawer } from "@/components/feed/filters-drawer"
import { FirstActionsCard } from "@/components/onboarding/first-actions-card"
import { IconSpark, IconX } from "@/components/icons"
import { useCurrentUser } from "@/components/providers/current-user-provider"
import { useDiscoverFeed } from "@/components/providers/discover-feed-provider"
import { useFirstActions } from "@/hooks/use-first-actions"
import { fetchPeerConnectionHints, type PeerConnectionHint } from "@/lib/data/connections"
import { profileMatchesDiscoverFilters, profileMatchesDiscoverQuery } from "@/lib/feed-filters"
import {
  countProfilesMatchingSearch,
  MATCH_TIER_MEDIA,
  rankProfilesForDiscover,
} from "@/lib/match-score"
import { isPremiumPlan } from "@/lib/plan-limits"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import type { FirstActionsProgress } from "@/lib/first-actions"

function discoverEmptyCopy(args: {
  hasProfileQuery: boolean
  activeEvent: boolean
  progress: FirstActionsProgress
  hasActiveSearches: boolean
}): { title: string; body: string; showSearchCta: boolean; showVisibilityCta: boolean } {
  const { hasProfileQuery, activeEvent, progress, hasActiveSearches } = args

  if (hasProfileQuery) {
    return {
      title: "Nadie coincide con tu búsqueda",
      body: "Prueba otro nombre, rol o ciudad, o limpia la búsqueda de texto.",
      showSearchCta: false,
      showVisibilityCta: false,
    }
  }

  if (activeEvent) {
    return {
      title: "Aún no hay nadie más conectado a este evento",
      body: "Cuando alguien se una con el código del evento, aparecerá aquí.",
      showSearchCta: false,
      showVisibilityCta: false,
    }
  }

  if (!progress.visibility && !hasActiveSearches) {
    return {
      title: "Empieza con visibilidad y una búsqueda",
      body: "Activa visibilidad para que te vean, crea una búsqueda para el match score y explora perfiles visibles en la red.",
      showSearchCta: true,
      showVisibilityCta: true,
    }
  }

  if (!progress.visibility) {
    return {
      title: "Estás oculto — otros no te ven aún",
      body: "Puedes explorar perfiles, pero nadie podrá encontrarte ni conectarse contigo hasta que actives visibilidad.",
      showSearchCta: false,
      showVisibilityCta: true,
    }
  }

  if (!hasActiveSearches) {
    return {
      title: "Crea una búsqueda para ver compatibilidad",
      body: "Sin búsqueda activa ves todos los perfiles, pero sin badges de match. Define a quién buscas para rankear mejor.",
      showSearchCta: true,
      showVisibilityCta: false,
    }
  }

  return {
    title: "Aún no hay perfiles en Descubrir",
    body: "Vuelve más tarde o amplía filtros. Mientras tanto, revisa que tu búsqueda tenga criterios amplios.",
    showSearchCta: false,
    showVisibilityCta: false,
  }
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

  const activeSearches = React.useMemo(
    () => searches.filter((s) => s.status === "active"),
    [searches]
  )
  const hasActiveSearches = activeSearches.length > 0
  const activeSearchSlots = activeSearches.length
  const canAddSearch =
    isPremiumPlan(profile?.plan) || activeSearchSlots === 0
  const [filtersOpen, setFiltersOpen] = React.useState(false)
  const [eventOpen, setEventOpen] = React.useState(false)
  const [profileQuery, setProfileQuery] = React.useState("")

  const {
    progress: firstActionsProgress,
    showChecklist,
    dismiss: dismissFirstActions,
    persistVisibility,
    visibilitySaving,
  } = useFirstActions()

  const radarStartRef = React.useRef<(() => void) | null>(null)
  const registerRadarStart = React.useCallback((start: () => void) => {
    radarStartRef.current = start
  }, [])

  const poolForMatchCounts = React.useMemo(
    () =>
      profiles.filter((p) => profileMatchesDiscoverFilters(p, discoverFilters)),
    [profiles, discoverFilters]
  )

  const searchesForBar = React.useMemo(
    () =>
      searches.map((s) =>
        s.status === "active"
          ? {
              ...s,
              matchesCount: countProfilesMatchingSearch(poolForMatchCounts, s),
            }
          : s
      ),
    [searches, poolForMatchCounts]
  )

  const visibleProfiles = React.useMemo(() => {
    let list = poolForMatchCounts

    if (profileQuery.trim()) {
      list = list.filter((p) => profileMatchesDiscoverQuery(p, profileQuery))
    }

    if (!hasActiveSearches) {
      return list.map((profile) => ({
        ...profile,
        matchScore: 0,
        matchedSearchId: null,
        matchedSearchTitle: null,
      }))
    }

    return rankProfilesForDiscover(list, {
      activeSearchId: activeSearch,
      activeSearches: searches,
      cityQuery: discoverFilters.city,
    })
  }, [
    poolForMatchCounts,
    activeSearch,
    searches,
    profileQuery,
    discoverFilters.city,
    hasActiveSearches,
  ])

  const hasProfileQuery = profileQuery.trim().length > 0
  const emptyCopy = discoverEmptyCopy({
    hasProfileQuery,
    activeEvent: activeEvent !== null,
    progress: firstActionsProgress,
    hasActiveSearches,
  })

  React.useEffect(() => {
    const spotlight = searchParams.get("spotlight")
    if (!spotlight || feedLoading) return

    const match = visibleProfiles.find((p) => p.id === spotlight)
    if (match) setSelected(match)
    router.replace("/feed")
  }, [searchParams, visibleProfiles, feedLoading, setSelected, router])

  if (!activated) {
    return (
      <div className="flex flex-col gap-6 px-4 md:px-6 py-6 max-w-xl mx-auto w-full">
        <RadarCTA
          onActivate={activateFeed}
          registerStart={registerRadarStart}
        />
        {showChecklist ? (
          <FirstActionsCard
            progress={firstActionsProgress}
            variant="banner"
            onActivateVisibility={() => void persistVisibility(true)}
            visibilitySaving={visibilitySaving}
            onActivateRadar={() => radarStartRef.current?.()}
            onDismiss={dismissFirstActions}
          />
        ) : null}
      </div>
    )
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
          searches={searchesForBar}
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
        {showChecklist ? (
          <FirstActionsCard
            progress={firstActionsProgress}
            variant="banner"
            onActivateVisibility={() => void persistVisibility(true)}
            visibilitySaving={visibilitySaving}
            onDismiss={dismissFirstActions}
            className="mb-5"
          />
        ) : null}

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
              {emptyCopy.title}
            </h3>
            <p className="mt-1 max-w-sm text-[12px] text-[var(--text2)]">
              {hasProfileQuery ? (
                <>
                  {emptyCopy.body}{" "}
                  <button
                    type="button"
                    onClick={() => setProfileQuery("")}
                    className="font-semibold text-[var(--p)] hover:underline underline-offset-2"
                  >
                    Limpia la búsqueda
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
                emptyCopy.body
              )}
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
              {emptyCopy.showVisibilityCta ? (
                <button
                  type="button"
                  onClick={() => void persistVisibility(true)}
                  disabled={visibilitySaving}
                  className={buttonVariants({
                    size: "lg",
                    className: "min-w-[200px] justify-center",
                  })}
                >
                  {visibilitySaving ? "Activando…" : "Activar visibilidad"}
                </button>
              ) : null}
              {emptyCopy.showSearchCta ? (
                <Link
                  href="/searches/new"
                  className={buttonVariants({
                    variant: emptyCopy.showVisibilityCta ? "secondary" : "primary",
                    size: "lg",
                    className: "min-w-[200px] justify-center",
                  })}
                >
                  Crear búsqueda
                </Link>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {visibleProfiles.map((p) => (
              <ProfileCard
                key={p.id}
                profile={p}
                connectionHint={peerHints.get(p.id) ?? { state: "none" }}
                matchedSearchTitle={
                  (p.matchScore ?? 0) >= MATCH_TIER_MEDIA
                    ? p.matchedSearchTitle
                    : null
                }
                showMatchBadge={hasActiveSearches}
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
