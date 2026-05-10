"use client"

import * as React from "react"

import {
  expertiseListForIndustryVerticals,
  labelExpertiseSlug,
} from "@/lib/profile-taxonomy"
import { cn } from "@/lib/utils"

const MAX = 5

interface ExpertiseMultiSelectProps {
  /** Industria elegida; sin industria no hay opciones filtradas. */
  industrySlug: string | null
  /** Verticales (nivel 2); la unión define el catálogo de expertise. */
  verticalSlugs: string[]
  value: string[]
  onChange: (slugs: string[]) => void
  className?: string
  footerNote?: string
}

export function ExpertiseMultiSelect({
  industrySlug,
  verticalSlugs,
  value,
  onChange,
  className,
  footerNote = `Máximo ${MAX} expertise bajo las verticales elegidas.`,
}: ExpertiseMultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const rootRef = React.useRef<HTMLDivElement>(null)

  const options = React.useMemo(
    () =>
      industrySlug && verticalSlugs.length > 0
        ? [...expertiseListForIndustryVerticals(industrySlug, verticalSlugs)]
        : [],
    [industrySlug, verticalSlugs]
  )

  const onChangeRef = React.useRef(onChange)
  onChangeRef.current = onChange

  React.useEffect(() => {
    if (!industrySlug || verticalSlugs.length === 0) {
      if (value.length > 0) onChangeRef.current([])
      return
    }
    const allowed = new Set(
      expertiseListForIndustryVerticals(industrySlug, verticalSlugs).map(
        (o) => o.slug
      )
    )
    const kept = value.filter((s) => allowed.has(s))
    if (kept.length !== value.length) {
      onChangeRef.current(kept)
    }
  }, [industrySlug, verticalSlugs, value])

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [])

  const q = query
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
  const filtered = options.filter((o) => {
    if (!q) return true
    const t = o.label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
    return t.includes(q)
  })

  function toggle(slug: string) {
    if (value.includes(slug)) {
      onChange(value.filter((s) => s !== slug))
      return
    }
    if (value.length >= MAX) return
    onChange([...value, slug])
  }

  function remove(slug: string) {
    onChange(value.filter((s) => s !== slug))
  }

  if (!industrySlug) {
    return (
      <p className="text-[13px] text-[var(--text3)] py-2">
        Primero elige una industria.
      </p>
    )
  }

  if (verticalSlugs.length === 0) {
    return (
      <p className="text-[13px] text-[var(--text3)] py-2">
        Elige verticales primero.
      </p>
    )
  }

  if (options.length === 0) {
    return (
      <p className="text-[13px] text-[var(--text3)] py-2">
        No hay expertise definido para esta combinación de verticales.
      </p>
    )
  }

  return (
    <div ref={rootRef} className={cn("relative flex flex-col gap-2", className)}>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((slug) => (
            <button
              key={slug}
              type="button"
              onClick={() => remove(slug)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
                "border-[var(--primary-solid)] bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] hover:opacity-85"
              )}
              aria-label={`Quitar ${labelExpertiseSlug(slug)}`}
            >
              {labelExpertiseSlug(slug)}
              <span className="text-[13px] leading-none" aria-hidden>
                ×
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "ds-input w-full text-left flex items-center justify-between gap-2",
            "text-[13px] text-[var(--text2)]"
          )}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span>
            {value.length === 0
              ? `Elige hasta ${MAX} expertise…`
              : `${value.length} de ${MAX} seleccionados`}
          </span>
          <span className="text-[var(--text3)]" aria-hidden>
            {open ? "▴" : "▾"}
          </span>
        </button>

        {open ? (
          <div
            className="absolute z-50 mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] shadow-lg max-h-[min(280px,50dvh)] md:max-h-[min(520px,65dvh)] flex flex-col"
            role="listbox"
          >
            <div className="p-2 border-b border-[var(--border)]">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar…"
                className="ds-input py-1.5 text-[13px]"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <ul className="overflow-y-auto p-1.5 flex flex-col gap-0.5">
              {filtered.map((o) => {
                const selected = value.includes(o.slug)
                const disabled = !selected && value.length >= MAX
                return (
                  <li key={o.slug}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      disabled={disabled}
                      onClick={() => toggle(o.slug)}
                      className={cn(
                        "w-full text-left rounded-md px-2.5 py-2 text-[12px] transition-colors",
                        selected
                          ? "bg-[var(--pl)] text-[var(--text)] font-medium"
                          : disabled
                            ? "text-[var(--text3)] cursor-not-allowed opacity-60"
                            : "text-[var(--text2)] hover:bg-[var(--bg2)]"
                      )}
                    >
                      {o.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}
      </div>

      <p className="text-[11px] text-[var(--text3)]">{footerNote}</p>
    </div>
  )
}
