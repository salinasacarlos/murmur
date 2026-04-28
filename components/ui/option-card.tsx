"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface OptionCardProps {
  selected: boolean
  onSelect: () => void
  title: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function OptionCard({
  selected,
  onSelect,
  title,
  description,
  icon,
  className,
}: OptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "ds-card text-left p-4 flex gap-3 items-start",
        "transition-all hover:border-[var(--border2)]",
        selected &&
          "border-[var(--p)] bg-[var(--pl)] hover:border-[var(--p)]",
        className
      )}
      data-active={selected ? "true" : "false"}
    >
      {icon && (
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
            selected ? "bg-white text-[var(--p)]" : "bg-[var(--bg2)] text-[var(--text2)]"
          )}
        >
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-[13px] font-semibold",
            selected ? "text-[var(--p)]" : "text-[var(--text)]"
          )}
        >
          {title}
        </div>
        {description && (
          <div className="text-[12px] text-[var(--text2)] mt-0.5 leading-relaxed">
            {description}
          </div>
        )}
      </div>
      <div
        className={cn(
          "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center",
          selected
            ? "border-[var(--primary-solid)] bg-[var(--primary-solid)]"
            : "border-[var(--border2)]"
        )}
      >
        {selected && (
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-solid-foreground)]" />
        )}
      </div>
    </button>
  )
}

export interface MultiOptionProps {
  selected: boolean
  onToggle: () => void
  title: string
  description?: string
  className?: string
}

export function MultiOption({
  selected,
  onToggle,
  title,
  description,
  className,
}: MultiOptionProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className={cn(
        "ds-card text-left p-3 flex gap-3 items-start transition-all hover:border-[var(--border2)]",
        selected && "border-[var(--p)] bg-[var(--pl)] hover:border-[var(--p)]",
        className
      )}
      data-active={selected ? "true" : "false"}
    >
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-[13px] font-semibold",
            selected ? "text-[var(--p)]" : "text-[var(--text)]"
          )}
        >
          {title}
        </div>
        {description && (
          <div className="text-[11px] text-[var(--text2)] mt-0.5">
            {description}
          </div>
        )}
      </div>
      <div
        className={cn(
          "w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center",
          selected
            ? "border-[var(--primary-solid)] bg-[var(--primary-solid)]"
            : "border-[var(--border2)]"
        )}
      >
        {selected && (
          <svg
            viewBox="0 0 16 16"
            className="w-3 h-3 text-[var(--primary-solid-foreground)]"
          >
            <path
              d="M3 8.5l3 3 7-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </button>
  )
}
