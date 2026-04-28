"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Logo } from "@/components/brand/logo"
import { Avatar } from "@/components/ui/avatar"
import { Toggle } from "@/components/ui/toggle"
import { useVisibility } from "@/components/providers/visibility-provider"
import { mockCurrentUser } from "@/lib/mock-data"
import {
  IconCompass,
  IconSearch,
  IconUsers,
  IconMessage,
  IconUser,
} from "@/components/icons"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/feed", label: "Descubrir", icon: IconCompass },
  { href: "/searches", label: "Mis búsquedas", icon: IconSearch },
  { href: "/connections", label: "Conexiones", icon: IconUsers },
  { href: "/messages", label: "Mensajes", icon: IconMessage },
  { href: "/profile", label: "Mi perfil", icon: IconUser },
] as const

export function Sidebar() {
  const pathname = usePathname()
  const { visible, toggle } = useVisibility()

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
          className={cn(
            "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg",
            "border border-[var(--border)] bg-[var(--bg2)]",
            "text-[12px] hover:border-[var(--border2)] transition-colors"
          )}
        >
          <button
            type="button"
            onClick={toggle}
            className="flex items-center gap-2 flex-1 min-w-0 rounded-md border-0 bg-transparent p-0 text-left cursor-pointer"
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
          </button>
          <Toggle
            checked={visible}
            onCheckedChange={() => toggle()}
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
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors",
                active
                  ? "bg-[var(--pl)] text-[var(--p)] font-medium"
                  : "text-[var(--text2)] hover:bg-[var(--bg2)] hover:text-[var(--text)]"
              )}
            >
              <Icon size={14} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div
        className="border-t-[0.5px] border-[var(--border)] px-4 py-3 flex items-center gap-2.5"
        style={{ paddingBottom: "calc(12px + var(--sab))" }}
      >
        <Avatar
          initials={mockCurrentUser.initials}
          imageUrl={mockCurrentUser.photoUrl}
          alt={`Foto de ${mockCurrentUser.name}`}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-semibold text-[var(--text)] truncate">
            {mockCurrentUser.name}
          </div>
          <div className="text-[10px] text-[var(--text3)] truncate uppercase tracking-wider">
            {mockCurrentUser.plan === "premium" ? "Premium" : "Free"}
          </div>
        </div>
      </div>
    </aside>
  )
}
