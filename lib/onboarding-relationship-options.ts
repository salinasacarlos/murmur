import type { OnboardingIntent, RelationType } from "@/lib/types"

export type OnboardingRelationshipOption = {
  id: RelationType
  title: string
  description: string
}

export type OnboardingRelationshipsStepCopy = {
  title: string
  description: string
  options: OnboardingRelationshipOption[]
}

const FOUNDER_OPTIONS: OnboardingRelationshipOption[] = [
  {
    id: "co-founder",
    title: "Co-founder",
    description:
      "Buscas alguien que comparta visión y riesgo contigo desde el inicio.",
  },
  {
    id: "empleo",
    title: "Contratar talento",
    description: "Quieres incorporar a alguien a tu equipo.",
  },
  {
    id: "colaboracion",
    title: "Colaboración",
    description:
      "Te sirve un encargo definido, apoyo puntual o un proyecto acotado en el tiempo.",
  },
  {
    id: "mentoria",
    title: "Mentoría",
    description: "Buscas retro de alguien que ya haya recorrido el camino.",
  },
  {
    id: "inversion",
    title: "Inversión",
    description: "Buscas capital o socios/as inversionistas para tu proyecto.",
  },
  {
    id: "abierto",
    title: "Abierto a explorar",
    description: "Prefieres no cerrarte de antemano y ver qué encaja conversando.",
  },
]

const CONTRIBUTOR_OPTIONS: OnboardingRelationshipOption[] = [
  {
    id: "co-founder",
    title: "Co-founder",
    description:
      "Quieres unirte como socio/a desde el inicio, con visión compartida y riesgo repartido.",
  },
  {
    id: "empleo",
    title: "Empleo en equipo",
    description:
      "Buscas un rol dentro de un proyecto o negocio que ya esté en marcha.",
  },
  {
    id: "colaboracion",
    title: "Colaboración por proyecto",
    description:
      "Te interesa apoyar en algo concreto, con alcance y plazo definidos.",
  },
  {
    id: "mentoria",
    title: "Mentoría",
    description: "Buscas guía de alguien con experiencia en tu área o sector.",
  },
  {
    id: "abierto",
    title: "Abierto a explorar",
    description: "Prefieres conversar primero y ver qué tipo de encaje aparece.",
  },
]

const INVESTOR_OPTIONS: OnboardingRelationshipOption[] = [
  {
    id: "inversion",
    title: "Inversión",
    description:
      "Conectar con proyectos o founders para evaluar oportunidades de capital.",
  },
  {
    id: "mentoria",
    title: "Mentoría / advisory",
    description:
      "Apoyar equipos con experiencia, red o criterio, sin liderar el día a día.",
  },
  {
    id: "colaboracion",
    title: "Colaboración puntual",
    description:
      "Due diligence, intros o apoyo en temas concretos cuando haga falta.",
  },
  {
    id: "abierto",
    title: "Abierto a explorar",
    description: "Prefieres conocer equipos sin un formato fijo de antemano.",
  },
]

const BOTH_OPTIONS: OnboardingRelationshipOption[] = [
  {
    id: "co-founder",
    title: "Co-founder",
    description:
      "Buscar socios/as para tu proyecto o unirte como socio/a a otro equipo.",
  },
  {
    id: "empleo",
    title: "Talento en equipo",
    description:
      "Contratar para tu proyecto o sumarte a uno con un rol definido.",
  },
  {
    id: "colaboracion",
    title: "Colaboración",
    description:
      "Encargos puntuales, apoyo por proyecto o trabajo acotado en el tiempo.",
  },
  {
    id: "mentoria",
    title: "Mentoría",
    description:
      "Recibir guía, ofrecerla o intercambiar retro con otros perfiles.",
  },
  {
    id: "inversion",
    title: "Inversión",
    description:
      "Buscar capital, invertir o conectar oportunidades con equipos.",
  },
  {
    id: "abierto",
    title: "Abierto a explorar",
    description: "Prefieres no cerrarte de antemano y ver qué encaja conversando.",
  },
]

export function getOnboardingRelationshipsStepCopy(
  intent: OnboardingIntent | null | undefined
): OnboardingRelationshipsStepCopy {
  switch (intent) {
    case "contributor":
      return {
        title: "¿En qué formato quieres unirte?",
        description:
          "Marca los tipos de oportunidad que te interesan.",
        options: CONTRIBUTOR_OPTIONS,
      }
    case "investor":
      return {
        title: "¿Cómo te relacionas con equipos?",
        description:
          "Indica cómo sueles trabajar con founders y proyectos.",
        options: INVESTOR_OPTIONS,
      }
    case "both":
      return {
        title: "¿Qué conexiones te interesan?",
        description:
          "Tienes proyecto propio y también quieres sumarte a otros. Marca lo que aplique.",
        options: BOTH_OPTIONS,
      }
    case "founder":
    default:
      return {
        title: "¿Qué tipo de conexiones buscas?",
        description:
          "Elige las que apliquen para tu proyecto. Puedes cambiarlo después.",
        options: FOUNDER_OPTIONS,
      }
  }
}
