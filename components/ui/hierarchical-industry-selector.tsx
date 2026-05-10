"use client"

import * as React from "react"

import {
  leavesForProfileIndustry,
  profileIndustrySlugForLeafLabel,
} from "@/lib/industry-tree"
import { INDUSTRIES } from "@/lib/profile-taxonomy"
import { cn } from "@/lib/utils"

interface HierarchicalIndustrySelectorProps {
  value: string[]
  onChange: (value: string[]) => void
  /**
   * Modo enlazado (p. ej. onboarding): no muestra otra fila de industrias;
   * las verticales son solo las de `linkedPrimaryIndustrySlug`.
   * `null` = aún no hay industria elegida arriba.
   */
  linkedPrimaryIndustrySlug?: string | null
  /** Solo en modo libre: avisa cuando cambia la industria activa en los chips. */
  onActiveProfileIndustryChange?: (profileIndustrySlug: string) => void
  className?: string
}

export function HierarchicalIndustrySelector({
  value,
  onChange,
  linkedPrimaryIndustrySlug,
  onActiveProfileIndustryChange,
  className,
}: HierarchicalIndustrySelectorProps) {
  /** `true` cuando el padre enlaza la industria (onboarding); entonces `null` es “sin industria”, no “usar browse”. */
  const isLinkedMode = linkedPrimaryIndustrySlug !== undefined

  const [browseIndustrySlug, setBrowseIndustrySlug] = React.useState<
    string | null
  >(() => {
    if (linkedPrimaryIndustrySlug !== undefined) return null
    const first = value[0]
    if (first) return profileIndustrySlugForLeafLabel(first) ?? null
    return null
  })
  const [query, setQuery] = React.useState("")

  const activeSlug = isLinkedMode
    ? linkedPrimaryIndustrySlug
    : browseIndustrySlug

  React.useEffect(() => {
    if (isLinkedMode || !browseIndustrySlug) return
    onActiveProfileIndustryChange?.(browseIndustrySlug)
  }, [
    browseIndustrySlug,
    isLinkedMode,
    onActiveProfileIndustryChange,
  ])

  const leaves = activeSlug ? leavesForProfileIndustry(activeSlug) : []
  const normalizedQuery = normalize(query)
  const filteredLeaves = leaves.filter((l) =>
    normalize(l.label).includes(normalizedQuery)
  )

  function setIndustry(slug: string) {
    setBrowseIndustrySlug(slug)
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

  const showIndustryRow = !isLinkedMode

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {showIndustryRow ? (
        <div>
          <p className="text-[11px] uppercase tracking-wide text-[var(--text3)] mb-1.5">
            Industria
          </p>
          <div className="flex flex-wrap gap-1.5">
            {INDUSTRIES.map((d) => (
              <button
                key={d.slug}
                type="button"
                onClick={() => setIndustry(d.slug)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors max-w-full text-left",
                  browseIndustrySlug === d.slug
                    ? "border-[var(--primary-solid)] bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)]"
                    : "border-[var(--border)] bg-[var(--bg)] text-[var(--text2)] hover:border-[var(--border2)] hover:text-[var(--text)]"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      ) : linkedPrimaryIndustrySlug === null ? (
        <p className="text-[12px] text-[var(--text3)] leading-snug">
          Elige tu industria arriba para ver verticales de afinidad en ese mismo
          sector.
        </p>
      ) : null}

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

      {activeSlug ? (
        <div>
          <p className="text-[11px] uppercase tracking-wide text-[var(--text3)] mb-1.5">
            {isLinkedMode
              ? "Verticales de afinidad"
              : "Verticales en esta industria"}
          </p>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar verticales…"
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
                No hay coincidencias.
              </p>
            )}
          </div>
        </div>
      ) : showIndustryRow ? (
        <p className="text-[12px] text-[var(--text3)] leading-snug">
          Selecciona una industria para explorar verticales de afinidad.
        </p>
      ) : null}
    </div>
  )
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}
