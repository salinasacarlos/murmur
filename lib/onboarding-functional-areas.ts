import type { FunctionalArea } from "@/lib/types"

export interface OnboardingFunctionalAreaOption {
  slug: string
  label: string
  /** Primary enum bucket used for matching (`profiles.area`). */
  mapsTo: FunctionalArea
}

/**
 * Shared catalog: onboarding profile, search preferences, and similar UIs.
 * Max 5 slugs on profile and on each saved search; coarse `mapsTo` drives enum matching.
 */
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
      slug: "consultoria-advisory",
      label: "Consultoría y advisory transversal",
      mapsTo: "negocio",
    },
    {
      slug: "innovacion-laboratorio",
      label: "Innovación, I+D y laboratorios",
      mapsTo: "ciencia",
    },
    {
      slug: "sector-publico-policy",
      label: "Sector público, regulación y políticas públicas",
      mapsTo: "negocio",
    },
    {
      slug: "consumo-retail",
      label: "Retail, consumo masivo y ecommerce",
      mapsTo: "negocio",
    },
    {
      slug: "real-estate-proptech",
      label: "Real estate, urbanismo y proptech",
      mapsTo: "negocio",
    },
    {
      slug: "hospitality-travel",
      label: "Hospitality, travel y turismo",
      mapsTo: "operaciones",
    },
    {
      slug: "industria-manufactura",
      label: "Industria, manufactura y calidad",
      mapsTo: "operaciones",
    },
    {
      slug: "agrifood-cadena",
      label: "Agro, alimentación y cadena de suministro",
      mapsTo: "operaciones",
    },
    {
      slug: "wellness-sports",
      label: "Wellness, deporte y salud orientada al consumidor",
      mapsTo: "producto",
    },
    {
      slug: "gaming-comunidades",
      label: "Gaming, entretenimiento digital y comunidades",
      mapsTo: "producto",
    },
    {
      slug: "hardware-iot",
      label: "Hardware, IoT y sistemas embebidos",
      mapsTo: "tecnico",
    },
    {
      slug: "qa-automation",
      label: "QA, calidad de software y automatización",
      mapsTo: "tecnico",
    },
    {
      slug: "customer-success",
      label: "Customer success, implementación y cuentas clave",
      mapsTo: "negocio",
    },
    {
      slug: "creator-media",
      label: "Creator economy, medios y narrativa",
      mapsTo: "negocio",
    },
    {
      slug: "impacto-social-ong",
      label: "Impacto social, fundaciones y tercer sector",
      mapsTo: "negocio",
    },
    {
      slug: "expansion-internacional",
      label: "Internacionalización y expansión de mercados",
      mapsTo: "negocio",
    },
    {
      slug: "pmo-delivery",
      label: "PMO, proyectos y delivery multifuncional",
      mapsTo: "operaciones",
    },
    {
      slug: "insights-research-ops",
      label: "Research ops, insights y conocimiento del usuario",
      mapsTo: "producto",
    },
    {
      slug: "riesgo-auditoria",
      label: "Riesgo, auditoría interna y controles",
      mapsTo: "negocio",
    },
    {
      slug: "energia-utilities",
      label: "Energía, utilities y transición energética",
      mapsTo: "operaciones",
    },
    {
      slug: "quimica-materiales",
      label: "Química, materiales y procesos industriales",
      mapsTo: "ciencia",
    },
    {
      slug: "fintech-insurtech-ops",
      label: "Operaciones en fintech, insurtech y pagos",
      mapsTo: "negocio",
    },
    {
      slug: "generalista-producto-negocio",
      label: "Generalista puente producto–negocio",
      mapsTo: "producto",
    },
    {
      slug: "generalista-tech-producto",
      label: "Generalista puente ingeniería–producto",
      mapsTo: "tecnico",
    },
    {
      slug: "cross-industria-estrategia",
      label: "Estrategia y desarrollo cross-industria",
      mapsTo: "negocio",
    },
    {
      slug: "multisector-operaciones",
      label: "Operaciones y eficiencia multisector",
      mapsTo: "operaciones",
    },
    {
      slug: "multidisciplina-investigacion",
      label: "Perfil multidisciplina en investigación aplicada",
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
