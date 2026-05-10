"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerHeader } from "@/components/ui/drawer"
import { HierarchicalIndustrySelector } from "@/components/ui/hierarchical-industry-selector"
import { Field, Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  AREA_LABELS,
  AVAILABILITY_LABELS,
  RELATION_LABELS,
  type Availability,
  type FunctionalArea,
  type RelationType,
} from "@/lib/types"

interface FiltersDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FiltersDrawer({ open, onOpenChange }: FiltersDrawerProps) {
  const [city, setCity] = React.useState("")
  const [availability, setAvailability] = React.useState<Availability | null>(
    null
  )
  const [area, setArea] = React.useState<FunctionalArea | null>(null)
  const [relation, setRelation] = React.useState<RelationType | null>(null)
  const [industries, setIndustries] = React.useState<string[]>([])

  function clear() {
    setCity("")
    setAvailability(null)
    setArea(null)
    setRelation(null)
    setIndustries([])
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} ariaLabel="Filtros">
      <DrawerHeader
        title="Filtros"
        description="Refina los resultados de la búsqueda activa."
      />

      <div className="flex flex-col gap-4 mb-4">
        <Field label="Ciudad / región">
          <Input
            placeholder="ej. Ciudad de México"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Field>

        <Field label="Disponibilidad">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(AVAILABILITY_LABELS) as Availability[]).map((id) => (
              <FilterChip
                key={id}
                label={AVAILABILITY_LABELS[id]}
                selected={availability === id}
                onClick={() => setAvailability(availability === id ? null : id)}
              />
            ))}
          </div>
        </Field>

        <Field label="Área funcional">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(AREA_LABELS) as FunctionalArea[]).map((id) => (
              <FilterChip
                key={id}
                label={AREA_LABELS[id]}
                selected={area === id}
                onClick={() => setArea(area === id ? null : id)}
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
                selected={relation === id}
                onClick={() => setRelation(relation === id ? null : id)}
              />
            ))}
          </div>
        </Field>

        <Field label="Industrias">
          <HierarchicalIndustrySelector
            value={industries}
            onChange={setIndustries}
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
