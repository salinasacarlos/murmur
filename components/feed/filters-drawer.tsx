"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerHeader } from "@/components/ui/drawer"
import { ExpertiseMultiSelect } from "@/components/ui/expertise-multi-select"
import { HierarchicalIndustrySelector } from "@/components/ui/hierarchical-industry-selector"
import { IndustrySingleSelect } from "@/components/ui/industry-single-select"
import { TalentMultiSelect } from "@/components/ui/talent-multi-select"
import { Field, Input } from "@/components/ui/input"
import {
  emptyDiscoverFeedFilters,
  type DiscoverFeedFilters,
} from "@/lib/feed-filters"
import {
  PROFILE_FIELD_COPY,
  PROFILE_FIELD_HINTS,
} from "@/lib/profile-field-copy"
import { cn } from "@/lib/utils"
import {
  AVAILABILITY_LABELS,
  RELATION_LABELS,
  type Availability,
  type RelationType,
} from "@/lib/types"

interface FiltersDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: DiscoverFeedFilters
  onFiltersChange: (next: DiscoverFeedFilters) => void
  /** Filtros avanzados (afinidad, talentos) solo en Premium. */
  isPremium: boolean
}

export function FiltersDrawer({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  isPremium,
}: FiltersDrawerProps) {
  function setIndustry(slug: string | null) {
    const industryChanged = slug !== filters.primaryIndustrySlug
    onFiltersChange({
      ...filters,
      primaryIndustrySlug: slug,
      expertiseSlugs: industryChanged ? [] : filters.expertiseSlugs,
      affinityLabels: industryChanged ? [] : filters.affinityLabels,
    })
  }

  function clear() {
    onFiltersChange(emptyDiscoverFeedFilters())
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} ariaLabel="Filtros">
      <DrawerHeader
        title="Filtros"
        description={
          isPremium
            ? PROFILE_FIELD_HINTS.feedDrawerIntro
            : "Plan Free: ciudad, disponibilidad, relación, industria y verticales de foco. Afinidad y talentos en Premium."
        }
      />

      <div className="flex flex-col gap-4 mb-4">
        <Field label="Ciudad / región">
          <Input
            placeholder="ej. Ciudad de México"
            value={filters.city}
            onChange={(e) =>
              onFiltersChange({ ...filters, city: e.target.value })
            }
          />
        </Field>

        <Field label="Disponibilidad">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(AVAILABILITY_LABELS) as Availability[]).map((id) => (
              <FilterChip
                key={id}
                label={AVAILABILITY_LABELS[id]}
                selected={filters.availability === id}
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    availability: filters.availability === id ? null : id,
                  })
                }
              />
            ))}
          </div>
        </Field>

        <Field label="Tipo de relación">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(RELATION_LABELS) as RelationType[]).map((id) => (
              <FilterChip
                key={id}
                label={RELATION_LABELS[id]}
                selected={filters.relation === id}
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    relation: filters.relation === id ? null : id,
                  })
                }
              />
            ))}
          </div>
        </Field>

        <Field
          label={PROFILE_FIELD_COPY.industryPrincipal}
          hint={PROFILE_FIELD_HINTS.industryFilterFeed}
        >
          <IndustrySingleSelect
            allowClear
            value={filters.primaryIndustrySlug}
            onChange={setIndustry}
          />
        </Field>

        <Field
          label={PROFILE_FIELD_COPY.verticales}
          hint={PROFILE_FIELD_HINTS.verticalesFilterFeed}
        >
          <ExpertiseMultiSelect
            industrySlug={filters.primaryIndustrySlug}
            value={filters.expertiseSlugs}
            onChange={(slugs) =>
              onFiltersChange({ ...filters, expertiseSlugs: slugs })
            }
            footerNote="Elige primero una industria arriba; mismo catálogo que tus Verticales en el perfil."
          />
        </Field>

        {isPremium ? (
          <>
            <Field
              label={PROFILE_FIELD_COPY.verticalesAfinidad}
              hint={PROFILE_FIELD_HINTS.verticalesAfinidadFilterFeed}
            >
              <div className="max-h-[min(52vh,400px)] overflow-y-auto pr-1">
                <HierarchicalIndustrySelector
                  value={filters.affinityLabels}
                  onChange={(labels) =>
                    onFiltersChange({ ...filters, affinityLabels: labels })
                  }
                />
              </div>
            </Field>

            <Field
              label={PROFILE_FIELD_COPY.talentos}
              hint={PROFILE_FIELD_HINTS.talentosFilterFeed}
            >
              <TalentMultiSelect
                value={filters.talentSlugs}
                onChange={(slugs) =>
                  onFiltersChange({ ...filters, talentSlugs: slugs })
                }
              />
            </Field>
          </>
        ) : (
          <p className="text-[11px] text-[var(--text3)] leading-snug">
            {PROFILE_FIELD_COPY.verticalesAfinidad} y {PROFILE_FIELD_COPY.talentos}{" "}
            en filtros están disponibles con Premium.
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="lg"
          className="flex-1 justify-center"
          onClick={clear}
        >
          Limpiar
        </Button>
        <Button
          size="lg"
          className="flex-1 justify-center"
          onClick={() => onOpenChange(false)}
        >
          Aplicar
        </Button>
      </div>
    </Drawer>
  )
}

function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded-full text-[12px] border transition-colors",
        selected
          ? "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] border-[var(--primary-solid)]"
          : "bg-[var(--bg)] text-[var(--text2)] border-[var(--border)] hover:border-[var(--border2)] hover:text-[var(--text)]"
      )}
    >
      {label}
    </button>
  )
}
