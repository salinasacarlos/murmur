"use client"

import * as React from "react"

import { Stepper } from "@/components/onboarding/stepper"
import { OnboardingCard } from "@/components/onboarding/onboarding-card"
import { MultiOption } from "@/components/ui/option-card"
import { RELATION_LABELS, type RelationType } from "@/lib/types"

const RELATIONS: { id: RelationType; description: string }[] = [
  { id: "co-founder", description: "Socio para construir desde cero" },
  { id: "empleo", description: "Empleo o contratación early-stage" },
  { id: "colaboracion", description: "Colaboración puntual o por proyecto" },
  { id: "mentoria", description: "Mentor o advisor con experiencia" },
  { id: "inversion", description: "Inversión ángel o de capital" },
  { id: "abierto", description: "Sin tipo definido, abierto a explorar" },
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
      <Stepper current={2} total={6} />
      <OnboardingCard
        title="¿Qué tipo de conexiones buscas?"
        description="Selecciona todas las que apliquen. Puedes ajustar más tarde."
        back="/onboarding/role"
        next="/onboarding/profile"
        nextDisabled={selected.length === 0}
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
