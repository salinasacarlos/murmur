"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerHeader } from "@/components/ui/drawer"
import { ExpertiseMultiSelect } from "@/components/ui/expertise-multi-select"
import { IndustrySingleSelect } from "@/components/ui/industry-single-select"
import { TalentMultiSelect } from "@/components/ui/talent-multi-select"
import { Field, Input } from "@/components/ui/input"
import {
  emptyDiscoverFeedFilters,
  type DiscoverFeedFilters,
} from "@/lib/feed-filters"
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
}

export function FiltersDrawer({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
}: FiltersDrawerProps) {
  function setIndustry(slug: string | null) {
    onFiltersChange({
      ...filters,
      primaryIndustrySlug: slug,
      expertiseSlugs: slug !== filters.primaryIndustrySlug ? [] : filters.expertiseSlugs,
    })
  }

  function clear() {
    onFiltersChange(emptyDiscoverFeedFilters())
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} ariaLabel="Filtros">
      <DrawerHeader
        title="Filtros"
        description="Misma taxonomía que el perfil: industria de referencia, expertise y talentos."
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
          label="Industria de referencia"
          hint="Como «Industria principal» en el perfil. «Cualquiera» no filtra por sector."
        >
          <IndustrySingleSelect
            allowClear
            value={filters.primaryIndustrySlug}
            onChange={setIndustry}
          />
        </Field>

        <Field
          label="Expertise"
          hint="Opcional: al menos una coincidencia con las especialidades del perfil."
        >
          <ExpertiseMultiSelect
            industrySlug={filters.primaryIndustrySlug}
            value={filters.expertiseSlugs}
            onChange={(slugs) =>
              onFiltersChange({ ...filters, expertiseSlugs: slugs })
            }
            footerNote="Elige primero una industria arriba para ver opciones del mismo catálogo que en tu perfil."
          />
        </Field>

        <Field
          label="Talentos"
          hint="Opcional: al menos un talento en común con el perfil."
        >
          <TalentMultiSelect
            value={filters.talentSlugs}
            onChange={(slugs) =>
              onFiltersChange({ ...filters, talentSlugs: slugs })
            }
          />
        </Field>
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
