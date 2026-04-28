"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface ToggleProps {
  checked: boolean
  onCheckedChange: (next: boolean) => void
  disabled?: boolean
  label?: string
  className?: string
  id?: string
}

export function Toggle({
  checked,
  onCheckedChange,
  disabled,
  label,
  className,
  id,
}: ToggleProps) {
  return (
    <button
      id={id}
      role="switch"
      type="button"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "w-8 h-[18px] rounded-full relative transition-colors cursor-pointer outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--p)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
        "disabled:opacity-50 disabled:pointer-events-none",
        checked ? "bg-[var(--p)]" : "bg-[var(--border2)]",
        className
      )}
    >
      <span
        className={cn(
          "w-3 h-3 rounded-full bg-white absolute top-[3px] transition-all shadow-sm",
          checked ? "right-[3px]" : "left-[3px]"
        )}
      />
    </button>
  )
}
