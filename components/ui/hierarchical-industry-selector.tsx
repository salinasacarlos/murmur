"use client"

import * as React from "react"

import {
  DEFAULT_INDUSTRY_DOMAIN_SLUG,
  domainSlugForLeafLabel,
  INDUSTRY_DOMAINS,
  leavesForDomain,
} from "@/lib/industry-tree"
import { cn } from "@/lib/utils"

interface HierarchicalIndustrySelectorProps {
  value: string[]
  onChange: (value: string[]) => void
  /** Fires when the browse domain changes (for role suggestions, etc.). */
  onActiveDomainChange?: (domainSlug: string) => void
  className?: string
}

export function HierarchicalIndustrySelector({
  value,
  onChange,
  onActiveDomainChange,
  className,
}: HierarchicalIndustrySelectorProps) {
  const [activeDomain, setActiveDomain] = React.useState<string>(() => {
    const first = value[0]
    if (first) return domainSlugForLeafLabel(first) ?? DEFAULT_INDUSTRY_DOMAIN_SLUG
    return DEFAULT_INDUSTRY_DOMAIN_SLUG
  })
  const [query, setQuery] = React.useState("")

  React.useEffect(() => {
    onActiveDomainChange?.(activeDomain)
  }, [activeDomain, onActiveDomainChange])

  const leaves = leavesForDomain(activeDomain)
  const normalizedQuery = normalize(query)
  const filteredLeaves = leaves.filter((l) =>
    normalize(l.label).includes(normalizedQuery)
  )

  function setDomain(slug: string) {
    setActiveDomain(slug)
    setQuery("")
  }

  function toggle(label: string) {
    onChange(
      value.includes(label)
        ? value.filter((item) => item !== label)
        : [...value, label]
    )
  }

  function remove(label: string) {
    onChange(value.filter((item) => item !== label))
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div>
        <p className="text-[11px] uppercase tracking-wide text-[var(--text3)] mb-1.5">
          Ámbito
        </p>
        <div className="flex flex-wrap gap-1.5">
          {INDUSTRY_DOMAINS.map((d) => (
            <button
              key={d.slug}
              type="button"
              onClick={() => setDomain(d.slug)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors max-w-full text-left",
                activeDomain === d.slug
                  ? "border-[var(--primary-solid)] bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)]"
                  : "border-[var(--border)] bg-[var(--bg)] text-[var(--text2)] hover:border-[var(--border2)] hover:text-[var(--text)]"
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {value.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-wide text-[var(--text3)] mb-1.5">
            Seleccionadas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {value.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => remove(label)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
                  "border-[var(--primary-solid)] bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] hover:opacity-85"
                )}
                aria-label={`Quitar ${label}`}
              >
                {label}
                <span className="text-[13px] leading-none" aria-hidden>
                  ×
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-[11px] uppercase tracking-wide text-[var(--text3)] mb-1.5">
          Subindustrias en este ámbito
        </p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar en este ámbito…"
          className="ds-input mb-2"
        />
        <div className="flex max-h-44 flex-wrap gap-1.5 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2">
          {filteredLeaves.length > 0 ? (
            filteredLeaves.map((leaf) => {
              const selected = value.includes(leaf.label)
              return (
                <button
                  key={leaf.slug}
                  type="button"
                  onClick={() => toggle(leaf.label)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[12px] transition-colors",
                    selected
                      ? "border-[var(--primary-solid)] bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)]"
                      : "border-[var(--border)] bg-[var(--bg)] text-[var(--text2)] hover:border-[var(--border2)] hover:text-[var(--text)]"
                  )}
                >
                  {leaf.label}
                </button>
              )
            })
          ) : (
            <p className="px-1 py-1 text-[12px] text-[var(--text3)]">
              No hay coincidencias en este ámbito.
            </p>
          )}
        </div>
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
