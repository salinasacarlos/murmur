/**
 * Etiquetas homologadas entre perfil, búsquedas y filtros del feed Descubrir.
 */

export const PROFILE_FIELD_COPY = {
  industryPrincipal: "Industria principal",
  /** Verticales de foco (nivel 2) bajo la industria; hasta 3. */
  verticales: "Verticales",
  /** Expertise fino (nivel 3) bajo las verticales; hasta 5. */
  expertise: "Expertise",
  softSkills: "Soft skills",
} as const

/** Textos de ayuda reutilizables (formularios y filtros). */
export const PROFILE_FIELD_HINTS = {
  industryOptionalShort:
    "Opcional: un solo sector. Sin industria ni verticales/expertise, no filtramos por ese eje.",
  industryFilterFeed:
    "Como en tu perfil. «Cualquiera» no filtra por sector.",
  verticalesOptional:
    "Hasta 3 verticales dentro de la industria.",
  verticalesFilterFeed:
    "Opcional. Coincidencia por verticales del perfil.",
  expertiseOptional:
    "Hasta 5; depende de las verticales elegidas.",
  expertiseFilterFeed:
    "Opcional. Coincidencia por expertise del perfil.",
  softSkillsOptional:
    "Hasta 5; opcional. No se rellenan desde tu perfil: solo si los quieres para esta búsqueda.",
  softSkillsFilterFeed: "Opcional. Al menos una soft skill en común.",
  feedDrawerIntro:
    "Misma taxonomía que tu perfil: industria, verticales, expertise y soft skills.",
} as const
