"use client"

import * as React from "react"

import { PRIMARY_CITIES_CATALOG } from "@/lib/catalogs"
import { cn } from "@/lib/utils"

interface CitySingleSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxVisibleResults?: number
  className?: string
}

export function CitySingleSelect({
  value,
  onChange,
  placeholder = "Buscar ciudad…",
  maxVisibleResults = 16,
  className,
}: CitySingleSelectProps) {
  const [query, setQuery] = React.useState("")
  const normalizedQuery = normalize(query)

  const results = PRIMARY_CITIES_CATALOG.filter((city) =>
    normalize(city).includes(normalizedQuery)
  ).slice(0, maxVisibleResults)

  function select(city: string) {
    onChange(city)
    setQuery("")
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className={cn(
            "inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
            "border-[var(--primary-solid)] bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] hover:opacity-85"
          )}
          aria-label={`Quitar ${value}`}
        >
          {value}
          <span className="text-[13px] leading-none" aria-hidden>
            ×
          </span>
        </button>
      ) : null}

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="ds-input"
      />

      <div className="flex max-h-48 flex-wrap gap-1.5 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2">
        {results.length > 0 ? (
          results.map((city) => {
            const selected = value === city
            return (
              <button
                key={city}
                type="button"
                onClick={() => select(city)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[12px] transition-colors",
                  selected
                    ? "border-[var(--primary-solid)] bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)]"
                    : "border-[var(--border)] bg-[var(--bg)] text-[var(--text2)] hover:border-[var(--border2)] hover:text-[var(--text)]"
                )}
              >
                {city}
              </button>
            )
          })
        ) : (
          <p className="px-1 py-1 text-[12px] text-[var(--text3)]">
            No encontramos ciudades con ese texto.
          </p>
        )}
      </div>
    </div>
  )
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}
