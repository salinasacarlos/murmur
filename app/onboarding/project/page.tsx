"use client"

import * as React from "react"

import { PublicFieldNotice } from "@/components/murm/public-field-notice"
import { Stepper } from "@/components/onboarding/stepper"
import { OnboardingCard } from "@/components/onboarding/onboarding-card"
import { Field, Input, Textarea } from "@/components/ui/input"
import {
  persistOnboardingProjectContext,
  requireUserId,
} from "@/lib/onboarding-persist"
import { PROJECT_STAGE_OPTIONS } from "@/lib/project-stage"
import { INVESTOR_ACTIVITY_OPTIONS } from "@/lib/investor-activity"
import {
  userHasProjectIntent,
  userIsInvestor,
} from "@/lib/profile-project-guard"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { ONBOARDING_STEP_COUNT } from "@/lib/onboarding-intent-options"
import { cn } from "@/lib/utils"
import type {
  InvestorActivity,
  OnboardingIntent,
  ProjectStage,
} from "@/lib/types"

export default function ProjectStepPage() {
  const [ready, setReady] = React.useState(false)
  const [intent, setIntent] = React.useState<OnboardingIntent | null>(null)

  const [projectName, setProjectName] = React.useState("")
  const [projectStage, setProjectStage] = React.useState<ProjectStage | "">(
    ""
  )
  const [projectSeek, setProjectSeek] = React.useState("")
  const [opportunitySeek, setOpportunitySeek] = React.useState("")
  const [contributorPitch, setContributorPitch] = React.useState("")
  const [investorActivity, setInvestorActivity] = React.useState<
    InvestorActivity | ""
  >("")

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      const supabase = getSupabaseBrowserClient()
      const uid = await requireUserId(supabase)
      if (!uid) return
      const { data } = await supabase
        .from("profiles")
        .select(
          "onboarding_intent, project_name, project_stage, project_seek_summary, opportunity_seek_summary, contributor_pitch, investor_activity"
        )
        .eq("id", uid)
        .maybeSingle()
      if (cancelled) return
      const i = data?.onboarding_intent ?? null
      setIntent(i)
      setProjectName(data?.project_name ?? "")
      setProjectStage(data?.project_stage ?? "")
      setProjectSeek(data?.project_seek_summary ?? "")
      setOpportunitySeek(data?.opportunity_seek_summary ?? "")
      setContributorPitch(data?.contributor_pitch ?? "")
      setInvestorActivity(data?.investor_activity ?? "")
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const hasProject = userHasProjectIntent(intent ?? undefined)
  const isInvestor = userIsInvestor(intent ?? undefined)

  const nextDisabled =
    !ready ||
    intent == null ||
    (hasProject ? !projectStage : false) ||
    (isInvestor ? !investorActivity : false)

  let description =
    "Cuéntanos qué oportunidad buscas y qué puedes aportar."
  if (hasProject) {
    description =
      "Cuéntanos tu proyecto o iniciativa y qué buscas en Murmur."
  } else if (isInvestor) {
    description =
      "Indica si inviertes activamente, puedes ayudar a conseguir capital o no estás invirtiendo por ahora."
  }

  return (
    <div className="flex flex-col gap-4">
      <Stepper current={3} total={ONBOARDING_STEP_COUNT} />
      <OnboardingCard
        title="Contexto"
        description={description}
        back="/onboarding/intent"
        next="/onboarding/location"
        nextDisabled={nextDisabled}
        onBeforeNext={async () => {
          const supabase = getSupabaseBrowserClient()
          const uid = await requireUserId(supabase)
          if (!uid) return false
          if (intent == null) return false
          const r = await persistOnboardingProjectContext(supabase, uid, {
            intent,
            projectName,
            projectStage: hasProject ? (projectStage as ProjectStage) : null,
            projectSeekSummary: projectSeek,
            opportunitySeekSummary: opportunitySeek,
            contributorPitch,
            investorActivity: isInvestor
              ? (investorActivity as InvestorActivity)
              : null,
          })
          if (!r.ok) {
            console.error(r.error)
            return false
          }
        }}
      >
        {!ready ? (
          <p className="text-[13px] text-[var(--text2)]">Cargando…</p>
        ) : intent == null ? (
          <p className="text-[13px] text-[var(--text2)]">
            Vuelve al paso anterior y elige cómo participas en Murmur.
          </p>
        ) : hasProject ? (
          <div className="ds-card p-4 flex flex-col gap-3 mt-2">
            <Field label="Nombre del proyecto">
              <PublicFieldNotice className="mb-1" compact />
              <Input
                placeholder="ej. tu iniciativa o marca"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </Field>
            <Field label="Etapa del proyecto" required>
              <PublicFieldNotice className="mb-1" compact />
              <select
                className={cn("ds-input", !projectStage ? "text-[var(--text3)]" : "")}
                value={projectStage}
                onChange={(e) =>
                  setProjectStage(
                    (e.target.value || "") as ProjectStage | ""
                  )
                }
                aria-required
              >
                <option value="">Elige una etapa…</option>
                {PROJECT_STAGE_OPTIONS.map((opt) => (
                  <option key={opt.slug} value={opt.slug}>
                    {opt.title} — {opt.description}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Qué busco">
              <PublicFieldNotice className="mb-1" />
              <Textarea
                placeholder="ej. Socio/a con experiencia en operaciones, alguien con red comercial o en tu sector…"
                rows={3}
                value={projectSeek}
                onChange={(e) => setProjectSeek(e.target.value)}
              />
            </Field>
          </div>
        ) : isInvestor ? (
          <div className="ds-card p-4 flex flex-col gap-3 mt-2">
            <Field label="Tu situación como inversionista" required>
              <PublicFieldNotice className="mb-1" compact />
              <select
                className={cn(
                  "ds-input",
                  !investorActivity ? "text-[var(--text3)]" : ""
                )}
                value={investorActivity}
                onChange={(e) =>
                  setInvestorActivity(
                    (e.target.value || "") as InvestorActivity | ""
                  )
                }
                aria-required
              >
                <option value="">Elige una opción…</option>
                {INVESTOR_ACTIVITY_OPTIONS.map((opt) => (
                  <option key={opt.slug} value={opt.slug}>
                    {opt.title} — {opt.description}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        ) : (
          <div className="ds-card p-4 flex flex-col gap-3 mt-2">
            <Field label="Qué puedo aportar">
              <PublicFieldNotice className="mb-1" />
              <Textarea
                placeholder="ej. Años liderando equipos en ventas, educación, operaciones o en tu campo…"
                rows={4}
                value={contributorPitch}
                onChange={(e) => setContributorPitch(e.target.value)}
              />
            </Field>
            <Field label="Detalle opcional sobre lo que buscas">
              <PublicFieldNotice className="mb-1" />
              <Input
                placeholder="ej. Startup en etapa temprana, sector salud, rol comercial…"
                value={opportunitySeek}
                onChange={(e) => setOpportunitySeek(e.target.value)}
              />
            </Field>
          </div>
        )}
      </OnboardingCard>
    </div>
  )
}
