"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { MurmVoice } from "@/components/murm/murm-voice"
import { Stepper } from "@/components/onboarding/stepper"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Field, Input } from "@/components/ui/input"
import { IconArrowLeft } from "@/components/icons"
import {
  EVENT_CODE_LENGTH,
  PENDING_EVENT_STORAGE_KEY,
} from "@/lib/murmur-onboarding"
import { findEventByCode } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type Phase = "choose" | "code"

function clearPendingEvent() {
  try {
    localStorage.removeItem(PENDING_EVENT_STORAGE_KEY)
  } catch {
    // ignore
  }
}

function savePendingEvent(code: string, name: string) {
  try {
    localStorage.setItem(
      PENDING_EVENT_STORAGE_KEY,
      JSON.stringify({ code, name })
    )
  } catch {
    // ignore
  }
}

export default function OnboardingEventPage() {
  const router = useRouter()
  const [phase, setPhase] = React.useState<Phase>("choose")
  const [code, setCode] = React.useState("")

  const normalized = code
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, EVENT_CODE_LENGTH)

  const matched =
    normalized.length === EVENT_CODE_LENGTH
      ? findEventByCode(normalized)
      : undefined

  function goRoleWithoutEvent() {
    clearPendingEvent()
    router.push("/onboarding/role")
  }

  function goRoleWithEvent() {
    if (!matched) return
    savePendingEvent(matched.code, matched.name)
    router.push("/onboarding/role")
  }

  if (phase === "choose") {
    return (
      <div className="flex flex-col gap-4">
        <Stepper current={1} total={7} />
        <Card padding="none" className="bg-[var(--bg)] p-6 md:p-8">
          <MurmVoice step="event" className="mb-5" />
          <h1 className="text-[20px] font-extrabold tracking-[-0.4px] mb-1.5">
            ¿Viene de un evento?
          </h1>
          <p className="text-[13px] text-[var(--text2)] mb-6 leading-relaxed">
            Si tienes un código (en pantalla o en tu invitación), podemos anclar
            tu experiencia a esa sala. Si no, lo puedes agregar después desde el
            feed o tu perfil.
          </p>

          <div className="flex flex-col gap-2.5 mb-6">
            <Button
              size="lg"
              className="w-full justify-center"
              onClick={() => setPhase("code")}
            >
              Sí, tengo código
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full justify-center"
              onClick={goRoleWithoutEvent}
            >
              No por ahora
            </Button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Link href="/onboarding">
              <Button variant="ghost" size="md">
                <IconArrowLeft size={14} />
                Atrás
              </Button>
            </Link>
            <span />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Stepper current={1} total={7} />
      <Card padding="none" className="bg-[var(--bg)] p-6 md:p-8">
        <MurmVoice step="event" className="mb-5" />
        <h1 className="text-[20px] font-extrabold tracking-[-0.4px] mb-1.5">
          Código del evento
        </h1>
        <p className="text-[13px] text-[var(--text2)] mb-6 leading-relaxed">
          La palabra correcta abre la sala correcta.{" "}
          <button
            type="button"
            className="font-medium text-[var(--p)] hover:underline"
            onClick={() => {
              setPhase("choose")
              setCode("")
            }}
          >
            Cambiar: vine sin evento
          </button>
        </p>

        <Field
          label="Código"
          hint={`${EVENT_CODE_LENGTH} caracteres. Prueba: BLDR26, LATAM7, MTYDEV.`}
        >
          <Input
            value={normalized}
            onChange={(e) =>
              setCode(
                e.target.value
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .toUpperCase()
                  .slice(0, EVENT_CODE_LENGTH)
              )
            }
            placeholder="XXXXXX"
            className="font-mono uppercase tracking-widest"
            maxLength={EVENT_CODE_LENGTH}
            autoComplete="off"
            spellCheck={false}
          />
        </Field>

        {matched ? (
          <div
            className={cn(
              "mt-3 rounded-lg border border-[var(--pm)] bg-[var(--pl)] px-3 py-2 text-[12px] text-[var(--text)]"
            )}
          >
            <span className="font-semibold text-[var(--p)]">{matched.code}</span>
            {" · "}
            {matched.name}
            {matched.description ? (
              <p className="mt-1 text-[11px] text-[var(--text2)]">
                {matched.description}
              </p>
            ) : null}
          </div>
        ) : normalized.length === EVENT_CODE_LENGTH ? (
          <p className="mt-3 text-[12px] text-[var(--red)]">
            No encontramos un evento con ese código. Revisa con el organizador o
            continúa sin evento.
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="md"
            onClick={() => {
              setPhase("choose")
              setCode("")
            }}
          >
            <IconArrowLeft size={14} />
            Atrás
          </Button>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="secondary" size="md" onClick={goRoleWithoutEvent}>
              Omitir evento
            </Button>
            <Button
              size="lg"
              disabled={!matched}
              onClick={goRoleWithEvent}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
