"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { IconCompass } from "@/components/icons"
import { cn } from "@/lib/utils"

const FEED_HREF = "/feed"

export function DiscoverNavMobile() {
  const pathname = usePathname()
  const active =
    pathname === FEED_HREF || pathname.startsWith(`${FEED_HREF}/`)

  return (
    <Link
      href={FEED_HREF}
      aria-current={active ? "page" : undefined}
      className="relative z-10 flex w-[76px] shrink-0 flex-col items-center touch-manipulation -mt-3"
    >
      <span
        className={cn(
          "flex h-[54px] w-[54px] items-center justify-center rounded-full border-[3px] border-[var(--bg)] shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-all",
          active
            ? "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] scale-[1.02]"
            : "bg-[var(--p)] text-white hover:scale-[1.04] active:scale-95"
        )}
      >
        <IconCompass size={24} strokeWidth={2.25} />
      </span>
      <span
        className={cn(
          "mt-1.5 text-[10px] font-bold tracking-[-0.02em]",
          active ? "text-[var(--p)]" : "text-[var(--text)]"
        )}
      >
        Descubrir
      </span>
    </Link>
  )
}

export function DiscoverNavSidebar() {
  const pathname = usePathname()
  const active =
    pathname === FEED_HREF || pathname.startsWith(`${FEED_HREF}/`)

  return (
    <Link
      href={FEED_HREF}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group mx-1 mb-3 flex items-center gap-3 rounded-xl border px-3 py-3 transition-all",
        active
          ? "border-[var(--p)] bg-[var(--pl)] shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-[var(--pm)]"
          : "border-[var(--pm)] bg-gradient-to-br from-[var(--pl)]/90 to-[var(--bg)] hover:border-[var(--p)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)]"
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
          active
            ? "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)]"
            : "bg-[var(--p)] text-white group-hover:opacity-90"
        )}
      >
        <IconCompass size={18} strokeWidth={2.25} />
      </span>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "text-[13px] font-bold tracking-[-0.02em]",
            active ? "text-[var(--p)]" : "text-[var(--text)]"
          )}
        >
          Descubrir
        </div>
        <div className="text-[11px] text-[var(--text2)] leading-snug">
          Tu radar de personas
        </div>
      </div>
    </Link>
  )
}
