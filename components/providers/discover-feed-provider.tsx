"use client"

import * as React from "react"

import { useCurrentUser } from "@/components/providers/current-user-provider"
import {
  readFeedActivated,
  readFeedActiveEvent,
  readFeedActiveSearch,
  readFeedFilters,
  writeFeedActivated,
  writeFeedActiveEvent,
  writeFeedActiveSearch,
  writeFeedFilters,
} from "@/lib/discover-feed-storage"
import { fetchEventByCode } from "@/lib/data/events"
import { fetchVisibleProfilesForFeed } from "@/lib/data/profiles"
import { fetchSearchesForOwner } from "@/lib/data/searches"
import {
  emptyDiscoverFeedFilters,
  type DiscoverFeedFilters,
} from "@/lib/feed-filters"
import { PENDING_EVENT_STORAGE_KEY } from "@/lib/murmur-onboarding"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { EventEntry, Profile, Search } from "@/lib/types"

type DiscoverFeedContextValue = {
  activated: boolean
  activateFeed: () => void
  activeSearch: string
  setActiveSearch: (id: string) => void
  selected: Profile | null
  setSelected: (p: Profile | null) => void
  discoverFilters: DiscoverFeedFilters
  setDiscoverFilters: React.Dispatch<React.SetStateAction<DiscoverFeedFilters>>
  activeEvent: EventEntry | null
  setActiveEvent: (e: EventEntry | null) => void
  profiles: Profile[]
  searches: Search[]
  feedLoading: boolean
  refreshFeed: () => Promise<void>
  pendingEventCode: string | null
}

const DiscoverFeedContext = React.createContext<DiscoverFeedContextValue | null>(
  null
)

export function DiscoverFeedProvider({ children }: { children: React.ReactNode }) {
  const { user } = useCurrentUser()
  const userId = user?.id ?? null

  const [activated, setActivated] = React.useState(false)
  const [activeSearch, setActiveSearchState] = React.useState("all")
  const [selected, setSelected] = React.useState<Profile | null>(null)
  const [discoverFilters, setDiscoverFilters] = React.useState<DiscoverFeedFilters>(
    () => emptyDiscoverFeedFilters()
  )
  const [activeEvent, setActiveEventState] = React.useState<EventEntry | null>(null)
  const [profiles, setProfiles] = React.useState<Profile[]>([])
  const [searches, setSearches] = React.useState<Search[]>([])
  const [feedLoading, setFeedLoading] = React.useState(false)
  const [pendingEventCode, setPendingEventCode] = React.useState<string | null>(null)

  const fetchKeyRef = React.useRef<string | null>(null)
  const profilesRef = React.useRef<Profile[]>([])
  profilesRef.current = profiles

  React.useLayoutEffect(() => {
    if (!userId) {
      setActivated(false)
      setActiveSearchState("all")
      setSelected(null)
      setDiscoverFilters(emptyDiscoverFeedFilters())
      setActiveEventState(null)
      setProfiles([])
      setSearches([])
      setPendingEventCode(null)
      fetchKeyRef.current = null
      return
    }
    setActivated(readFeedActivated(userId))
    setActiveSearchState(readFeedActiveSearch(userId) ?? "all")
    setDiscoverFilters(readFeedFilters(userId))
    setActiveEventState(readFeedActiveEvent(userId))
  }, [userId])

  const setActiveSearch = React.useCallback(
    (id: string) => {
      setActiveSearchState(id)
      if (userId) writeFeedActiveSearch(userId, id)
    },
    [userId]
  )

  const setActiveEvent = React.useCallback(
    (e: EventEntry | null) => {
      setActiveEventState(e)
      if (userId) writeFeedActiveEvent(userId, e)
    },
    [userId]
  )

  React.useEffect(() => {
    if (!userId) return
    writeFeedFilters(userId, discoverFilters)
  }, [userId, discoverFilters])

  const activateFeed = React.useCallback(() => {
    if (!userId) return
    let code: string | undefined
    try {
      const raw = localStorage.getItem(PENDING_EVENT_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { code?: string }
        code = parsed?.code
      }
    } catch {
      // ignore
    } finally {
      try {
        localStorage.removeItem(PENDING_EVENT_STORAGE_KEY)
      } catch {
        // ignore
      }
    }
    if (code) setPendingEventCode(code)
    setActivated(true)
    writeFeedActivated(userId, true)
  }, [userId])

  React.useEffect(() => {
    if (!activated || !userId || !pendingEventCode) return
    let cancelled = false
    ;(async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const ev = await fetchEventByCode(supabase, pendingEventCode)
        if (!cancelled && ev) {
          setActiveEventState(ev)
          writeFeedActiveEvent(userId, ev)
        }
      } finally {
        if (!cancelled) setPendingEventCode(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [activated, userId, pendingEventCode])

  const refreshFeed = React.useCallback(async () => {
    if (!activated || !userId) return
    setFeedLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const [p, s] = await Promise.all([
        fetchVisibleProfilesForFeed(supabase, {
          excludeUserId: userId,
          eventCode: activeEvent?.code ?? null,
        }),
        fetchSearchesForOwner(supabase, userId),
      ])
      setProfiles(p)
      setSearches(s)
    } finally {
      setFeedLoading(false)
    }
  }, [activated, userId, activeEvent?.code])

  React.useEffect(() => {
    if (!activated || !userId) return
    const key = `${userId}:${activeEvent?.code ?? ""}`
    const prevKey = fetchKeyRef.current
    fetchKeyRef.current = key
    const hadCache = prevKey === key && profilesRef.current.length > 0

    let cancelled = false
    ;(async () => {
      if (!hadCache) setFeedLoading(true)
      try {
        const supabase = getSupabaseBrowserClient()
        const [p, s] = await Promise.all([
          fetchVisibleProfilesForFeed(supabase, {
            excludeUserId: userId,
            eventCode: activeEvent?.code ?? null,
          }),
          fetchSearchesForOwner(supabase, userId),
        ])
        if (!cancelled) {
          setProfiles(p)
          setSearches(s)
        }
      } finally {
        if (!cancelled) setFeedLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [activated, userId, activeEvent?.code])

  const value = React.useMemo(
    (): DiscoverFeedContextValue => ({
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
      refreshFeed,
      pendingEventCode,
    }),
    [
      activated,
      activateFeed,
      activeSearch,
      setActiveSearch,
      selected,
      discoverFilters,
      setDiscoverFilters,
      activeEvent,
      setActiveEvent,
      profiles,
      searches,
      feedLoading,
      refreshFeed,
      pendingEventCode,
    ]
  )

  return (
    <DiscoverFeedContext.Provider value={value}>
      {children}
    </DiscoverFeedContext.Provider>
  )
}

export function useDiscoverFeed(): DiscoverFeedContextValue {
  const ctx = React.useContext(DiscoverFeedContext)
  if (!ctx) {
    throw new Error("useDiscoverFeed must be used within DiscoverFeedProvider")
  }
  return ctx
}
