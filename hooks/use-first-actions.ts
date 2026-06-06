"use client"

import * as React from "react"

import { useCurrentUser } from "@/components/providers/current-user-provider"
import { useDiscoverFeed } from "@/components/providers/discover-feed-provider"
import { usePersistVisibility } from "@/hooks/use-persist-visibility"
import { fetchSearchesForOwner } from "@/lib/data/searches"
import {
  allFirstActionsDone,
  countFirstActionsDone,
  readFirstActionsDismissed,
  writeFirstActionsDismissed,
  type FirstActionsProgress,
} from "@/lib/first-actions"
import { peekSearchesList, putSearchesList } from "@/lib/searches-list-cache"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function useFirstActions() {
  const { user, profile } = useCurrentUser()
  const { visible, persistVisibility, saving: visibilitySaving } =
    usePersistVisibility()
  const { activated, activateFeed, searches: feedSearches } = useDiscoverFeed()

  const userId = user?.id ?? null
  const [dismissed, setDismissed] = React.useState(false)
  const [hasActiveSearch, setHasActiveSearch] = React.useState(false)
  const [searchLoading, setSearchLoading] = React.useState(true)

  React.useEffect(() => {
    if (!userId) {
      setDismissed(false)
      setHasActiveSearch(false)
      setSearchLoading(false)
      return
    }
    setDismissed(readFirstActionsDismissed(userId))
  }, [userId])

  const reloadSearchState = React.useCallback(async () => {
    if (!userId) return
    const cached = peekSearchesList(userId)
    if (cached?.length) {
      setHasActiveSearch(cached.some((s) => s.status === "active"))
      setSearchLoading(false)
    } else {
      setSearchLoading(true)
    }

    const supabase = getSupabaseBrowserClient()
    const rows = await fetchSearchesForOwner(supabase, userId)
    putSearchesList(userId, rows)
    setHasActiveSearch(rows.some((s) => s.status === "active"))
    setSearchLoading(false)
  }, [userId])

  React.useEffect(() => {
    void reloadSearchState()
  }, [reloadSearchState])

  React.useEffect(() => {
    if (!feedSearches.length) return
    setHasActiveSearch(feedSearches.some((s) => s.status === "active"))
    setSearchLoading(false)
  }, [feedSearches])

  const progress = React.useMemo(
    (): FirstActionsProgress => ({
      visibility: visible || profile?.visible === true,
      search: hasActiveSearch,
      radar: activated,
    }),
    [visible, profile?.visible, hasActiveSearch, activated]
  )

  const doneCount = countFirstActionsDone(progress)
  const allDone = allFirstActionsDone(progress)
  const showChecklist = Boolean(userId) && !dismissed && !allDone

  const dismiss = React.useCallback(() => {
    if (!userId) return
    writeFirstActionsDismissed(userId, true)
    setDismissed(true)
  }, [userId])

  return {
    progress,
    doneCount,
    allDone,
    showChecklist,
    dismiss,
    visibilitySaving,
    persistVisibility,
    activateFeed,
    searchLoading,
    reloadSearchState,
  }
}
