"use client"

import * as React from "react"

import { PublicFieldNotice } from "@/components/murm/public-field-notice"
import { Stepper } from "@/components/onboarding/stepper"
import { OnboardingCard } from "@/components/onboarding/onboarding-card"
import { Field, Input, Textarea } from "@/components/ui/input"
import { OptionCard } from "@/components/ui/option-card"

export default function ProjectStepPage() {
  const [hasProject, setHasProject] = React.useState<"yes" | "no" | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <Stepper current={5} total={7} />
      <OnboardingCard
        title="Proyecto u oportunidad"
        description="Opcional pero ayuda a contextualizar tu perfil."
        back="/onboarding/profile"
        next="/onboarding/location"
      >
        <OptionCard
          selected={hasProject === "yes"}
          onSelect={() => setHasProject("yes")}
          title="Tengo proyecto"
          description="Startup, etapa y qué buscas."
        />
        <OptionCard
          selected={hasProject === "no"}
          onSelect={() => setHasProject("no")}
          title="Busco sumarme"
          description="Tipo de rol u oportunidad."
        />

        {hasProject === "yes" && (
          <div className="ds-card p-4 flex flex-col gap-3 mt-2">
            <Field label="Nombre del proyecto" required>
              <PublicFieldNotice className="mb-1" compact />
              <Input placeholder="ej. Murmur" />
            </Field>
            <Field label="Etapa" required>
              <PublicFieldNotice className="mb-1" compact />
              <Input placeholder="ej. Pre-seed con 3 clientes piloto" />
            </Field>
            <Field label="Qué busco">
              <PublicFieldNotice className="mb-1" />
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
              <PublicFieldNotice className="mb-1" />
              <Input placeholder="ej. Co-founder técnico, primer empleo en startup..." />
            </Field>
            <Field label="Qué puedo aportar">
              <PublicFieldNotice className="mb-1" />
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
