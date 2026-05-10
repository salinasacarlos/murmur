"use client"

import * as React from "react"

import { Stepper } from "@/components/onboarding/stepper"
import { OnboardingCard } from "@/components/onboarding/onboarding-card"
import { MultiOption } from "@/components/ui/option-card"
import {
  persistOnboardingRelationships,
  requireUserId,
} from "@/lib/onboarding-persist"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { RELATION_LABELS, type RelationType } from "@/lib/types"

const RELATIONS: { id: RelationType; description: string }[] = [
  {
    id: "co-founder",
    description:
      "Te interesa repartir visión y riesgo con alguien que componga contigo desde el inicio.",
  },
  {
    id: "empleo",
    description: "Buscas incorporar a alguien a tu equipo.",
  },
  {
    id: "colaboracion",
    description:
      "Te va bien un encargo definido, un sprint compartido o apoyo sin vínculo fijo de largo plazo.",
  },
  {
    id: "mentoria",
    description: "Quieres retro de alguien que ya haya recorrido el camino.",
  },
  {
    id: "inversion",
    description: "Buscas capital o puedes aportarlo; el foco está en el acuerdo y el upside.",
  },
  {
    id: "abierto",
    description: "Prefieres no cerrarte de antemano y ver qué encaja conversando.",
  },
]

export default function RelationshipsStepPage() {
  const [selected, setSelected] = React.useState<RelationType[]>([])

  function toggle(id: RelationType) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Stepper current={3} total={6} />
      <OnboardingCard
        title="¿Qué tipo de conexiones buscas?"
        description="Elige las que apliquen. Podrás ajustarlo luego."
        back="/onboarding/role"
        next="/onboarding/profile"
        nextDisabled={selected.length === 0}
        onBeforeNext={async () => {
          const supabase = getSupabaseBrowserClient()
          const uid = await requireUserId(supabase)
          if (!uid) return false
          const r = await persistOnboardingRelationships(
            supabase,
            uid,
            selected
          )
          if (!r.ok) {
            console.error(r.error)
            return false
          }
        }}
      >
        {RELATIONS.map((rel) => (
          <MultiOption
            key={rel.id}
            selected={selected.includes(rel.id)}
            onToggle={() => toggle(rel.id)}
            title={RELATION_LABELS[rel.id]}
            description={rel.description}
          />
        ))}
      </OnboardingCard>
    </div>
  )
}
