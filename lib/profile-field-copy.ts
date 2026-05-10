/**
 * Etiquetas homologadas entre perfil, búsquedas y filtros del feed Descubrir.
 */

import {
  MAX_PROFILE_VERTICAL_SLUGS,
  MAX_TALENT_SLUGS,
} from "@/lib/product-config"
import { MAX_EXPERTISE_SLUGS } from "@/lib/profile-taxonomy"

export const PROFILE_FIELD_COPY = {
  industryPrincipal: "Industria principal",
  /** Verticales de foco (nivel 2) bajo la industria; hasta MAX_PROFILE_VERTICAL_SLUGS. */
  verticales: "Verticales",
  /** Expertise = roles en la industria; hasta MAX_EXPERTISE_SLUGS. */
  expertise: "Roles / expertise",
  softSkills: "Soft skills",
} as const

/** Textos de ayuda reutilizables (formularios y filtros). */
export const PROFILE_FIELD_HINTS = {
  industryOptionalShort:
    "Opcional: un solo sector. Sin industria ni verticales/expertise, no filtramos por ese eje.",
  industryFilterFeed:
    "Como en tu perfil. «Cualquiera» no filtra por sector.",
  verticalesOptional: `Hasta ${MAX_PROFILE_VERTICAL_SLUGS} verticales dentro de la industria.`,
  verticalesFilterFeed:
    "Opcional. Coincidencia por verticales del perfil.",
  expertiseOptional: `Hasta ${MAX_EXPERTISE_SLUGS} roles (p. ej. PM, developer, director); depende de las verticales.`,
  expertiseFilterFeed:
    "Opcional. Coincidencia por expertise del perfil.",
  softSkillsOptional: `Hasta ${MAX_TALENT_SLUGS}; opcional. No se rellenan desde tu perfil: solo si los quieres para esta búsqueda.`,
  softSkillsFilterFeed: "Opcional. Al menos una soft skill en común.",
  feedDrawerIntro:
    "Misma taxonomía que tu perfil: industria, verticales, expertise y soft skills.",
} as const
