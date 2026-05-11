"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Logo } from "@/components/brand/logo"
import { Toggle } from "@/components/ui/toggle"
import { usePersistVisibility } from "@/hooks/use-persist-visibility"
import {
  NotificationUnreadDot,
  useNotificationsUnread,
} from "@/components/providers/notifications-unread-provider"
import { IconSearch, IconBell } from "@/components/icons"
import { cn } from "@/lib/utils"

const PAGE_TITLES: Record<string, string> = {
  "/feed": "Descubrir",
  "/searches": "Mis búsquedas",
  "/searches/new": "Nueva búsqueda",
  "/connections": "Conexiones",
  "/messages": "Mensajes",
  "/profile": "Mi perfil",
  "/notifications": "Notificaciones",
}

function getTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith("/searches/")) return "Editar búsqueda"
  if (pathname.startsWith("/messages/")) return "Mensajes"
  return ""
}

export function Topbar() {
  const pathname = usePathname()
  const { visible, persistVisibility, saving: savingVisibility } =
    usePersistVisibility()
  const { hasUnread } = useNotificationsUnread()
  const title = getTitle(pathname)

  return (
    <>
      <header
        className="hidden md:flex sticky top-0 z-30 items-center justify-between px-6 bg-[var(--bg)]/95 backdrop-blur border-b-[0.5px] border-[var(--border)]"
        style={{
          height: "calc(var(--topbar-h) + var(--sat))",
          paddingTop: "var(--sat)",
        }}
      >
        <h1 className="text-[18px] font-extrabold tracking-[-0.4px]">
          {title}
        </h1>

        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg2)] text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--border2)] transition-colors"
            aria-label={
              hasUnread
                ? "Notificaciones sin leer"
                : "Notificaciones"
            }
          >
            <span className="relative inline-flex">
              <IconBell size={16} />
              <NotificationUnreadDot
                show={hasUnread}
                ringClassName="ring-[var(--bg2)]"
              />
            </span>
          </Link>
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg",
              "border border-[var(--border)] bg-[var(--bg2)]",
              "text-[12px] text-[var(--text3)] w-64"
            )}
          >
            <IconSearch size={14} />
            <span>Buscar...</span>
          </div>
        </div>
      </header>

      <header
        className="md:hidden sticky top-0 z-30 bg-[var(--bg)]/95 backdrop-blur border-b-[0.5px] border-[var(--border)]"
        style={{ paddingTop: "var(--sat)" }}
      >
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/feed">
            <Logo size="sm" />
          </Link>
          <div
            role="group"
            aria-label={`Visibilidad: ${visible ? "apareces en búsquedas" : "oculto"}`}
            className={cn(
              "flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] border",
              visible
                ? "border-[var(--g)]/40 bg-[var(--gl)] text-[var(--g)]"
                : "border-[var(--border)] bg-[var(--bg2)] text-[var(--text2)]"
            )}
          >
            <span
              className="flex flex-1 min-w-0 items-center gap-2 font-inherit text-inherit"
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 shrink-0 rounded-full",
                  visible ? "bg-[var(--g)]" : "bg-[var(--text3)]"
                )}
              />
              {visible ? "Visible" : "Oculto"}
            </span>
            <Toggle
              checked={visible}
              onCheckedChange={(next) => void persistVisibility(next)}
              disabled={savingVisibility}
              label="Cambiar visibilidad"
            />
          </div>
        </div>
      </header>
    </>
  )
}
