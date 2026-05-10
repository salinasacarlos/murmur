/**
 * Verticales (hojas) agrupadas por industria de producto (`public.industries` /
 * `INDUSTRIES` en profile-taxonomy). Alineado con migración
 * `20260524120000_industries_catalog_profile_parents.sql`.
 * Solo las hojas deben usarse en profile_industries / search_industries.
 */

import { INDUSTRIES } from "@/lib/profile-taxonomy"

export interface IndustryLeaf {
  slug: string
  label: string
}

/** Cada hoja del catálogo jerárquico → una industria de perfil (slug). */
export const LEAF_SLUG_TO_PROFILE_INDUSTRY: Readonly<Record<string, string>> = {
  // Finanzas y fintech
  fintech: "finanzas-fintech",
  insurtech: "finanzas-fintech",
  crypto: "finanzas-fintech",
  pagos: "finanzas-fintech",
  lending: "finanzas-fintech",
  "open-finance": "finanzas-fintech",
  "finanzas-personales": "finanzas-fintech",
  seguros: "finanzas-fintech",

  healthtech: "salud-biotech",
  biotech: "salud-biotech",
  salud: "salud-biotech",

  edtech: "educacion",
  educacion: "educacion",

  // Tecnología e IA
  saas: "tecnologia-ia",
  "b2b-saas": "tecnologia-ia",
  devtools: "tecnologia-ia",
  ai: "tecnologia-ia",
  deeptech: "tecnologia-ia",
  infra: "tecnologia-ia",
  cybersecurity: "tecnologia-ia",
  data: "tecnologia-ia",
  analytics: "tecnologia-ia",
  productividad: "tecnologia-ia",
  "no-code": "tecnologia-ia",
  web3: "tecnologia-ia",
  iot: "tecnologia-ia",
  "ar-vr": "tecnologia-ia",
  telecom: "tecnologia-ia",
  hardware: "tecnologia-ia",
  robotics: "tecnologia-ia",
  govtech: "gobierno-sector-publico",

  marketplace: "retail-comercio",
  "e-commerce": "retail-comercio",

  gaming: "entretenimiento-medios",
  media: "entretenimiento-medios",
  entertainment: "entretenimiento-medios",
  cine: "entretenimiento-medios",
  teatro: "entretenimiento-medios",
  musica: "entretenimiento-medios",
  "radio-y-podcast": "entretenimiento-medios",
  documental: "entretenimiento-medios",
  animacion: "entretenimiento-medios",
  "video-y-produccion-audiovisual": "entretenimiento-medios",
  "videojuegos-y-narrativa-interactiva": "entretenimiento-medios",
  "creator-economy": "entretenimiento-medios",

  arquitectura: "artes-diseno-creativo",
  danza: "artes-diseno-creativo",
  diseno: "artes-diseno-creativo",
  moda: "artes-diseno-creativo",
  fotografia: "artes-diseno-creativo",
  periodismo: "artes-diseno-creativo",
  "museos-y-patrimonio": "artes-diseno-creativo",
  literatura: "artes-diseno-creativo",
  "artes-plasticas-y-visuales": "artes-diseno-creativo",
  "escenografia-y-direccion-de-arte": "artes-diseno-creativo",

  construccion: "construccion-inmobiliario",
  "real-estate": "construccion-inmobiliario",
  proptech: "construccion-inmobiliario",

  manufactura: "manufactura-industria",
  "supply-chain": "manufactura-industria",
  logistica: "manufactura-industria",
  movilidad: "manufactura-industria",
  transporte: "manufactura-industria",
  aeroespacial: "manufactura-industria",

  climate: "energia-sustentabilidad",
  sostenibilidad: "energia-sustentabilidad",
  energia: "energia-sustentabilidad",

  agtech: "agro-alimentacion",
  foodtech: "agro-alimentacion",

  traveltech: "turismo-hospitalidad",

  legaltech: "legal-consultoria",
  hrtech: "legal-consultoria",
  recruiting: "legal-consultoria",

  "impacto-social": "gobierno-sector-publico",
  comunidad: "gobierno-sector-publico",

  consumer: "retail-comercio",
  b2b: "retail-comercio",
  retail: "retail-comercio",
  ventas: "retail-comercio",
  marketing: "retail-comercio",

  wellness: "deporte-bienestar",
  sports: "deporte-bienestar",
}

