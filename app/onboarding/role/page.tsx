"use client"

import * as React from "react"

import { Stepper } from "@/components/onboarding/stepper"
import { OnboardingCard } from "@/components/onboarding/onboarding-card"
import { OptionCard } from "@/components/ui/option-card"
import { IconBriefcase, IconHeart, IconSpark } from "@/components/icons"

const ROLES = [
  {
    id: "founder",
    title: "Tengo proyecto",
    description:
      "Estoy construyendo algo y busco co-founders, talento o advisors.",
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
    id: "both",
    title: "Las dos",
    description:
      "Tengo proyecto y también estoy abierto a sumarme a otros equipos.",
    icon: <IconHeart size={18} />,
  },
] as const

export default function RoleStepPage() {
  const [selected, setSelected] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <Stepper current={2} total={6} />
      <OnboardingCard
        title="¿Qué te trae a Murmur?"
        description="Una sola elección para orientar el matching. Si tienes startup o buscas unirte a un equipo, ya queda cubierto aquí; podrás detallar en tu perfil y en tus búsquedas."
        back="/onboarding/event"
        next="/onboarding/relationships"
        nextDisabled={!selected}
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
