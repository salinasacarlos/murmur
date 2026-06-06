"use client"

import * as React from "react"

import { Stepper } from "@/components/onboarding/stepper"
import { OnboardingCard } from "@/components/onboarding/onboarding-card"
import { OptionCard, MultiOption } from "@/components/ui/option-card"
import {
  IconBriefcase,
  IconBuilding,
  IconHeart,
  IconSpark,
} from "@/components/icons"
import {
  ONBOARDING_INTENT_STEP_COPY,
  ONBOARDING_ROLE_OPTIONS,
  ONBOARDING_STEP_COUNT,
} from "@/lib/onboarding-intent-options"
import { getOnboardingRelationshipsStepCopy } from "@/lib/onboarding-relationship-options"
import {
  persistOnboardingIntentStep,
  requireUserId,
} from "@/lib/onboarding-persist"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { OnboardingIntent, RelationType } from "@/lib/types"

const ROLE_ICONS = {
  founder: IconBriefcase,
  contributor: IconSpark,
  investor: IconBuilding,
  both: IconHeart,
} as const

export default function IntentStepPage() {
  const [ready, setReady] = React.useState(false)
  const [intent, setIntent] = React.useState<OnboardingIntent | null>(null)
  const [selected, setSelected] = React.useState<RelationType[]>([])

  const formatCopy = React.useMemo(
    () => getOnboardingRelationshipsStepCopy(intent),
    [intent]
  )

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      const supabase = getSupabaseBrowserClient()
      const uid = await requireUserId(supabase)
      if (!uid) return

      const { data } = await supabase
        .from("profiles")
        .select(
          `
          onboarding_intent,
          profile_relations_looking ( relation )
        `
        )
        .eq("id", uid)
        .maybeSingle()

      if (cancelled) return

      const loadedIntent = data?.onboarding_intent ?? null
      setIntent(loadedIntent)

      if (loadedIntent) {
        const ids = new Set(
          getOnboardingRelationshipsStepCopy(loadedIntent).options.map(
            (opt) => opt.id
          )
        )
        const saved = (data?.profile_relations_looking ?? [])
          .map((row) => row.relation as RelationType)
          .filter((relation) => ids.has(relation))
        setSelected(saved)
      }

      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  function selectIntent(next: OnboardingIntent) {
    setIntent(next)
    const ids = new Set(
      getOnboardingRelationshipsStepCopy(next).options.map((opt) => opt.id)
    )
    setSelected((prev) => prev.filter((id) => ids.has(id)))
  }

  function toggleRelation(id: RelationType) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Stepper current={2} total={ONBOARDING_STEP_COUNT} />
      <OnboardingCard
        title={ONBOARDING_INTENT_STEP_COPY.title}
        description={ONBOARDING_INTENT_STEP_COPY.description}
        back="/onboarding/profile"
        next="/onboarding/project"
        nextDisabled={!ready || intent == null || selected.length === 0}
        onBeforeNext={async () => {
          if (intent == null) return false
          const supabase = getSupabaseBrowserClient()
          const uid = await requireUserId(supabase)
          if (!uid) return false
          const r = await persistOnboardingIntentStep(supabase, uid, {
            intent,
            relations: selected,
          })
          if (!r.ok) {
            console.error(r.error)
            return false
          }
        }}
      >
        {!ready ? (
          <p className="text-[13px] text-[var(--text2)]">Cargando…</p>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-[13px] font-semibold text-[var(--text)]">
                  {ONBOARDING_INTENT_STEP_COPY.roleSectionTitle}
                </p>
                <p className="text-[12px] text-[var(--text2)] mt-0.5">
                  {ONBOARDING_INTENT_STEP_COPY.roleSectionHint}
                </p>
              </div>
              {ONBOARDING_ROLE_OPTIONS.map((role) => {
                const Icon = ROLE_ICONS[role.id]
                return (
                  <OptionCard
                    key={role.id}
                    selected={intent === role.id}
                    onSelect={() => selectIntent(role.id)}
                    title={role.title}
                    description={role.description}
                    icon={<Icon size={18} />}
                  />
                )
              })}
            </div>

            {intent != null ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border)]">
                <div>
                  <p className="text-[13px] font-semibold text-[var(--text)]">
                    {formatCopy.title}
                  </p>
                  <p className="text-[12px] text-[var(--text2)] mt-0.5">
                    {formatCopy.description}
                  </p>
                </div>
                {formatCopy.options.map((rel) => (
                  <MultiOption
                    key={rel.id}
                    selected={selected.includes(rel.id)}
                    onToggle={() => toggleRelation(rel.id)}
                    title={rel.title}
                    description={rel.description}
                  />
                ))}
              </div>
            ) : null}
          </>
        )}
      </OnboardingCard>
    </div>
  )
}
