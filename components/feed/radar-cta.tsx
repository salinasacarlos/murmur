"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Isotipo } from "@/components/brand/isotipo"
import { IconCompass } from "@/components/icons"

interface RadarCTAProps {
  onActivate: () => void | Promise<void>
}

export function RadarCTA({ onActivate }: RadarCTAProps) {
  const [searching, setSearching] = React.useState(false)

  React.useEffect(() => {
    if (!searching) return

    const timeout = window.setTimeout(() => {
      void Promise.resolve(onActivate())
    }, 3800)

    return () => window.clearTimeout(timeout)
  }, [onActivate, searching])

  function startSearch() {
    if (searching) return
    setSearching(true)
  }

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[60vh] px-4 py-10">
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="radar-ring absolute h-32 w-32 rounded-full border-2"
            style={{ borderColor: "var(--pm)" }}
          />
          <span
            className="radar-ring absolute h-32 w-32 rounded-full border-2"
            style={{ borderColor: "var(--pm)", animationDelay: "0.8s" }}
          />
          <span
            className="radar-ring absolute h-32 w-32 rounded-full border-2"
            style={{ borderColor: "var(--pm)", animationDelay: "1.6s" }}
          />
        </div>

        <div
          className="relative flex h-40 w-40 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)]/80 shadow-[0_0_60px_rgba(91,82,212,0.12)]"
          aria-live="polite"
        >
          <div
            className="absolute inset-4 rounded-full border border-[var(--pm)]"
            aria-hidden
          />
          <div
            className="absolute inset-8 rounded-full border border-[var(--pm)]"
            aria-hidden
          />

          {searching && (
            <>
              <span className="radar-sweep" aria-hidden />
              <span className="radar-person radar-person-1" aria-hidden />
              <span className="radar-person radar-person-2" aria-hidden />
              <span className="radar-person radar-person-3" aria-hidden />
              <span className="radar-person radar-person-4" aria-hidden />
            </>
          )}

          <Isotipo
            size={72}
            color="var(--p)"
            className={searching ? "radar-birds-searching" : undefined}
          />
        </div>
      </div>

      <span
        className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text3)] mb-3"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {searching ? "Buscando cerca de ti" : "Scanner inactivo"}
      </span>

      <h2
        className="text-[28px] md:text-[34px] font-extrabold tracking-[-1px] mb-2 max-w-md"
      >
        {searching
          ? "Radar buscando personas cercanas"
          : "Encuentra a las personas correctas para construir"}
      </h2>
      <p className="text-[13px] text-[var(--text2)] max-w-sm leading-relaxed mb-6">
        {searching
          ? "Estamos escaneando perfiles compatibles por ubicación, intereses y disponibilidad."
          : "Activa la búsqueda para ver perfiles que coinciden con lo que buscas. Tu visibilidad sigue siendo tuya."}
      </p>

      <Button
        size="lg"
        onClick={startSearch}
        disabled={searching}
        className="px-6"
      >
        <IconCompass size={14} />
        {searching ? "Buscando..." : "Buscar"}
      </Button>
    </div>
  )
}
