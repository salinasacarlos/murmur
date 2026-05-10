/**
 * Etiquetas homologadas entre perfil, búsquedas y filtros del feed Descubrir.
 */

export const PROFILE_FIELD_COPY = {
  industryPrincipal: "Industria principal",
  /** Catálogo expertise bajo la industria (primary + expertise_slugs). */
  verticales: "Verticales",
  /** Hojas de industries_catalog (mismas etiquetas que en el perfil). */
  verticalesAfinidad: "Verticales de afinidad",
  talentos: "Talentos",
} as const

/** Textos de ayuda reutilizables (formularios y filtros). */
export const PROFILE_FIELD_HINTS = {
  industryOptionalShort:
    "Opcional: un solo sector. Sin industria ni verticales de foco, no filtramos por ese eje.",
  industryFilterFeed:
    "Como en tu perfil. «Cualquiera» no filtra por sector.",
  verticalesOptional:
    "Hasta 5 dentro de la industria; mismo catálogo que en tu perfil.",
  verticalesFilterFeed:
    "Opcional. Al menos una vertical del perfil mostrado debe coincidir.",
  verticalesAfinidadOptional:
    "Opcional; mismas etiquetas que «Verticales de afinidad» en el perfil.",
  verticalesAfinidadFilterFeed:
    "Opcional. Al menos una etiqueta de afinidad del perfil mostrado.",
  talentosOptional: "Hasta 5; opcional (transversal).",
  talentosFilterFeed: "Opcional. Al menos un talento en común.",
  feedDrawerIntro:
    "Misma taxonomía que tu perfil: industria principal, verticales, verticales de afinidad y talentos.",
} as const