/** Fuente única de hojas (slugs + labels); coincide con seeds históricos del catálogo. */
const ALL_LEAVES: readonly IndustryLeaf[] = [
  { slug: "fintech", label: "Fintech" },
  { slug: "healthtech", label: "Healthtech" },
  { slug: "edtech", label: "Edtech" },
  { slug: "saas", label: "SaaS" },
  { slug: "b2b-saas", label: "B2B SaaS" },
  { slug: "devtools", label: "DevTools" },
  { slug: "ai", label: "AI" },
  { slug: "deeptech", label: "DeepTech" },
  { slug: "crypto", label: "Crypto" },
  { slug: "marketplace", label: "Marketplace" },
  { slug: "infra", label: "Infra" },
  { slug: "gaming", label: "Gaming" },
  { slug: "e-commerce", label: "E-commerce" },
  { slug: "cybersecurity", label: "Cybersecurity" },
  { slug: "data", label: "Data" },
  { slug: "analytics", label: "Analytics" },
  { slug: "creator-economy", label: "Creator Economy" },
  { slug: "legaltech", label: "Legaltech" },
  { slug: "insurtech", label: "Insurtech" },
  { slug: "agtech", label: "Agtech" },
  { slug: "foodtech", label: "Foodtech" },
  { slug: "traveltech", label: "Traveltech" },
  { slug: "productividad", label: "Productividad" },
  { slug: "finanzas-personales", label: "Finanzas personales" },
  { slug: "pagos", label: "Pagos" },
  { slug: "lending", label: "Lending" },
  { slug: "open-finance", label: "Open Finance" },
  { slug: "govtech", label: "GovTech" },
  { slug: "no-code", label: "No-code" },
  { slug: "web3", label: "Web3" },
  { slug: "iot", label: "IoT" },
  { slug: "ar-vr", label: "AR/VR" },
  { slug: "proptech", label: "Proptech" },
  { slug: "telecom", label: "Telecom" },
  { slug: "hrtech", label: "HRTech" },
  { slug: "biotech", label: "Biotech" },
  { slug: "robotics", label: "Robotics" },
  { slug: "climate", label: "Climate" },
  { slug: "hardware", label: "Hardware" },
  { slug: "energia", label: "Energía" },
  { slug: "movilidad", label: "Movilidad" },
  { slug: "transporte", label: "Transporte" },
  { slug: "supply-chain", label: "Supply Chain" },
  { slug: "manufactura", label: "Manufactura" },
  { slug: "sostenibilidad", label: "Sostenibilidad" },
  { slug: "aeroespacial", label: "Aeroespacial" },
  { slug: "logistica", label: "Logística" },
  { slug: "media", label: "Media" },
  { slug: "entertainment", label: "Entertainment" },
  { slug: "arquitectura", label: "Arquitectura" },
  { slug: "cine", label: "Cine" },
  { slug: "teatro", label: "Teatro" },
  { slug: "musica", label: "Música" },
  { slug: "danza", label: "Danza" },
  { slug: "diseno", label: "Diseño" },
  { slug: "moda", label: "Moda" },
  { slug: "fotografia", label: "Fotografía" },
  { slug: "periodismo", label: "Periodismo" },
  { slug: "radio-y-podcast", label: "Radio y podcast" },
  { slug: "museos-y-patrimonio", label: "Museos y patrimonio" },
  { slug: "literatura", label: "Literatura" },
  { slug: "artes-plasticas-y-visuales", label: "Artes plásticas y visuales" },
  { slug: "documental", label: "Documental" },
  { slug: "animacion", label: "Animación" },
  {
    slug: "video-y-produccion-audiovisual",
    label: "Video y producción audiovisual",
  },
  {
    slug: "escenografia-y-direccion-de-arte",
    label: "Escenografía y dirección de arte",
  },
  {
    slug: "videojuegos-y-narrativa-interactiva",
    label: "Videojuegos y narrativa interactiva",
  },
  { slug: "construccion", label: "Construcción" },
  { slug: "real-estate", label: "Real Estate" },
  { slug: "educacion", label: "Educación" },
  { slug: "salud", label: "Salud" },
  { slug: "wellness", label: "Wellness" },
  { slug: "sports", label: "Sports" },
  { slug: "impacto-social", label: "Impacto social" },
  { slug: "comunidad", label: "Comunidad" },
  { slug: "consumer", label: "Consumer" },
  { slug: "b2b", label: "B2B" },
  { slug: "retail", label: "Retail" },
  { slug: "ventas", label: "Ventas" },
  { slug: "marketing", label: "Marketing" },
  { slug: "recruiting", label: "Recruiting" },
  { slug: "seguros", label: "Seguros" },
]

