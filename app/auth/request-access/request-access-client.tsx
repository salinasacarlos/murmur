"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Field, Input, Textarea } from "@/components/ui/input"
import { getPublicSiteUrl } from "@/lib/public-site-url"
import { PROJECT_STAGE_OPTIONS } from "@/lib/project-stage"
import type { ProjectStage } from "@/lib/types"
import { cn } from "@/lib/utils"

type Phase = "form" | "done"

export function RequestAccessClient() {
  const [phase, setPhase] = React.useState<Phase>("form")
  const [queuePosition, setQueuePosition] = React.useState<number | null>(null)
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [building, setBuilding] = React.useState("")
  const [projectStage, setProjectStage] = React.useState<ProjectStage | "">("")
  const [proofUrl, setProofUrl] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [copyDone, setCopyDone] = React.useState(false)

  const siteUrl = getPublicSiteUrl()
  const buildingLeft = Math.max(0, 300 - building.length)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          building_description: building,
          project_stage: projectStage,
          proof_url: proofUrl,
        }),
      })
      const body = (await res.json()) as {
        error?: string
        queue_position?: number
      }
      if (!res.ok) {
        setError(body.error ?? "No pudimos enviar tu solicitud.")
        return
      }
      if (body.queue_position == null) {
        setError("Respuesta incompleta del servidor.")
        return
      }
      setQueuePosition(body.queue_position)
      setPhase("done")
    } catch {
      setError("Error de red. Intenta de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  async function copyLanding() {
    try {
      await navigator.clipboard.writeText(siteUrl)
      setCopyDone(true)
      setTimeout(() => setCopyDone(false), 2000)
    } catch {
      setCopyDone(false)
    }
  }

  if (phase === "done" && queuePosition != null) {
    return (
      <Card padding="default" className="bg-[var(--bg)] p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text3)] mb-2">
          Lista de espera
        </p>
        <h1 className="text-[20px] font-extrabold tracking-[-0.5px] mb-2">
          Ya estás dentro del círculo (casi).
        </h1>
        <p className="text-[13px] text-[var(--text2)] leading-snug mb-6">
          Revisamos cada solicitud a mano. Tu lugar en la fila es el{" "}
          <span className="font-bold text-[var(--text)]">#{queuePosition}</span>
          . También te lo enviamos por correo para que no se pierda.
        </p>

        <div className="rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--bg2)] p-4 mb-6">
          <p className="text-[13px] text-[var(--text2)] leading-relaxed mb-1">
            Mientras esperas, comparte Murmur con alguien que también esté
            impulsando un proyecto, un negocio o una idea. La red crece cuando
            nos recomendamos entre quienes avanzan en serio.
          </p>
          <p className="text-[12px] text-[var(--text3)] mb-3">
            Aquí tienes el enlace a la entrada — copia y mándalo como quieras.
          </p>
          <div className="flex gap-2 flex-col sm:flex-row">
            <Input
              readOnly
              value={siteUrl}
              className="text-[12px] font-mono flex-1"
              aria-label="Enlace a la web de Murmur"
            />
            <Button
              type="button"
              variant="secondary"
              className="shrink-0"
              onClick={() => void copyLanding()}
            >
              {copyDone ? "Copiado" : "Copiar"}
            </Button>
          </div>
        </div>

        <p className="text-[12px] text-[var(--text3)] text-center">
          <Link href="/auth/signup" className="text-[var(--p)] font-semibold">
            Volver al registro
          </Link>
        </p>
      </Card>
    )
  }

  return (
    <Card padding="default" className="bg-[var(--bg)] p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text3)] mb-2">
        Acceso por invitación
      </p>
      <h1 className="text-[18px] font-extrabold tracking-[-0.4px] mb-1">
        Pedir entrada a Murmur
      </h1>
      <p className="text-[13px] text-[var(--text2)] mb-6 leading-snug">
        Murmur es por invitación y va dirigido a quien está impulsando algo con
        intención — proyecto, negocio, marca o iniciativa, en cualquier
        sector. Si aún no tienes código, cuéntanos en pocas palabras. Leemos cada
        mensaje.
      </p>

      <form className="flex flex-col gap-3" onSubmit={(e) => void handleSubmit(e)} noValidate>
        <Field label="Nombre completo" required>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            required
            placeholder="Cómo te presentamos si entras"
          />
        </Field>
        <Field label="Email" required>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            placeholder="donde te escribimos"
          />
        </Field>
        <Field
          label="¿Qué estás impulsando?"
          hint={`${buildingLeft} caracteres restantes`}
          required
        >
          <Textarea
            value={building}
            onChange={(e) => setBuilding(e.target.value.slice(0, 300))}
            rows={4}
            required
            placeholder="Ej.: qué ofreces o qué problema abordas, para quién es y por qué te importa."
            maxLength={300}
          />
        </Field>
        <Field label="¿En qué etapa estás?" required>
          <select
            className={cn(
              "ds-input",
              !projectStage ? "text-[var(--text3)]" : ""
            )}
            value={projectStage}
            onChange={(e) =>
              setProjectStage((e.target.value || "") as ProjectStage | "")
            }
            aria-required
            required
          >
            <option value="">Elige una etapa…</option>
            {PROJECT_STAGE_OPTIONS.map((opt) => (
              <option key={opt.slug} value={opt.slug}>
                {opt.title} — {opt.description}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Un enlace que respalde lo que haces"
          hint="Puede ser web, redes, portafolio, artículo, presentación… algo verificable y tuyo."
          required
        >
          <Input
            type="url"
            value={proofUrl}
            onChange={(e) => setProofUrl(e.target.value)}
            required
            placeholder="https://…"
            spellCheck={false}
          />
        </Field>

        {error ? (
          <p className="text-[12px] text-[var(--red)] -mt-1" role="alert">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="mt-2 justify-center"
          disabled={submitting}
        >
          {submitting ? "Enviando…" : "Enviar solicitud"}
        </Button>

        <p className="text-[12px] text-[var(--text2)] text-center mt-2">
          ¿Ya tienes código?{" "}
          <Link href="/auth/signup" className="text-[var(--p)] font-semibold">
            Registrarte
          </Link>
        </p>
      </form>
    </Card>
  )
}
