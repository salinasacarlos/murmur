"use client"

import * as React from "react"

import { Stepper } from "@/components/onboarding/stepper"
import { OnboardingCard } from "@/components/onboarding/onboarding-card"
import { OptionCard } from "@/components/ui/option-card"
import { IconBriefcase, IconBuilding, IconHeart, IconSpark } from "@/components/icons"
import {
  persistOnboardingIntent,
  requireUserId,
} from "@/lib/onboarding-persist"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { OnboardingIntent } from "@/lib/types"

const ROLES = [
  {
    id: "founder",
    title: "Tengo proyecto",
    description:
      "Lidero un proyecto o negocio y busco socios, talento o asesoría.",
    icon: <IconBriefcase size={18} />,
  },
  {
    id: "contributor",
    title: "Quiero contribuir",
    description:
      "Quiero unirme a un proyecto como co-founder, empleado o colaborador.",
    icon: <IconSpark size={18} />,
  },
  {
    id: "investor",
    title: "Soy inversionista",
    description:
      "Invierto, conecto capital con equipos o exploro sin invertir por ahora.",
    icon: <IconBuilding size={18} />,
  },
  {
    id: "both",
    title: "Las dos",
    description:
      "Tengo proyecto propio y también me interesa sumarme a otros equipos.",
    icon: <IconHeart size={18} />,
  },
] as const

export default function RoleStepPage() {
  const [selected, setSelected] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <Stepper current={1} total={5} />
      <OnboardingCard
        title="¿Qué te trae a murmur?"
        description="Elige la opción que mejor describe por qué estás en murmur."
        back="/onboarding"
        next="/onboarding/relationships"
        nextDisabled={!selected}
        onBeforeNext={async () => {
          if (!selected) return false
          const supabase = getSupabaseBrowserClient()
          const uid = await requireUserId(supabase)
          if (!uid) return false
          const r = await persistOnboardingIntent(
            supabase,
            uid,
            selected as OnboardingIntent
          )
          if (!r.ok) {
            console.error(r.error)
            return false
          }
        }}
      >
        {ROLES.map((role) => (
          <OptionCard
            key={role.id}
            selected={selected === role.id}
            onSelect={() => setSelected(role.id)}
            title={role.title}
            description={role.description}
            icon={role.icon}
          />
        ))}
      </OnboardingCard>
    </div>
  )
}
