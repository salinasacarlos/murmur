"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerHeader } from "@/components/ui/drawer"
import { ExpertiseMultiSelect } from "@/components/ui/expertise-multi-select"
import { VerticalMultiSelect } from "@/components/ui/vertical-multi-select"
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
  /** Filtro por soft skills solo en Premium. */
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
      verticalSlugs: industryChanged ? [] : filters.verticalSlugs,
      expertiseSlugs: industryChanged ? [] : filters.expertiseSlugs,
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
            : "Plan Free: ciudad, disponibilidad, relación, industria, verticales y expertise. Filtro por soft skills en Premium."
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
          <VerticalMultiSelect
            industrySlug={filters.primaryIndustrySlug}
            value={filters.verticalSlugs}
            onChange={(slugs) =>
              onFiltersChange({
                ...filters,
                verticalSlugs: slugs,
                expertiseSlugs: [],
              })
            }
          />
        </Field>

        <Field
          label={PROFILE_FIELD_COPY.expertise}
          hint={PROFILE_FIELD_HINTS.expertiseFilterFeed}
        >
          <ExpertiseMultiSelect
            industrySlug={filters.primaryIndustrySlug}
            verticalSlugs={filters.verticalSlugs}
            value={filters.expertiseSlugs}
            onChange={(slugs) =>
              onFiltersChange({ ...filters, expertiseSlugs: slugs })
            }
            footerNote="Elige primero industria y verticales; mismo catálogo que tu perfil."
          />
        </Field>

        {isPremium ? (
          <Field
            label={PROFILE_FIELD_COPY.softSkills}
            hint={PROFILE_FIELD_HINTS.softSkillsFilterFeed}
          >
            <TalentMultiSelect
              value={filters.talentSlugs}
              onChange={(slugs) =>
                onFiltersChange({ ...filters, talentSlugs: slugs })
              }
            />
          </Field>
        ) : (
          <p className="text-[11px] text-[var(--text3)] leading-snug">
            Filtro por {PROFILE_FIELD_COPY.softSkills.toLowerCase()} en Descubrir está disponible con Premium.
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
