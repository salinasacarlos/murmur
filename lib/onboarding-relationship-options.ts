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
    description: "Busco socio/a desde el inicio, con visión y riesgo compartidos.",
  },
  {
    id: "empleo",
    title: "Contratar talento",
    description: "Necesito sumar a alguien al equipo con un rol claro.",
  },
  {
    id: "colaboracion",
    title: "Colaboración",
    description: "Proyecto acotado, encargo puntual o apoyo por tiempo limitado.",
  },
  {
    id: "mentoria",
    title: "Mentoría",
    description: "Busco guía de alguien que ya recorrió el camino en mi sector.",
  },
  {
    id: "inversion",
    title: "Inversión",
    description: "Busco capital o un inversionista que sume al proyecto.",
  },
  {
    id: "abierto",
    title: "Abierto a explorar",
    description: "Prefiero conversar y ver qué match aparece.",
  },
]

const CONTRIBUTOR_OPTIONS: OnboardingRelationshipOption[] = [
  {
    id: "co-founder",
    title: "Co-founder",
    description: "Quiero entrar como socio/a desde el inicio del proyecto.",
  },
  {
    id: "empleo",
    title: "Empleo en equipo",
    description: "Busco un rol en un proyecto que ya esté en marcha.",
  },
  {
    id: "colaboracion",
    title: "Colaboración por proyecto",
    description: "Apoyo en algo concreto, con alcance y plazo definidos.",
  },
  {
    id: "mentoria",
    title: "Mentoría",
    description: "Busco guía de alguien con experiencia en mi área.",
  },
  {
    id: "abierto",
    title: "Abierto a explorar",
    description: "Prefiero conversar primero y ver qué match hay.",
  },
]

const INVESTOR_OPTIONS: OnboardingRelationshipOption[] = [
  {
    id: "inversion",
    title: "Inversión",
    description: "Evalúo proyectos y oportunidades de capital.",
  },
  {
    id: "mentoria",
    title: "Mentoría / advisory",
    description: "Apoyo equipos con red, criterio o experiencia operativa.",
  },
  {
    id: "colaboracion",
    title: "Colaboración puntual",
    description: "Due diligence, intros o apoyo en temas específicos.",
  },
  {
    id: "abierto",
    title: "Abierto a explorar",
    description: "Conozco equipos sin un formato fijo de antemano.",
  },
]

const BOTH_OPTIONS: OnboardingRelationshipOption[] = [
  {
    id: "co-founder",
    title: "Co-founder",
    description: "Busco socios/as o quiero unirme como socio/a a otro proyecto.",
  },
  {
    id: "empleo",
    title: "Talento en equipo",
    description: "Contratar para mi proyecto o sumarme con un rol definido.",
  },
  {
    id: "colaboracion",
    title: "Colaboración",
    description: "Encargo puntual, apoyo por proyecto o trabajo acotado.",
  },
  {
    id: "mentoria",
    title: "Mentoría",
    description: "Recibir guía, ofrecerla o intercambiar retro.",
  },
  {
    id: "inversion",
    title: "Inversión",
    description: "Buscar capital, invertir o conectar oportunidades.",
  },
  {
    id: "abierto",
    title: "Abierto a explorar",
    description: "Prefiero conversar y ver qué match aparece.",
  },
]

export function getOnboardingRelationshipsStepCopy(
  intent: OnboardingIntent | null | undefined
): OnboardingRelationshipsStepCopy {
  switch (intent) {
    case "contributor":
      return {
        title: "¿En qué formato te sumas?",
        description: "Marca los tipos de oportunidad que te interesan.",
        options: CONTRIBUTOR_OPTIONS,
      }
    case "investor":
      return {
        title: "¿Cómo te relacionas con equipos?",
        description: "Indica cómo sueles conectar con founders y proyectos.",
        options: INVESTOR_OPTIONS,
      }
    case "both":
      return {
        title: "¿Qué conexiones buscas?",
        description: "Tienes proyecto y también quieres sumarte a otros. Marca lo que aplique.",
        options: BOTH_OPTIONS,
      }
    case "founder":
    default:
      return {
        title: "¿Qué conexiones buscas?",
        description: "Elige las que aplican a tu proyecto. Puedes cambiarlo después.",
        options: FOUNDER_OPTIONS,
      }
  }
}
