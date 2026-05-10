/**
 * Industry domain → leaves. Must stay aligned with
 * `supabase/migrations/20260510120000_industry_hierarchy.sql` (slugs + display names).
 * Only leaf rows should appear in profile_industries / search_industries.
 */

export interface IndustryDomain {
  slug: string
  label: string
  sortOrder: number
}

export interface IndustryLeaf {
  slug: string
  label: string
}

export const INDUSTRY_DOMAINS: readonly IndustryDomain[] = [
  { slug: "producto-digital-tech", label: "Producto digital y tecnología", sortOrder: 5 },
  { slug: "ciencia-ingenieria", label: "Ciencia, ingeniería y ambiente", sortOrder: 10 },
  { slug: "artes-creativo", label: "Artes, medios y entretenimiento", sortOrder: 15 },
  { slug: "espacio-urbano", label: "Espacio, urbanismo e inmobiliario", sortOrder: 20 },
  { slug: "educacion-cultura", label: "Educación y cultura", sortOrder: 25 },
  { slug: "salud-deporte", label: "Salud, bienestar y deporte", sortOrder: 30 },
  { slug: "impacto-comunidad", label: "Impacto social y comunidad", sortOrder: 35 },
  { slug: "negocio-servicios", label: "Negocio, ventas y servicios", sortOrder: 40 },
] as const

export const INDUSTRY_LEAVES_BY_DOMAIN: Readonly<
  Record<string, readonly IndustryLeaf[]>
> = {
  "producto-digital-tech": [
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
  ],
  "ciencia-ingenieria": [
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
  ],
  "artes-creativo": [
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
    { slug: "video-y-produccion-audiovisual", label: "Video y producción audiovisual" },
    { slug: "escenografia-y-direccion-de-arte", label: "Escenografía y dirección de arte" },
    { slug: "videojuegos-y-narrativa-interactiva", label: "Videojuegos y narrativa interactiva" },
  ],
  "espacio-urbano": [
    { slug: "construccion", label: "Construcción" },
    { slug: "real-estate", label: "Real Estate" },
  ],
  "educacion-cultura": [{ slug: "educacion", label: "Educación" }],
  "salud-deporte": [
    { slug: "salud", label: "Salud" },
    { slug: "wellness", label: "Wellness" },
    { slug: "sports", label: "Sports" },
  ],
  "impacto-comunidad": [
    { slug: "impacto-social", label: "Impacto social" },
    { slug: "comunidad", label: "Comunidad" },
  ],
  "negocio-servicios": [
    { slug: "consumer", label: "Consumer" },
    { slug: "b2b", label: "B2B" },
    { slug: "retail", label: "Retail" },
    { slug: "ventas", label: "Ventas" },
    { slug: "marketing", label: "Marketing" },
    { slug: "recruiting", label: "Recruiting" },
    { slug: "seguros", label: "Seguros" },
  ],
}

const _slugToLabel = new Map<string, string>()
const _labelToDomain = new Map<string, string>()

for (const domain of INDUSTRY_DOMAINS) {
  _slugToLabel.set(domain.slug, domain.label)
}

for (const [domainSlug, leaves] of Object.entries(INDUSTRY_LEAVES_BY_DOMAIN)) {
  for (const { slug, label } of leaves) {
    _slugToLabel.set(slug, label)
    _labelToDomain.set(label, domainSlug)
  }
}

/** Slug → display name (domains + leaves). */
export const INDUSTRY_SLUG_TO_LABEL: ReadonlyMap<string, string> = _slugToLabel

/** Leaf label → parent domain slug. */
export function domainSlugForLeafLabel(label: string): string | undefined {
  return _labelToDomain.get(label)
}

/** All leaf labels (for flat search / completeness). */
export const ALL_INDUSTRY_LEAF_LABELS: readonly string[] = Object.values(
  INDUSTRY_LEAVES_BY_DOMAIN
).flatMap((leaves) => leaves.map((l) => l.label))

export function leavesForDomain(domainSlug: string): readonly IndustryLeaf[] {
  return INDUSTRY_LEAVES_BY_DOMAIN[domainSlug] ?? []
}

/** Default domain for the selector when nothing picked yet. */
export const DEFAULT_INDUSTRY_DOMAIN_SLUG = INDUSTRY_DOMAINS[0].slug
