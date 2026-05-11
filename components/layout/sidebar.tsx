"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Logo } from "@/components/brand/logo"
import { Avatar } from "@/components/ui/avatar"
import { Toggle } from "@/components/ui/toggle"
import { useCurrentUser } from "@/components/providers/current-user-provider"
import { usePersistVisibility } from "@/hooks/use-persist-visibility"
import { isPremiumPlan } from "@/lib/plan-limits"
import {
  NotificationUnreadDot,
  useNotificationsUnread,
} from "@/components/providers/notifications-unread-provider"
import {
  IconCompass,
  IconSearch,
  IconUsers,
  IconMessage,
  IconUser,
  IconLogOut,
  IconBell,
} from "@/components/icons"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/feed", label: "Descubrir", icon: IconCompass },
  { href: "/searches", label: "Mis búsquedas", icon: IconSearch },
  { href: "/connections", label: "Conexiones", icon: IconUsers },
  { href: "/messages", label: "Mensajes", icon: IconMessage },
  { href: "/notifications", label: "Notificaciones", icon: IconBell },
  { href: "/profile", label: "Mi perfil", icon: IconUser },
] as const

export function Sidebar() {
  const pathname = usePathname()
  const { visible, persistVisibility, saving: savingVisibility } =
    usePersistVisibility()
  const { profile, user, signOut } = useCurrentUser()
  const { hasUnread } = useNotificationsUnread()
  const [signingOut, setSigningOut] = React.useState(false)

  const displayName =
    profile?.name?.trim() ||
    (user?.user_metadata?.name as string | undefined)?.trim() ||
    user?.email ||
    "Tu cuenta"
  const initials =
    profile?.initials || displayName.slice(0, 2).toUpperCase() || "TU"
  const photoUrl = profile?.photo_url ?? undefined
  const planLabel = profile?.plan === "premium" ? "Premium" : "Free"

  async function handleSignOut() {
    if (signingOut) return
    setSigningOut(true)
    try {
      await signOut()
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <aside
      className={cn(
        "hidden md:flex md:flex-col",
        "fixed left-0 top-0 bottom-0 w-[224px] z-40",
        "bg-[var(--bg)] border-r-[0.5px] border-[var(--border)]"
      )}
      style={{ paddingTop: "var(--sat)" }}
    >
      <div className="px-4 pt-5 pb-4">
        <Link href="/feed" className="block mb-5">
          <Logo size="md" />
        </Link>

        <div
          role="group"
          aria-label={`Visibilidad: ${visible ? "apareces en búsquedas" : "oculto"}`}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg",
            "border border-[var(--border)] bg-[var(--bg2)]",
            "text-[12px] hover:border-[var(--border2)] transition-colors"
          )}
        >
          <div
            className="flex items-center gap-2 flex-1 min-w-0 text-left"
          >
            <span
              className={cn(
                "w-2 h-2 shrink-0 rounded-full",
                visible ? "bg-[var(--g)]" : "bg-[var(--text3)]"
              )}
            />
            <span className="font-medium text-[var(--text)]">
              {visible ? "Visible" : "Oculto"}
            </span>
          </div>
          <Toggle
            checked={visible}
            onCheckedChange={(next) => void persistVisibility(next)}
            disabled={savingVisibility}
            label="Cambiar visibilidad"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors",
                active
                  ? "bg-[var(--pl)] text-[var(--p)] font-medium"
                  : "text-[var(--text2)] hover:bg-[var(--bg2)] hover:text-[var(--text)]"
              )}
            >
              <span className="relative inline-flex shrink-0">
                <Icon size={14} />
                {item.href === "/notifications" ? (
                  <NotificationUnreadDot
                    show={hasUnread}
                    ringClassName={active ? "ring-[var(--pl)]" : "ring-[var(--bg)]"}
                  />
                ) : null}
              </span>
              {item.label}
            </Link>
          )
        })}
        {!isPremiumPlan(profile?.plan) ? (
          <Link
            href="/upgrade"
            className={cn(
              "mt-2 flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors",
              pathname === "/upgrade"
                ? "bg-[var(--pl)] text-[var(--p)] font-medium"
                : "text-[var(--p)] hover:bg-[var(--pl)]/60 font-medium"
            )}
          >
            Pasar a Premium
          </Link>
        ) : null}
      </nav>

      <div
        className="border-t-[0.5px] border-[var(--border)] px-4 py-3 flex items-center gap-2.5"
        style={{ paddingBottom: "calc(12px + var(--sab))" }}
      >
        <Avatar
          initials={initials}
          imageUrl={photoUrl}
          alt={`Foto de ${displayName}`}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-semibold text-[var(--text)] truncate">
            {displayName}
          </div>
          <div className="text-[10px] text-[var(--text3)] truncate uppercase tracking-wider">
            {planLabel}
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          className={cn(
            "shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-md",
            "text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--bg2)]",
            "transition-colors disabled:opacity-50"
          )}
        >
          <IconLogOut size={14} />
        </button>
      </div>
    </aside>
  )
}
