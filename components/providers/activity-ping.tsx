"use client"

import * as React from "react"

import { useCurrentUser } from "@/components/providers/current-user-provider"
import { touchProfileActivity } from "@/lib/data/notifications"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

const INTERVAL_MS = 5 * 60 * 1000

/**
 * Actualiza `profiles.last_active_at` con poca frecuencia (reglas de inactividad / perfil).
 */
export function ActivityPing() {
  const { user } = useCurrentUser()

  React.useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    const ping = () => {
      if (cancelled) return
      void touchProfileActivity(getSupabaseBrowserClient())
    }
    ping()
    const id = window.setInterval(ping, INTERVAL_MS)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [user?.id])

  return null
}
