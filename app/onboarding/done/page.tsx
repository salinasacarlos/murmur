"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { FirstActionsCard } from "@/components/onboarding/first-actions-card"
import { MurmVoice } from "@/components/murm/murm-voice"
import type { FirstActionsProgress } from "@/lib/first-actions"

const EMPTY_PROGRESS: FirstActionsProgress = {
  visibility: false,
  search: false,
  radar: false,
}

export default function OnboardingDonePage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center mb-1">
        <h1 className="text-[22px] font-extrabold tracking-[-0.4px] mb-1">
          Perfil listo
        </h1>
        <p className="text-[13px] text-[var(--text2)] leading-relaxed">
          Tres pasos más y empiezas a conectar en Murmur.
        </p>
      </div>

      <MurmVoice step="first-actions" />

      <FirstActionsCard progress={EMPTY_PROGRESS} variant="onboarding" />

      <div className="flex flex-col gap-2 pt-1">
        <Link href="/feed">
          <Button size="lg" className="w-full justify-center">
            Ir a Descubrir
          </Button>
        </Link>
        <Link href="/searches/new">
          <Button variant="secondary" size="lg" className="w-full justify-center">
            Crear mi primera búsqueda
          </Button>
        </Link>
      </div>

      <p className="text-[11px] text-center text-[var(--text3)] leading-relaxed px-2">
        En la beta recibes códigos para invitar. ¿En un evento? Usa{" "}
        <strong className="text-[var(--text2)]">Evento</strong> en Descubrir.
      </p>
    </div>
  )
}
