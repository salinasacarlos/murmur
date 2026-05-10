"use client"

import * as React from "react"

import { PublicFieldNotice } from "@/components/murm/public-field-notice"
import { Stepper } from "@/components/onboarding/stepper"
import { OnboardingCard } from "@/components/onboarding/onboarding-card"
import { Button } from "@/components/ui/button"
import { CitySelector } from "@/components/ui/city-selector"
import { Field, Input } from "@/components/ui/input"
import { Tag } from "@/components/ui/tag"
import { IconMapPin } from "@/components/icons"
import { CITIES_CATALOG } from "@/lib/mock-data"

export default function LocationStepPage() {
  const [city, setCity] = React.useState("")
  const [extraCities, setExtraCities] = React.useState<string[]>([])
  const [radius, setRadius] = React.useState(50)

  return (
    <div className="flex flex-col gap-4">
      <Stepper current={6} total={7} />
      <OnboardingCard
        title="¿Dónde estás?"
        description="Ciudad y radio; nunca mostramos tu ubicación exacta."
        back="/onboarding/project"
        next="/onboarding/done"
      >
        <Button variant="brand" size="lg" className="justify-center">
          <IconMapPin size={14} />
          Detectar mi ubicación
        </Button>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-[10px] uppercase tracking-[0.07em] font-semibold text-[var(--text3)]">
            o seleccionar manual
          </span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        <Field label="Ciudad principal" required>
          <PublicFieldNotice className="mb-1" compact />
          <Input
            placeholder="ej. Ciudad de México"
            list="cities-list"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <datalist id="cities-list">
            {CITIES_CATALOG.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>

        <Field
          label="Ciudades donde mi búsqueda estará activa"
          hint="Opcional. Puedes seleccionar varias ciudades de México, Colombia, EE.UU. y LatAm."
        >
          <PublicFieldNotice className="mb-1" compact />
          <CitySelector value={extraCities} onChange={setExtraCities} />
        </Field>

        <Field label="Radio de búsqueda" hint={`${radius} km alrededor`}>
          <input
            type="range"
            min="5"
            max="200"
            step="5"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full accent-[var(--p)]"
          />
        </Field>

        <div className="flex items-center gap-2 mt-1">
          <Tag variant="brand">Privacidad por default</Tag>
          <span className="text-[11px] text-[var(--text3)]">
            Estarás oculto hasta que decidas activarte.
          </span>
        </div>
      </OnboardingCard>
    </div>
  )
}
