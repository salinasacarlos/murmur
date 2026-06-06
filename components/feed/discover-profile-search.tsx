"use client"

import * as React from "react"

import { IconSearch, IconX } from "@/components/icons"
import { cn } from "@/lib/utils"

type DiscoverProfileSearchProps = {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function DiscoverProfileSearch({
  value,
  onChange,
  className,
}: DiscoverProfileSearchProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <div
      className={cn(
        "relative flex items-center border-b-[0.5px] border-[var(--border)] bg-[var(--bg)] px-4 md:px-6 py-2.5",
        className
      )}
    >
      <IconSearch
        size={14}
        className="pointer-events-none absolute left-7 md:left-[calc(1.5rem+0.25rem)] text-[var(--text3)]"
        aria-hidden
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre, rol o ciudad…"
        aria-label="Buscar perfiles en Descubrir"
        className={cn(
          "w-full rounded-lg border border-[var(--border)] bg-[var(--bg2)]",
          "py-2 pl-9 pr-9 text-[13px] text-[var(--text)] placeholder:text-[var(--text3)]",
          "outline-none transition-colors",
          "focus:border-[var(--p)] focus:ring-2 focus:ring-[var(--p)]/20"
        )}
      />
      {value.trim().length > 0 ? (
        <button
          type="button"
          onClick={() => {
            onChange("")
            inputRef.current?.focus()
          }}
          className="absolute right-7 md:right-[calc(1.5rem+0.25rem)] inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--text3)] hover:bg-[var(--bg)] hover:text-[var(--text)] transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <IconX size={14} />
        </button>
      ) : null}
    </div>
  )
}
