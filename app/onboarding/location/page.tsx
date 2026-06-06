"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Stepper } from "@/components/onboarding/stepper"
import { OnboardingCard } from "@/components/onboarding/onboarding-card"
import { Button } from "@/components/ui/button"
import { CitySelector } from "@/components/ui/city-selector"
import { CitySingleSelect } from "@/components/ui/city-single-select"
import { Field, Input } from "@/components/ui/input"
import { Tag } from "@/components/ui/tag"
import { IconMapPin } from "@/components/icons"
import { ONBOARDING_STEP_COUNT } from "@/lib/onboarding-intent-options"
import {
  persistOnboardingLocationFinish,
  requireUserId,
} from "@/lib/onboarding-persist"
import { userHasProjectIntent, userIsInvestor } from "@/lib/profile-project-guard"
import { DEFAULT_SEARCH_RADIUS_KM } from "@/lib/platform-defaults"
import { reverseGeocodeClient } from "@/lib/reverse-geocode"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

/** Códigos estándar `GeolocationPositionError` (más fiable que propiedades del `err`). */
const GEO_PERMISSION_DENIED = 1
const GEO_POSITION_UNAVAILABLE = 2
const GEO_TIMEOUT = 3

export default function LocationStepPage() {
  const router = useRouter()
  const [city, setCity] = React.useState("")
  const [extraCities, setExtraCities] = React.useState<string[]>([])
  const [radius, setRadius] = React.useState(DEFAULT_SEARCH_RADIUS_KM)
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
        if (err.code === GEO_PERMISSION_DENIED) {
          setGeoHint(
            "Permiso de ubicación denegado. Actívalo en el navegador o escribe tu ciudad."
          )
        } else if (err.code === GEO_POSITION_UNAVAILABLE) {
          setGeoHint("No hay señal de ubicación disponible. Elige manualmente.")
        } else if (err.code === GEO_TIMEOUT) {
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
      <Stepper current={4} total={ONBOARDING_STEP_COUNT} />
      <OnboardingCard
        title="¿Dónde buscas?"
        description="Ciudad y radio para el radar. Sin mostrar tu ubicación exacta."
        back="/onboarding/project"
        next="/onboarding/done"
        nextDisabled={!city.trim()}
        onBeforeNext={async () => {
          const supabase = getSupabaseBrowserClient()
          const uid = await requireUserId(supabase)
          if (!uid) return false
          const { data: row } = await supabase
            .from("profiles")
            .select("onboarding_intent, project_stage, investor_activity")
            .eq("id", uid)
            .maybeSingle()
          if (!row?.onboarding_intent) {
            router.replace("/onboarding/intent")
            return false
          }
          if (
            userHasProjectIntent(row.onboarding_intent) &&
            !row?.project_stage
          ) {
            router.replace("/onboarding/project")
            return false
          }
          if (
            userIsInvestor(row?.onboarding_intent) &&
            !row?.investor_activity
          ) {
            router.replace("/onboarding/project")
            return false
          }
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
          hint="Tu ciudad base. Debe ser una ciudad concreta — aquí no aplica «Todo el mundo»."
        >
          <CitySingleSelect value={city} onChange={setCity} />
        </Field>

        <Field
          label="Ciudades donde mi búsqueda estará activa"
          hint="Opcional. Puedes incluir «Todo el mundo» o varias ciudades de México, Colombia, EE.UU. y LatAm."
        >
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
