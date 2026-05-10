"use client"

import * as React from "react"

import { CITIES_CATALOG, WORLDWIDE_CITY_LABEL } from "@/lib/catalogs"
import { cn } from "@/lib/utils"

interface CitySelectorProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  maxVisibleResults?: number
  className?: string
}

export function CitySelector({
  value,
  onChange,
  placeholder = "Buscar ciudad...",
  maxVisibleResults = 14,
  className,
}: CitySelectorProps) {
  const [query, setQuery] = React.useState("")
  const normalizedQuery = normalize(query)

  const citiesScoped = CITIES_CATALOG.filter((c) => c !== WORLDWIDE_CITY_LABEL)

  const results = citiesScoped
    .filter((city) => normalize(city).includes(normalizedQuery))
    .slice(0, maxVisibleResults)

  const worldwideMatches =
    normalizedQuery === "" ||
    normalize(WORLDWIDE_CITY_LABEL).includes(normalizedQuery)

  function toggle(city: string) {
    onChange(
      value.includes(city)
        ? value.filter((item) => item !== city)
        : [...value, city]
    )
  }

  function remove(city: string) {
    onChange(value.filter((item) => item !== city))
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => remove(city)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
                "border-[var(--primary-solid)] bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] hover:opacity-85"
              )}
              aria-label={`Quitar ${city}`}
            >
              {city}
              <span className="text-[13px] leading-none" aria-hidden>
                ×
              </span>
            </button>
          ))}
        </div>
      )}

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="ds-input"
      />

      <div className="flex max-h-48 flex-wrap gap-1.5 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2">
        {worldwideMatches ? (
          <button
            type="button"
            onClick={() => toggle(WORLDWIDE_CITY_LABEL)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[12px] transition-colors font-medium",
              value.includes(WORLDWIDE_CITY_LABEL)
                ? "border-[var(--primary-solid)] bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)]"
                : "border-[var(--pm)] bg-[var(--pl)] text-[var(--p)] hover:opacity-90"
            )}
          >
            {WORLDWIDE_CITY_LABEL}
          </button>
        ) : null}
        {results.length > 0 ? (
          results.map((city) => {
            const selected = value.includes(city)
            return (
              <button
                key={city}
                type="button"
                onClick={() => toggle(city)}
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
        ) : !worldwideMatches ? (
          <p className="px-1 py-1 text-[12px] text-[var(--text3)]">
            No encontramos ciudades con ese texto.
          </p>
        ) : null}
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
