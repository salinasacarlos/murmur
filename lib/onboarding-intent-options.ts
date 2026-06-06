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
    description:
      "Lidero un proyecto o negocio y busco socios, talento o asesoría.",
  },
  {
    id: "contributor",
    title: "Quiero contribuir",
    description: "Quiero sumarme a un proyecto o equipo con intención clara.",
  },
  {
    id: "investor",
    title: "Soy inversionista",
    description:
      "Invierto, conecto capital con equipos o exploro sin invertir por ahora.",
  },
  {
    id: "both",
    title: "Las dos",
    description:
      "Tengo proyecto propio y también me interesa unirme a otros equipos.",
  },
]

export const ONBOARDING_INTENT_STEP_COPY = {
  title: "¿Qué buscas en Murmur?",
  description:
    "Elige cómo participas en la plataforma y los formatos de conexión que te interesan.",
  roleSectionTitle: "Cómo participas",
  roleSectionHint:
    "Esto orienta el matching; no limita lo que puedes explorar después.",
} as const

export const ONBOARDING_STEP_COUNT = 4
