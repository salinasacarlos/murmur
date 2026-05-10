"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

import { Drawer, DrawerHeader } from "@/components/ui/drawer"
import { Toggle } from "@/components/ui/toggle"
import { useVisibility } from "@/components/providers/visibility-provider"
import { useCurrentUser } from "@/components/providers/current-user-provider"
import {
  IconCompass,
  IconUsers,
  IconMessage,
  IconSearch,
  IconSettings,
  IconUser,
  IconChevronRight,
  IconLogOut,
  IconBell,
} from "@/components/icons"
import { cn } from "@/lib/utils"

const TABS = [
  { href: "/feed", label: "Descubrir", icon: IconCompass },
  { href: "/connections", label: "Conexiones", icon: IconUsers },
  { href: "/messages", label: "Mensajes", icon: IconMessage },
  { href: "/searches", label: "Búsquedas", icon: IconSearch },
] as const

export function BottomNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = React.useState(false)
  const [signingOut, setSigningOut] = React.useState(false)
  const { visible, toggle } = useVisibility()
  const { signOut } = useCurrentUser()

  const moreActive =
    pathname === "/profile" || pathname.startsWith("/profile/")

  async function handleSignOut() {
    if (signingOut) return
    setSigningOut(true)
    try {
      await signOut()
    } finally {
      setSigningOut(false)
      setMoreOpen(false)
    }
  }

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg)]/95 backdrop-blur border-t-[0.5px] border-[var(--border)]"
        style={{ paddingBottom: "var(--sab)" }}
      >
        <div className="flex h-14">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const active =
              pathname === tab.href || pathname.startsWith(tab.href + "/")
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "relative z-[1] flex min-h-[44px] min-w-0 flex-1 touch-manipulation flex-col items-center justify-center gap-0.5 transition-colors",
                  active ? "text-[var(--p)]" : "text-[var(--text2)]"
                )}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            )
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors",
              moreActive ? "text-[var(--p)]" : "text-[var(--text2)]"
            )}
          >
            <IconSettings size={20} />
            <span className="text-[10px] font-medium">Más</span>
          </button>
        </div>
      </nav>

      <Drawer
        open={moreOpen}
        onOpenChange={setMoreOpen}
        ariaLabel="Más opciones"
      >
        <DrawerHeader title="Configuración" />

        <div className="flex flex-col gap-2">
          <div className="ds-card p-4 flex items-center justify-between">
            <div>
              <div className="text-[13px] font-semibold text-[var(--text)]">
                Visibilidad
              </div>
              <div className="text-[12px] text-[var(--text2)] mt-0.5">
                {visible ? "Apareces en búsquedas" : "Estás oculto"}
              </div>
            </div>
            <Toggle
              checked={visible}
              onCheckedChange={() => toggle()}
              label="Cambiar visibilidad"
            />
          </div>

          <ThemeModeSetting />

          <Link
            href="/notifications"
            onClick={() => setMoreOpen(false)}
            className="ds-card p-4 flex items-center justify-between hover:border-[var(--border2)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <IconBell size={16} />
              <span className="text-[13px] font-medium">Avisos</span>
            </div>
            <IconChevronRight size={14} />
          </Link>

          <Link
            href="/profile"
            onClick={() => setMoreOpen(false)}
            className="ds-card p-4 flex items-center justify-between hover:border-[var(--border2)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <IconUser size={16} />
              <span className="text-[13px] font-medium">Mi perfil</span>
            </div>
            <IconChevronRight size={14} />
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="ds-card p-4 flex items-center justify-between hover:border-[var(--border2)] transition-colors text-left disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <IconLogOut size={16} />
              <span className="text-[13px] font-medium">
                {signingOut ? "Cerrando sesión..." : "Cerrar sesión"}
              </span>
            </div>
            <IconChevronRight size={14} />
          </button>
        </div>
      </Drawer>
    </>
  )
}

const THEME_OPTIONS = [
  { value: "system", label: "Sistema" },
  { value: "light", label: "Claro" },
  { value: "dark", label: "Oscuro" },
] as const

function ThemeModeSetting() {
  const { resolvedTheme, theme, setTheme } = useTheme()
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const currentTheme = mounted ? theme ?? "system" : "system"
  const description = !mounted
    ? "Cargando preferencia..."
    : currentTheme === "system"
      ? `Usando el sistema (${resolvedTheme === "dark" ? "oscuro" : "claro"})`
      : currentTheme === "dark"
        ? "Interfaz en modo oscuro"
        : "Interfaz en modo claro"

  return (
    <div className="ds-card p-4">
      <div className="mb-3">
        <div className="flex items-center gap-3">
          <IconSettings size={16} />
          <span className="text-[13px] font-semibold text-[var(--text)]">
            Apariencia
          </span>
        </div>
        <p className="mt-1 text-[12px] text-[var(--text2)]">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-1 rounded-lg bg-[var(--bg2)] p-1">
        {THEME_OPTIONS.map((option) => {
          const selected = currentTheme === option.value
          return (
            <button
              key={option.value}
              type="button"
              disabled={!mounted}
              onClick={() => setTheme(option.value)}
              className={cn(
                "rounded-md px-2 py-1.5 text-[12px] font-semibold transition-colors disabled:opacity-50",
                selected
                  ? "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)]"
                  : "text-[var(--text2)] hover:bg-[var(--bg)] hover:text-[var(--text)]"
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function emptySubscribe() {
  return () => {}
}
