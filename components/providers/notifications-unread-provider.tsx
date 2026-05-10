"use client"

import * as React from "react"

import { useCurrentUser } from "@/components/providers/current-user-provider"
import { countUnreadNotifications } from "@/lib/data/notifications"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

type NotificationsUnreadContextValue = {
  /** Hay al menos un aviso sin leer (solo indica presencia, no el número). */
  hasUnread: boolean
  /** Vuelve a consultar el servidor (p. ej. tras marcar leídos). */
  refresh: () => Promise<void>
}

const NotificationsUnreadContext =
  React.createContext<NotificationsUnreadContextValue | null>(null)

export function NotificationsUnreadProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useCurrentUser()
  const userId = user?.id ?? null
  const [hasUnread, setHasUnread] = React.useState(false)

  const refresh = React.useCallback(async () => {
    if (!userId) {
      setHasUnread(false)
      return
    }
    const supabase = getSupabaseBrowserClient()
    const n = await countUnreadNotifications(supabase, userId)
    setHasUnread(n > 0)
  }, [userId])

  React.useEffect(() => {
    if (!userId) {
      setHasUnread(false)
      return
    }
    const uid = userId
    let cancelled = false

    async function tick() {
      const supabase = getSupabaseBrowserClient()
      const n = await countUnreadNotifications(supabase, uid)
      if (!cancelled) setHasUnread(n > 0)
    }

    void tick()
    const interval = window.setInterval(() => void tick(), 45_000)
    const onVisible = () => {
      if (document.visibilityState === "visible") void tick()
    }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      cancelled = true
      window.clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [userId])

  const value = React.useMemo(
    (): NotificationsUnreadContextValue => ({ hasUnread, refresh }),
    [hasUnread, refresh]
  )

  return (
    <NotificationsUnreadContext.Provider value={value}>
      {children}
    </NotificationsUnreadContext.Provider>
  )
}

export function useNotificationsUnread(): NotificationsUnreadContextValue {
  const ctx = React.useContext(NotificationsUnreadContext)
  if (!ctx) {
    throw new Error(
      "useNotificationsUnread requires NotificationsUnreadProvider"
    )
  }
  return ctx
}

/** Punto rojo para el icono de campana (sin número). */
export function NotificationUnreadDot({
  show,
  ringClassName = "ring-[var(--bg)]",
}: {
  show: boolean
  /** Color del contorno para fundirse con el fondo del botón/enlace. */
  ringClassName?: string
}) {
  if (!show) return null
  return (
    <span
      className={cn(
        "pointer-events-none absolute -top-0.5 -right-0.5 z-10 h-2 w-2 rounded-full bg-[#e11d48] ring-2",
        ringClassName
      )}
      aria-hidden
    />
  )
}
