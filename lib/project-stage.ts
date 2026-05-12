import type { ProjectStage } from "@/lib/types"

/** Opciones de etapa de proyecto (orden fijo de producto). */
export const PROJECT_STAGE_OPTIONS: {
  slug: ProjectStage
  title: string
  description: string
}[] = [
  {
    slug: "idea",
    title: "Idea",
    description: "Tengo el concepto, aún no he construido nada",
  },
  {
    slug: "validando",
    title: "Validando",
    description: "Estoy explorando si vale la pena construirlo",
  },
  {
    slug: "construyendo",
    title: "Construyendo",
    description: "Tengo algo en desarrollo, aún no está en manos de nadie",
  },
  {
    slug: "en_manos_de_personas",
    title: "En manos de personas",
    description: "Hay gente usando o experimentando lo que construí",
  },
  {
    slug: "generando_ingresos",
    title: "Generando ingresos",
    description: "Ya tengo clientes o algún tipo de retorno económico",
  },
  {
    slug: "creciendo",
    title: "Creciendo",
    description: "Tengo un modelo que funciona y estoy expandiéndolo",
  },
]

const STAGE_PRIMARY: Record<ProjectStage, string> = {
  idea: "Idea",
  validando: "Validando",
  construyendo: "Construyendo",
  en_manos_de_personas: "En manos de personas",
  generando_ingresos: "Generando ingresos",
  creciendo: "Creciendo",
}

const STAGE_SECONDARY: Record<ProjectStage, string> = {
  idea: "Tengo el concepto, aún no he construido nada",
  validando: "Estoy explorando si vale la pena construirlo",
  construyendo: "Tengo algo en desarrollo, aún no está en manos de nadie",
  en_manos_de_personas: "Hay gente usando o experimentando lo que construí",
  generando_ingresos: "Ya tengo clientes o algún tipo de retorno económico",
  creciendo: "Tengo un modelo que funciona y estoy expandiéndolo",
}

/** Línea corta para chips (título de etapa). */
export function labelProjectStageShort(slug: ProjectStage): string {
  return STAGE_PRIMARY[slug]
}

/** Título — descripción (mismo copy que el onboarding). */
export function labelProjectStageLong(slug: ProjectStage): string {
  return `${STAGE_PRIMARY[slug]} — ${STAGE_SECONDARY[slug]}`
}
