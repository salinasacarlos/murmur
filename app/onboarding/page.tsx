"use client"

import * as React from "react"
import Link from "next/link"

import { MurmVoice } from "@/components/murm/murm-voice"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function OnboardingWelcomePage() {
  return (
    <Card padding="none" className="bg-[var(--bg)] p-6 md:p-8">
      <MurmVoice step="welcome" className="mb-5">
        <ul className="mt-3 list-inside list-disc space-y-2 text-[13px] text-[var(--text)]">
          <li>
            <strong className="font-semibold">Descubrir con propósito:</strong>{" "}
            perfiles que encajan con lo que buscas, no scroll infinito sin
            contexto.
          </li>
          <li>
            <strong className="font-semibold">Tu visibilidad, tú decides:</strong>{" "}
            empiezas en calma; tú eliges cuándo aparecer para otros.
          </li>
          <li>
            <strong className="font-semibold">Conexiones con historia:</strong>{" "}
            cada solicitud lleva contexto — no mensajes en frío anónimos.
          </li>
        </ul>
      </MurmVoice>

      <p className="text-[13px] text-[var(--text2)] leading-relaxed mb-6">
        En unos minutos tendrás un perfil mínimo para entrar al feed. Lo demás
        podrás completarlo después; Murm te irá recordando lo que sube la
        calidad de tus matches.
      </p>

      <Link href="/onboarding/event" className="block">
        <Button size="lg" className="w-full justify-center">
          Empezar con Murm
        </Button>
      </Link>
    </Card>
  )
}
