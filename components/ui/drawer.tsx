"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
  ariaLabel?: string
}

export function Drawer({
  open,
  onOpenChange,
  children,
  className,
  ariaLabel,
}: DrawerProps) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onOpenChange])

  return (
    <div
      className="ds-overlay"
      data-open={open ? "true" : "false"}
      onClick={() => onOpenChange(false)}
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn("ds-drawer", className)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ds-drawer-handle" />
        {children}
      </div>
    </div>
  )
}

export function DrawerHeader({
  title,
  description,
  className,
}: {
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn("mb-4", className)}>
      <h2 className="text-[16px] font-bold tracking-[-0.3px] text-[var(--text)]">
        {title}
      </h2>
      {description && (
        <p className="text-[12px] text-[var(--text2)] mt-1">{description}</p>
      )}
    </div>
  )
}

interface SidePanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
  ariaLabel?: string
}

export function SidePanel({
  open,
  onOpenChange,
  children,
  className,
  ariaLabel,
}: SidePanelProps) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onOpenChange])

  return (
    <div
      className="ds-overlay"
      data-open={open ? "true" : "false"}
      onClick={() => onOpenChange(false)}
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn("ds-side-panel", className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
