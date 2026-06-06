import type { OnboardingIntent } from "@/lib/types"

export type OnboardingRoleOption = {
  id: OnboardingIntent
  title: string
  description: string
}

export const ONBOARDING_ROLE_OPTIONS: OnboardingRoleOption[] = [
  {
    id: "founder",
    title: "Tengo proyecto",
    description: "Lidero algo y busco socio, talento o capital.",
  },
  {
    id: "contributor",
    title: "Quiero contribuir",
    description: "Quiero sumarme a un proyecto o equipo.",
  },
  {
    id: "investor",
    title: "Soy inversionista",
    description: "Invierto, conecto capital o exploro sin invertir por ahora.",
  },
  {
    id: "both",
    title: "Las dos",
    description: "Tengo proyecto y también me interesa sumarme a otros equipos.",
  },
]

export const ONBOARDING_INTENT_STEP_COPY = {
  title: "Dices qué buscas",
  description:
    "Cada conexión tendrá un por qué. Elige cómo participas y qué tipo de match buscas.",
  roleSectionTitle: "¿Qué traes a Murmur?",
  roleSectionHint:
    "¿Proyecto propio, sumarte a uno o invertir? La IA usa esto para filtrarte perfiles.",
} as const

export const ONBOARDING_STEP_COUNT = 4
