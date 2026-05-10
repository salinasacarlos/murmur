import type { FunctionalArea } from "@/lib/types"

export interface OnboardingFunctionalAreaOption {
  slug: string
  label: string
  /** Primary enum bucket used for matching (`profiles.area`). */
  mapsTo: FunctionalArea
}

/** Broader list for onboarding; max 5 slugs stored in `profiles.functional_area_tags`. */
export const ONBOARDING_FUNCTIONAL_AREA_OPTIONS: readonly OnboardingFunctionalAreaOption[] =
  [
    {
      slug: "ingenieria-software",
      label: "Ingeniería de software",
      mapsTo: "tecnico",
    },
    {
      slug: "data-ml",
      label: "Data, ML e inteligencia aplicada",
      mapsTo: "tecnico",
    },
    {
      slug: "infra-seguridad",
      label: "Infra, cloud y ciberseguridad",
      mapsTo: "tecnico",
    },
    {
      slug: "producto-ux",
      label: "Producto y UX / research",
      mapsTo: "producto",
    },
    {
      slug: "diseno-visual",
      label: "Diseño visual, marca y motion",
      mapsTo: "producto",
    },
    {
      slug: "negocio-estrategia",
      label: "Estrategia y modelo de negocio",
      mapsTo: "negocio",
    },
    {
      slug: "ventas-revenue",
      label: "Ventas, partnerships y revenue",
      mapsTo: "negocio",
    },
    {
      slug: "marketing-brand",
      label: "Marketing, contenido y comunidad",
      mapsTo: "negocio",
    },
    {
      slug: "finanzas-capital",
      label: "Finanzas, capital y operaciones financieras",
      mapsTo: "negocio",
    },
    {
      slug: "legal-compliance",
      label: "Legal, contratos y compliance",
      mapsTo: "negocio",
    },
    {
      slug: "people-talento",
      label: "Personas, talento y cultura",
      mapsTo: "operaciones",
    },
    {
      slug: "operaciones-procesos",
      label: "Operaciones y mejora de procesos",
      mapsTo: "operaciones",
    },
    {
      slug: "logistica-sourcing",
      label: "Logística, compras y sourcing",
      mapsTo: "operaciones",
    },
    {
      slug: "ciencia-investigacion",
      label: "Ciencia e investigación aplicada",
      mapsTo: "ciencia",
    },
    {
      slug: "salud-bio",
      label: "Salud, biotech y ciencias de la vida",
      mapsTo: "ciencia",
    },
    {
      slug: "educacion-formacion",
      label: "Educación, formación y facilitación",
      mapsTo: "producto",
    },
    {
      slug: "arte-cultura",
      label: "Arte, cultura y medios audiovisuales",
      mapsTo: "producto",
    },
    {
      slug: "espacios-construccion",
      label: "Arquitectura, espacios y construcción",
      mapsTo: "operaciones",
    },
    {
      slug: "sostenibilidad-impacto",
      label: "Sostenibilidad, impacto y ESG",
      mapsTo: "ciencia",
    },
    {
      slug: "generalista-founder",
      label: "Generalista / founder multidisciplina",
      mapsTo: "negocio",
    },
  ]

const SLUG_TO_OPTION = new Map(
  ONBOARDING_FUNCTIONAL_AREA_OPTIONS.map((o) => [o.slug, o])
)

export function labelForOnboardingAreaSlug(slug: string): string {
  return SLUG_TO_OPTION.get(slug)?.label ?? slug
}

export function mapsToForOnboardingSlug(slug: string): FunctionalArea | undefined {
  return SLUG_TO_OPTION.get(slug)?.mapsTo
}
