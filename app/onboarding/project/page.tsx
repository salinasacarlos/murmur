"use client"

import * as React from "react"

import { Stepper } from "@/components/onboarding/stepper"
import { OnboardingCard } from "@/components/onboarding/onboarding-card"
import { Field, Input, Textarea } from "@/components/ui/input"
import { OptionCard } from "@/components/ui/option-card"

export default function ProjectStepPage() {
  const [hasProject, setHasProject] = React.useState<"yes" | "no" | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <Stepper current={4} total={6} />
      <OnboardingCard
        title="Contexto"
        description="Si tienes proyecto, cuéntanos de él. Si quieres contribuir, cuéntanos qué tipo de oportunidad buscas."
        back="/onboarding/profile"
        next="/onboarding/location"
      >
        <OptionCard
          selected={hasProject === "yes"}
          onSelect={() => setHasProject("yes")}
          title="Tengo proyecto"
          description="Voy a contar de mi startup, etapa, y qué busco."
        />
        <OptionCard
          selected={hasProject === "no"}
          onSelect={() => setHasProject("no")}
          title="Quiero contribuir"
          description="Voy a contar qué tipo de oportunidad busco."
        />

        {hasProject === "yes" && (
          <div className="ds-card p-4 flex flex-col gap-3 mt-2">
            <Field label="Nombre del proyecto" required>
              <Input placeholder="ej. Murmur" />
            </Field>
            <Field label="Etapa" required>
              <Input placeholder="ej. Pre-seed con 3 clientes piloto" />
            </Field>
            <Field label="Qué busco">
              <Textarea
                placeholder="ej. Co-founder técnico que haya enviado producto a producción..."
                rows={3}
              />
            </Field>
          </div>
        )}

        {hasProject === "no" && (
          <div className="ds-card p-4 flex flex-col gap-3 mt-2">
            <Field label="Tipo de oportunidad buscada">
              <Input placeholder="ej. Co-founder técnico, primer empleo en startup..." />
            </Field>
            <Field label="Qué puedo aportar">
              <Textarea
                placeholder="ej. 8 años construyendo productos consumer..."
                rows={3}
              />
            </Field>
          </div>
        )}
      </OnboardingCard>
    </div>
  )
}
