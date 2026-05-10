import type { FunctionalArea } from "@/lib/types"

/** Industria principal (perfil / búsqueda): una sola. */
export interface IndustryDefinition {
  slug: string
  label: string
  sortOrder: number
  mapsTo: FunctionalArea
}

/** Expertise dentro de la industria elegida (máx. 5 en UI). */
export interface ExpertiseDefinition {
  slug: string
  label: string
  sortOrder: number
  mapsTo: FunctionalArea
}

export interface TalentDefinition {
  slug: string
  label: string
  sortOrder: number
}

function slugify(label: string): string {
  return label
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

type Seed = {
  slug: string
  label: string
  mapsTo: FunctionalArea
  expertiseLabels: readonly string[]
}

const INDUSTRY_SEEDS: readonly Seed[] = [
  {
    slug: "tecnologia-ia",
    label: "Tecnología e IA",
    mapsTo: "tecnico",
    expertiseLabels: [
      "Software",
      "Hardware",
      "Ciberseguridad",
      "Datos",
      "Nube",
      "Robótica",
      "IA generativa",
      "IoT",
      "Blockchain",
      "Realidad virtual/aumentada",
      "Semiconductores",
      "Telecomunicaciones",
      "Automatización",
      "Desarrollo web/móvil",
      "Open source",
    ],
  },
  {
    slug: "salud-biotech",
    label: "Salud y biotech",
    mapsTo: "ciencia",
    expertiseLabels: [
      "Medicina clínica",
      "Farmacéutica",
      "Genómica",
      "Salud mental",
      "Dispositivos médicos",
      "Telemedicina",
      "Neurociencia",
      "Oncología",
      "Salud preventiva",
      "Nutrición clínica",
      "Rehabilitación",
      "Salud pública",
      "Bioingeniería",
      "Laboratorios",
      "Medicina tradicional/alternativa",
    ],
  },
  {
    slug: "educacion",
    label: "Educación",
    mapsTo: "producto",
    expertiseLabels: [
      "Educación básica/media",
      "Universitaria",
      "Formación corporativa",
      "Edtech",
      "Educación alternativa",
      "Pedagogía",
      "Orientación vocacional",
      "Educación especial",
      "Idiomas",
      "Tutorías",
      "Certificaciones profesionales",
      "Educación a distancia",
      "Bibliotecología",
    ],
  },
  {
    slug: "finanzas-fintech",
    label: "Finanzas y fintech",
    mapsTo: "negocio",
    expertiseLabels: [
      "Banca",
      "Inversión",
      "Seguros",
      "Cripto",
      "Pagos digitales",
      "Finanzas personales",
      "Capital de riesgo",
      "Fondos de inversión",
      "Contabilidad",
      "Auditoría financiera",
      "Microfinanzas",
      "Mercados de capitales",
      "Economía conductual",
      "Planeación fiscal",
    ],
  },
  {
    slug: "entretenimiento-medios",
    label: "Entretenimiento y medios",
    mapsTo: "producto",
    expertiseLabels: [
      "Cine",
      "Música",
      "Videojuegos",
      "Streaming",
      "Podcasting",
      "Prensa digital",
      "Teatro",
      "Televisión",
      "Animación",
      "Cómics/novela gráfica",
      "Eventos en vivo",
      "Realidad virtual inmersiva",
      "Producción audiovisual",
      "Relaciones públicas",
    ],
  },
  {
    slug: "artes-diseno-creativo",
    label: "Artes y diseño creativo",
    mapsTo: "producto",
    expertiseLabels: [
      "Diseño gráfico",
      "Arquitectura",
      "Moda",
      "Fotografía",
      "Arte contemporáneo",
      "Artesanía",
      "Ilustración",
      "Diseño industrial",
      "Diseño UX/UI",
      "Escultura",
      "Muralismo",
      "Joyería",
      "Cerámica",
      "Dirección de arte",
      "Diseño editorial",
    ],
  },
  {
    slug: "construccion-inmobiliario",
    label: "Construcción e inmobiliario",
    mapsTo: "operaciones",
    expertiseLabels: [
      "Desarrollo urbano",
      "Infraestructura",
      "Proptech",
      "Diseño de interiores",
      "Ingeniería civil",
      "Gestión de obra",
      "Valuación",
      "Urbanismo",
      "Paisajismo",
      "Arquitectura sustentable",
      "Facility management",
      "Vivienda social",
    ],
  },
  {
    slug: "manufactura-industria",
    label: "Manufactura e industria",
    mapsTo: "operaciones",
    expertiseLabels: [
      "Automotriz",
      "Electrónica",
      "Textil",
      "Química",
      "Logística",
      "Aeroespacial",
      "Impresión 3D",
      "Control de calidad",
      "Cadena de suministro",
      "Empaque",
      "Metalmecánica",
      "Industria naval",
      "Maquinaria pesada",
      "Industria del plástico",
    ],
  },
  {
    slug: "agro-alimentacion",
    label: "Agro y alimentación",
    mapsTo: "operaciones",
    expertiseLabels: [
      "Agricultura",
      "Ganadería",
      "Procesamiento de alimentos",
      "Agritech",
      "Restauración",
      "Acuacultura",
      "Viticultura",
      "Industria orgánica",
      "Agroexportación",
      "Packaging alimentario",
      "Investigación agrícola",
      "Silvicultura",
      "Food design",
    ],
  },
  {
    slug: "gobierno-sector-publico",
    label: "Gobierno y sector público",
    mapsTo: "negocio",
    expertiseLabels: [
      "Política pública",
      "Administración",
      "Seguridad",
      "Justicia",
      "Diplomacia",
      "Gestión municipal",
      "Planeación urbana",
      "Transparencia",
      "Relaciones internacionales",
      "Defensa",
      "Servicios sociales",
      "Salud pública",
      "Migración",
      "Regulación",
    ],
  },
  {
    slug: "turismo-hospitalidad",
    label: "Turismo y hospitalidad",
    mapsTo: "negocio",
    expertiseLabels: [
      "Hotelería",
      "Viajes",
      "Gastronomía",
      "Experiencias",
      "Turismo de aventura",
      "Turismo cultural",
      "Agencias de viaje",
      "Guías turísticos",
      "Turismo médico",
      "Turismo sustentable",
      "Cruceros",
      "Aerolíneas",
      "Concierge",
    ],
  },
  {
    slug: "energia-sustentabilidad",
    label: "Energía y sustentabilidad",
    mapsTo: "ciencia",
    expertiseLabels: [
      "Energías renovables",
      "Oil & gas",
      "Gestión ambiental",
      "Economía circular",
      "Eficiencia energética",
      "Energía solar",
      "Eólica",
      "Hidrógeno verde",
      "Gestión de residuos",
      "Movilidad eléctrica",
      "Carbono neutro",
      "Consultoría ambiental",
    ],
  },
  {
    slug: "retail-comercio",
    label: "Retail y comercio",
    mapsTo: "negocio",
    expertiseLabels: [
      "E-commerce",
      "Retail físico",
      "Supply chain",
      "Marcas",
      "Merchandising",
      "Experiencia del cliente",
      "Marketplaces",
      "Franquicias",
      "Comercio justo",
      "Retail media",
      "Distribución",
      "Importación/exportación",
    ],
  },
  {
    slug: "legal-consultoria",
    label: "Legal y consultoría",
    mapsTo: "negocio",
    expertiseLabels: [
      "Derecho corporativo",
      "Consultoría estratégica",
      "RR.HH.",
      "Auditoría",
      "Propiedad intelectual",
      "Derecho laboral",
      "Notariado",
      "Mediación",
      "Compliance",
      "Derecho internacional",
      "Consultoría de innovación",
      "Gestión del cambio",
    ],
  },
  {
    slug: "deporte-bienestar",
    label: "Deporte y bienestar",
    mapsTo: "producto",
    expertiseLabels: [
      "Fitness",
      "Nutrición",
      "Deportes profesionales",
      "Medicina deportiva",
      "Yoga/meditación",
      "Coaching",
      "Deportes electrónicos",
      "Gestión deportiva",
      "Psicología del deporte",
      "Biohacking",
      "Spas y wellness",
      "Deporte adaptado",
    ],
  },
] as const

function buildFromSeeds(): {
  industries: readonly IndustryDefinition[]
  expertiseByIndustry: Readonly<Record<string, readonly ExpertiseDefinition[]>>
} {
  const industries: IndustryDefinition[] = []
  const expertiseByIndustry: Record<string, ExpertiseDefinition[]> = {}
  let iOrd = 10
  for (const seed of INDUSTRY_SEEDS) {
    industries.push({
      slug: seed.slug,
      label: seed.label,
      sortOrder: iOrd,
      mapsTo: seed.mapsTo,
    })
    iOrd += 10
    const ex: ExpertiseDefinition[] = []
    let eOrd = 10
    const usedSlugs = new Set<string>()
    for (const label of seed.expertiseLabels) {
      let piece = slugify(label)
      let slug = `${seed.slug}-${piece}`
      let n = 2
      while (usedSlugs.has(slug)) {
        slug = `${seed.slug}-${piece}-${n}`
        n++
      }
      usedSlugs.add(slug)
      ex.push({
        slug,
        label,
        sortOrder: eOrd,
        mapsTo: seed.mapsTo,
      })
      eOrd += 10
    }
    expertiseByIndustry[seed.slug] = ex
  }
  return { industries, expertiseByIndustry }
}

const built = buildFromSeeds()

export const INDUSTRIES: readonly IndustryDefinition[] = built.industries

export const EXPERTISE_BY_INDUSTRY: Readonly<
  Record<string, readonly ExpertiseDefinition[]>
> = built.expertiseByIndustry

export const ALL_EXPERTISE: readonly ExpertiseDefinition[] =
  INDUSTRIES.flatMap((ind) => EXPERTISE_BY_INDUSTRY[ind.slug] ?? [])

const TALENT_LABELS: readonly string[] = [
  "Comunicación",
  "Liderazgo",
  "Pensamiento estratégico",
  "Creatividad",
  "Resolución de problemas",
  "Colaboración",
  "Adaptabilidad",
  "Gestión de proyectos",
  "Negociación",
  "Pensamiento analítico",
  "Facilitación",
  "Empatía",
  "Toma de decisiones",
  "Innovación",
  "Gestión del tiempo",
  "Visión de negocio",
  "Investigación",
  "Mentoría",
  "Storytelling",
  "Resiliencia",
  "Escucha activa",
  "Pensamiento crítico",
  "Gestión del cambio",
  "Inteligencia emocional",
  "Trabajo bajo presión",
  "Curiosidad",
  "Persuasión",
  "Síntesis de información",
  "Planificación",
  "Autonomía",
  "Networking",
  "Mediación de conflictos",
  "Pensamiento sistémico",
  "Orientación a resultados",
  "Aprendizaje continuo",
  "Proactividad",
  "Gestión de equipos",
  "Atención al detalle",
  "Visión de usuario",
  "Cocreación",
  "Priorización",
  "Gestión de la incertidumbre",
  "Pensamiento lateral",
  "Construcción de comunidad",
  "Influencia sin autoridad",
  "Gestión de stakeholders",
  "Conciencia cultural",
  "Ética profesional",
  "Generación de ideas",
  "Ejecución",
]

function buildTalentDefinitions(): TalentDefinition[] {
  const used = new Set<string>()
  const out: TalentDefinition[] = []
  let ord = 10
  for (const label of TALENT_LABELS) {
    let base = slugify(label)
    let slug = base
    let n = 2
    while (used.has(slug)) {
      slug = `${base}-${n}`
      n++
    }
    used.add(slug)
    out.push({ slug, label, sortOrder: ord })
    ord += 10
  }
  return out
}

export const TALENTS: readonly TalentDefinition[] = buildTalentDefinitions()

const INDUSTRY_MAP = new Map(INDUSTRIES.map((a) => [a.slug, a]))
const EXPERTISE_MAP = new Map(ALL_EXPERTISE.map((e) => [e.slug, e]))
const TALENT_MAP = new Map(TALENTS.map((t) => [t.slug, t]))

export function labelIndustrySlug(slug: string): string {
  return INDUSTRY_MAP.get(slug)?.label ?? slug
}

export function labelExpertiseSlug(slug: string): string {
  return EXPERTISE_MAP.get(slug)?.label ?? slug
}

export function labelTalentSlug(slug: string): string {
  return TALENT_MAP.get(slug)?.label ?? slug
}

export function mapsToForExpertiseSlug(slug: string): FunctionalArea | undefined {
  return EXPERTISE_MAP.get(slug)?.mapsTo
}

export function mapsToForIndustrySlug(slug: string): FunctionalArea | undefined {
  return INDUSTRY_MAP.get(slug)?.mapsTo
}

export function expertiseSlugsForIndustry(industrySlug: string): string[] {
  return (EXPERTISE_BY_INDUSTRY[industrySlug] ?? []).map((e) => e.slug)
}

export function resolveProfileArea(
  primaryIndustrySlug: string | null | undefined,
  expertiseSlugs: string[] | null | undefined
): FunctionalArea {
  const firstExpertise = expertiseSlugs?.[0]
  if (firstExpertise) {
    const m = mapsToForExpertiseSlug(firstExpertise)
    if (m) return m
  }
  if (primaryIndustrySlug) {
    const a = mapsToForIndustrySlug(primaryIndustrySlug)
    if (a) return a
  }
  return "negocio"
}

export function inferIndustryFromExpertiseSlugs(
  slugs: string[] | null | undefined
): string | null {
  if (!slugs?.length) return null
  for (const s of slugs) {
    for (const ind of INDUSTRIES) {
      const list = EXPERTISE_BY_INDUSTRY[ind.slug]
      if (list?.some((e) => e.slug === s)) return ind.slug
    }
  }
  return null
}

export function defaultIndustryForFunctionalArea(area: FunctionalArea): string {
  switch (area) {
    case "tecnico":
      return "tecnologia-ia"
    case "producto":
      return "artes-diseno-creativo"
    case "negocio":
      return "retail-comercio"
    case "operaciones":
      return "manufactura-industria"
    case "ciencia":
      return "salud-biotech"
    default:
      return "retail-comercio"
  }
}

/**
 * Industria de referencia del perfil (misma regla que la tarjeta / multiselect de expertise).
 * Debe coincidir con lo que usa la UI al elegir slugs, para que al guardar no se re-filtre distinto.
 */
export function resolveHeroIndustrySlug(input: {
  primaryIndustrySlug?: string | null
  expertiseSlugs?: string[] | null | undefined
  functionalAreaTags?: string[] | null | undefined
  area: FunctionalArea
}): string {
  return (
    input.primaryIndustrySlug ??
    inferIndustryFromExpertiseSlugs(
      input.expertiseSlugs?.length
        ? input.expertiseSlugs
        : input.functionalAreaTags
    ) ??
    defaultIndustryForFunctionalArea(input.area)
  )
}

export function deriveEditableTaxonomy(input: {
  primaryIndustrySlug?: string | null
  expertiseSlugs?: string[] | null | undefined
  functionalAreaTags?: string[] | null | undefined
  area?: FunctionalArea
}): { primaryIndustrySlug: string | null; expertiseSlugs: string[] } {
  const inferred =
    input.primaryIndustrySlug ??
    inferIndustryFromExpertiseSlugs(
      input.expertiseSlugs?.length
        ? input.expertiseSlugs
        : input.functionalAreaTags ?? []
    ) ??
    (input.area ? defaultIndustryForFunctionalArea(input.area) : null)
  const allowed = inferred ? new Set(expertiseSlugsForIndustry(inferred)) : null
  const raw =
    input.expertiseSlugs?.length
      ? input.expertiseSlugs
      : (input.functionalAreaTags ?? [])
  const expertiseFiltered =
    allowed && allowed.size > 0
      ? raw.filter((s) => allowed!.has(s)).slice(0, 5)
      : [...raw].slice(0, 5)
  return { primaryIndustrySlug: inferred, expertiseSlugs: expertiseFiltered }
}

/** Etiqueta legada para slugs antiguos no presentes en el catálogo actual. */
export function labelLegacyFunctionalTag(slug: string): string {
  return labelExpertiseSlug(slug)
}
