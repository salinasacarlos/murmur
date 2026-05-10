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
import { CITIES_CATALOG } from "@/lib/catalogs"
import {
  persistOnboardingLocationFinish,
  requireUserId,
} from "@/lib/onboarding-persist"
import { reverseGeocodeClient } from "@/lib/reverse-geocode"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function LocationStepPage() {
  const [city, setCity] = React.useState("")
  const [extraCities, setExtraCities] = React.useState<string[]>([])
  const [radius, setRadius] = React.useState(50)
  const [geoBusy, setGeoBusy] = React.useState(false)
  const [geoHint, setGeoHint] = React.useState<string | null>(null)

  async function detectLocation() {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGeoHint(
        "Tu navegador no permite geolocalización en este dispositivo. Elige la ciudad a mano."
      )
      return
    }

    setGeoBusy(true)
    setGeoHint(null)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const rev = await reverseGeocodeClient(
            pos.coords.latitude,
            pos.coords.longitude
          )
          if (!rev?.cityLabel) {
            setGeoHint("No pudimos obtener la ciudad. Escríbela o elige del listado.")
            setGeoBusy(false)
            return
          }
          const primary = rev.cityLabel.split("·")[0]?.trim() ?? rev.cityLabel
          setCity(primary)
          setExtraCities((prev) =>
            prev.includes(primary) ? prev : [primary, ...prev]
          )
          setGeoHint("Listo: revisa la ciudad y el radio antes de continuar.")
        } catch {
          setGeoHint("Error al buscar la dirección. Inténtalo de nuevo o elige manual.")
        } finally {
          setGeoBusy(false)
        }
      },
      (err) => {
        setGeoBusy(false)
        if (err.code === err.PERMISSION_DENIED) {
          setGeoHint(
            "Permiso de ubicación denegado. Actívalo en el navegador o escribe tu ciudad."
          )
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGeoHint("No hay señal de ubicación disponible. Elige manualmente.")
        } else if (err.code === err.TIMEOUT) {
          setGeoHint("Tiempo agotado al obtener ubicación. Intenta de nuevo.")
        } else {
          setGeoHint("No pudimos leer tu ubicación.")
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 25_000,
        maximumAge: 0,
      }
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Stepper current={5} total={6} />
      <OnboardingCard
        title="¿Dónde estás?"
        description="Ciudad y radio; nunca mostramos tu ubicación exacta."
        back="/onboarding/profile"
        next="/onboarding/done"
        nextDisabled={!city.trim()}
        onBeforeNext={async () => {
          const supabase = getSupabaseBrowserClient()
          const uid = await requireUserId(supabase)
          if (!uid) return false
          const r = await persistOnboardingLocationFinish(supabase, uid, {
            primaryCity: city,
            activeCities: extraCities,
            searchRadiusKm: radius,
          })
          if (!r.ok) {
            console.error(r.error)
            return false
          }
        }}
      >
        <div className="flex flex-col gap-2">
          <Button
            variant="brand"
            size="lg"
            className="justify-center"
            type="button"
            disabled={geoBusy}
            onClick={() => void detectLocation()}
          >
            <IconMapPin size={14} />
            {geoBusy ? "Obteniendo ubicación…" : "Detectar mi ubicación"}
          </Button>
          <p className="text-[11px] text-[var(--text3)] leading-snug">
            El navegador te pedirá permiso para ubicación aproximada; luego
            rellenamos la ciudad (puedes editarla). No compartimos coordenadas
            exactas.
          </p>
          {geoHint ? (
            <p className="text-[12px] text-[var(--text2)]">{geoHint}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-[10px] uppercase tracking-[0.07em] font-semibold text-[var(--text3)]">
            o seleccionar manual
          </span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        <Field
          label="Ciudad principal"
          required
          hint="Escribe o elige del listado. También puedes usar «Todo el mundo» si no aplica una ciudad fija."
        >
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
          hint="Opcional. Incluye «Todo el mundo» si no quieres limitar por ciudad. También puedes elegir ciudades en México, Colombia, EE.UU. y LatAm."
        >
          <PublicFieldNotice className="mb-1" compact />
          <CitySelector value={extraCities} onChange={setExtraCities} />
        </Field>

        <Field label="Radio de búsqueda" hint={`${radius} km alrededor`}>
          <input
            type="range"
            min="5"
            max="300"
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
