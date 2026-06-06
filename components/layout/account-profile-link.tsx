"use client"

import * as React from "react"
import Link from "next/link"

import { Avatar } from "@/components/ui/avatar"
import { IconChevronRight } from "@/components/icons"
import { useAccountDisplay } from "@/hooks/use-account-display"
import { cn } from "@/lib/utils"

type AccountProfileLinkProps = {
  onNavigate?: () => void
  variant?: "card" | "compact"
  className?: string
}

export function AccountProfileLink({
  onNavigate,
  variant = "card",
  className,
}: AccountProfileLinkProps) {
  const { displayName, initials, photoUrl, planLabel } = useAccountDisplay()

  if (variant === "compact") {
    return (
      <Link
        href="/profile"
        onClick={onNavigate}
        aria-label={`Perfil de ${displayName}`}
        className={cn(
          "inline-flex shrink-0 rounded-full ring-offset-2 ring-offset-[var(--bg)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p)]",
          className
        )}
      >
        <Avatar
          initials={initials}
          imageUrl={photoUrl}
          alt={`Foto de ${displayName}`}
          size="sm"
        />
      </Link>
    )
  }

  return (
    <Link
      href="/profile"
      onClick={onNavigate}
      className={cn(
        "ds-card p-4 flex items-center gap-3 hover:border-[var(--border2)] transition-colors",
        className
      )}
    >
      <Avatar
        initials={initials}
        imageUrl={photoUrl}
        alt={`Foto de ${displayName}`}
        size="md"
      />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-[var(--text)] truncate">
          {displayName}
        </div>
        <div className="text-[12px] text-[var(--p)] mt-0.5">
          {planLabel} · Editar perfil
        </div>
      </div>
      <IconChevronRight size={14} className="shrink-0 text-[var(--text3)]" />
    </Link>
  )
}
