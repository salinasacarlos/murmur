"use client"

import * as React from "react"

import { INDUSTRIES_CATALOG } from "@/lib/catalogs"
import { cn } from "@/lib/utils"

interface IndustrySelectorProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  maxVisibleResults?: number
  className?: string
}

export function IndustrySelector({
  value,
  onChange,
  placeholder = "Buscar industria...",
  maxVisibleResults = 12,
  className,
}: IndustrySelectorProps) {
  const [query, setQuery] = React.useState("")
  const normalizedQuery = normalize(query)

  const results = INDUSTRIES_CATALOG.filter((industry) =>
    normalize(industry).includes(normalizedQuery)
  ).slice(0, maxVisibleResults)

  function toggle(industry: string) {
    onChange(
      value.includes(industry)
        ? value.filter((item) => item !== industry)
        : [...value, industry]
    )
  }

  function remove(industry: string) {
    onChange(value.filter((item) => item !== industry))
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((industry) => (
            <button
              key={industry}
              type="button"
              onClick={() => remove(industry)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
                "border-[var(--primary-solid)] bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] hover:opacity-85"
              )}
              aria-label={`Quitar ${industry}`}
            >
              {industry}
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

      <div className="flex max-h-44 flex-wrap gap-1.5 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2">
        {results.length > 0 ? (
          results.map((industry) => {
            const selected = value.includes(industry)
            return (
              <button
                key={industry}
                type="button"
                onClick={() => toggle(industry)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[12px] transition-colors",
                  selected
                    ? "border-[var(--primary-solid)] bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)]"
                    : "border-[var(--border)] bg-[var(--bg)] text-[var(--text2)] hover:border-[var(--border2)] hover:text-[var(--text)]"
                )}
              >
                {industry}
              </button>
            )
          })
        ) : (
          <p className="px-1 py-1 text-[12px] text-[var(--text3)]">
            No encontramos industrias con ese texto.
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