function assertLeafCoverageMap() {
  if (process.env.NODE_ENV === "production") return
  for (const leaf of ALL_LEAVES) {
    if (!LEAF_SLUG_TO_PROFILE_INDUSTRY[leaf.slug]) {
      throw new Error(
        `industry-tree: falta LEAF_SLUG_TO_PROFILE_INDUSTRY para ${leaf.slug}`
      )
    }
  }
  for (const slug of Object.keys(LEAF_SLUG_TO_PROFILE_INDUSTRY)) {
    if (!ALL_LEAVES.some((l) => l.slug === slug)) {
      throw new Error(`industry-tree: slug extra en mapa: ${slug}`)
    }
  }
}
assertLeafCoverageMap()

function buildLeavesByProfileIndustry(): Readonly<
  Record<string, readonly IndustryLeaf[]>
> {
  const out: Record<string, IndustryLeaf[]> = {}
  for (const ind of INDUSTRIES) {
    out[ind.slug] = []
  }
  for (const leaf of ALL_LEAVES) {
    const p = LEAF_SLUG_TO_PROFILE_INDUSTRY[leaf.slug]!
    if (!out[p]) out[p] = []
    out[p]!.push(leaf)
  }
  for (const k of Object.keys(out)) {
    out[k]!.sort((a, b) => a.label.localeCompare(b.label, "es"))
  }
  return out
}

/** Verticales por industria de perfil (tabs del selector). */
export const INDUSTRY_LEAVES_BY_PROFILE_INDUSTRY: Readonly<
  Record<string, readonly IndustryLeaf[]>
> = buildLeavesByProfileIndustry()

const _slugToLabel = new Map<string, string>()
const _labelToProfileIndustry = new Map<string, string>()

for (const ind of INDUSTRIES) {
  _slugToLabel.set(ind.slug, ind.label)
}

for (const leaf of ALL_LEAVES) {
  _slugToLabel.set(leaf.slug, leaf.label)
  _labelToProfileIndustry.set(
    leaf.label,
    LEAF_SLUG_TO_PROFILE_INDUSTRY[leaf.slug]!
  )
}

/** Slug (industria de perfil o vertical) → nombre mostrado. */
export const INDUSTRY_SLUG_TO_LABEL: ReadonlyMap<string, string> = _slugToLabel

/** Vertical (por label) → industria de perfil activa sugerida. */
export function profileIndustrySlugForLeafLabel(
  label: string
): string | undefined {
  return _labelToProfileIndustry.get(label)
}

/** Todas las etiquetas de verticales (búsqueda / completitud). */
export const ALL_INDUSTRY_LEAF_LABELS: readonly string[] = ALL_LEAVES.map(
  (l) => l.label
)

export function leavesForProfileIndustry(
  profileIndustrySlug: string
): readonly IndustryLeaf[] {
  return INDUSTRY_LEAVES_BY_PROFILE_INDUSTRY[profileIndustrySlug] ?? []
}

/** Primera industria de perfil por sortOrder del catálogo. */
export const DEFAULT_PROFILE_INDUSTRY_SLUG = INDUSTRIES[0]!.slug

/** @deprecated usar profileIndustrySlugForLeafLabel */
export function domainSlugForLeafLabel(
  label: string
): string | undefined {
  return profileIndustrySlugForLeafLabel(label)
}

/** @deprecated usar leavesForProfileIndustry */
export function leavesForDomain(
  domainSlug: string
): readonly IndustryLeaf[] {
  return leavesForProfileIndustry(domainSlug)
}

/** @deprecated usar DEFAULT_PROFILE_INDUSTRY_SLUG */
export const DEFAULT_INDUSTRY_DOMAIN_SLUG = DEFAULT_PROFILE_INDUSTRY_SLUG
