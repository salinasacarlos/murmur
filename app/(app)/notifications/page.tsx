"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCurrentUser } from "@/components/providers/current-user-provider"
import { useNotificationsUnread } from "@/components/providers/notifications-unread-provider"
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  runDigestNotifications,
  type AppNotification,
  type NotificationKind,
} from "@/lib/data/notifications"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

export default function NotificationsPage() {
  const router = useRouter()
  const { user } = useCurrentUser()
  const { refresh: refreshUnreadBadge } = useNotificationsUnread()
  const [items, setItems] = React.useState<AppNotification[]>([])
  const [loading, setLoading] = React.useState(true)

  const reload = React.useCallback(async () => {
    if (!user?.id) return
    const supabase = getSupabaseBrowserClient()
    await runDigestNotifications(supabase)
    const next = await fetchNotifications(supabase, user.id)
    setItems(next)
    await refreshUnreadBadge()
  }, [user?.id, refreshUnreadBadge])

  React.useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      await reload()
      if (!cancelled) setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [reload, user?.id])

  async function handlePrimary(n: AppNotification) {
    if (!user?.id) return
    const supabase = getSupabaseBrowserClient()
    await markNotificationRead(supabase, n.id, user.id)
    setItems((prev) =>
      prev.map((x) =>
        x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x
      )
    )
    await refreshUnreadBadge()
    const dest = primaryHref(n)
    if (dest) router.push(dest)
  }

  async function handleMarkAll() {
    if (!user?.id) return
    const supabase = getSupabaseBrowserClient()
    const ok = await markAllNotificationsRead(supabase, user.id)
    if (ok) {
      setItems((prev) =>
        prev.map((x) =>
          x.read_at ? x : { ...x, read_at: new Date().toISOString() }
        )
      )
      await refreshUnreadBadge()
    }
  }

  const unread = items.filter((n) => !n.read_at).length

  return (
    <div className="px-4 md:px-6 py-5 md:py-6 max-w-[640px] mx-auto w-full">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="md:hidden text-[18px] font-extrabold tracking-[-0.4px] mb-0.5">
            Avisos
          </h2>
          <p className="text-[12px] text-[var(--text2)]">
            Breves y humanos, como el viento en el radar.
          </p>
        </div>
        {unread > 0 ? (
          <Button variant="ghost" size="sm" onClick={() => void handleMarkAll()}>
            Marcar todas leídas
          </Button>
        ) : null}
      </div>

      {loading ? (
        <Card padding="default" className="text-center py-12">
          <p className="text-[12px] text-[var(--text2)]">Cargando…</p>
        </Card>
      ) : items.length === 0 ? (
        <Card padding="default" className="text-center py-12">
          <p className="text-[13px] font-medium text-[var(--text)] mb-1">
            Nada por aquí
          </p>
          <p className="text-[12px] text-[var(--text2)]">
            Cuando pase algo importante, lo verás primero aquí.
          </p>
          <Link
            href="/feed"
            className="inline-block mt-4 text-[12px] font-semibold text-[var(--p)]"
          >
            Volver a Descubrir
          </Link>
        </Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((n) => (
            <NotificationRow
              key={n.id}
              n={n}
              onPrimary={() => void handlePrimary(n)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function NotificationRow({
  n,
  onPrimary,
}: {
  n: AppNotification
  onPrimary: () => void
}) {
  const unread = !n.read_at
  const meta = n.metadata as Record<string, unknown> | null
  const senderName =
    typeof meta?.sender_name === "string"
      ? meta.sender_name
      : typeof meta?.inviter_name === "string"
        ? meta.inviter_name
        : null
  const senderPhoto =
    typeof meta?.sender_photo_url === "string"
      ? meta.sender_photo_url
      : typeof meta?.inviter_photo_url === "string"
        ? meta.inviter_photo_url
        : null
  const showAvatar =
    (n.kind === "connection_request" ||
      n.kind === "project_invite" ||
      n.kind === "high_compatibility_suggestion") &&
    (senderPhoto || senderName)

  const { label } = ctaForKind(n.kind)

  return (
    <li>
      <Card
        padding="default"
        className={cn(
          "ds-fade-up flex flex-col gap-3 transition-colors",
          unread ? "border-[var(--border2)] bg-[var(--bg2)]/40" : "opacity-85"
        )}
      >
        <div className="flex items-start gap-3">
          {showAvatar ? (
            <Avatar
              initials={(senderName || "?").slice(0, 2).toUpperCase()}
              imageUrl={senderPhoto || undefined}
              alt=""
              size="md"
            />
          ) : null}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[var(--text)] leading-snug">
              {n.title}
            </p>
            <p className="text-[12px] text-[var(--text2)] mt-1 leading-relaxed">
              {n.body}
            </p>
            <p className="text-[10px] text-[var(--text3)] mt-2">
              {formatWhen(n.created_at)}
            </p>
          </div>
        </div>
        <Button
          size="lg"
          variant={unread ? "primary" : "secondary"}
          className="w-full justify-center"
          onClick={onPrimary}
        >
          {label}
        </Button>
      </Card>
    </li>
  )
}

function ctaForKind(kind: NotificationKind): { label: string } {
  switch (kind) {
    case "connection_request":
      return { label: "Ver en Conexiones" }
    case "connection_accepted":
      return { label: "Abrir el chat" }
    case "discovery_batch":
      return { label: "Ir a Descubrir" }
    case "high_compatibility_suggestion":
      return { label: "Abrir Descubrir" }
    case "event_nearby":
      return { label: "Explorar Descubrir" }
    case "project_invite":
      return { label: "Ver proyecto" }
    case "profile_incomplete":
      return { label: "Completar perfil" }
    case "inactivity_nudge":
      return { label: "Volver al radar" }
    default:
      return { label: "Entendido" }
  }
}

function primaryHref(n: AppNotification): string | null {
  const meta = n.metadata as Record<string, unknown> | null
  switch (n.kind) {
    case "connection_request":
      return "/connections?tab=received"
    case "connection_accepted": {
      const chatId = typeof meta?.chat_id === "string" ? meta.chat_id : null
      return chatId ? `/messages/${chatId}` : "/messages"
    }
    case "discovery_batch":
    case "event_nearby":
    case "inactivity_nudge":
      return "/feed"
    case "high_compatibility_suggestion": {
      const sid =
        typeof meta?.suggested_profile_id === "string"
          ? meta.suggested_profile_id
          : null
      return sid ? `/feed?spotlight=${encodeURIComponent(sid)}` : "/feed"
    }
    case "project_invite": {
      const path =
        typeof meta?.context_path === "string" && meta.context_path.startsWith("/")
          ? meta.context_path
          : null
      return path ?? "/searches"
    }
    case "profile_incomplete":
      return "/profile"
    default:
      return null
  }
}

function formatWhen(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString("es-MX", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return ""
  }
}
