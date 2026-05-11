"use client"

import * as React from "react"

import { useCurrentUser } from "@/components/providers/current-user-provider"
import { useVisibility } from "@/components/providers/visibility-provider"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

/**
 * Sincroniza el toggle de visibilidad con `profiles.visible` (no solo localStorage).
 * Usar en sidebar, topbar y bottom-nav; la página de perfil tiene su propio flujo con más refrescos.
 */
export function usePersistVisibility() {
  const { user, refresh } = useCurrentUser()
  const { visible, setVisible } = useVisibility()
  const [saving, setSaving] = React.useState(false)

  const persistVisibility = React.useCallback(
    async (next: boolean) => {
      if (!user) return
      setSaving(true)
      try {
        const supabase = getSupabaseBrowserClient()
        const { error } = await supabase
          .from("profiles")
          .update({ visible: next })
          .eq("id", user.id)
        if (error) {
          console.error("Failed to save visibility", error)
          return
        }
        setVisible(next)
        await refresh()
      } finally {
        setSaving(false)
      }
    },
    [user, refresh, setVisible]
  )

  return { visible, persistVisibility, saving }
}
