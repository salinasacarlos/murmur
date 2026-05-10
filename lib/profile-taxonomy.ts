import type { FunctionalArea } from "@/lib/types"
import { filterVerticalSlugsForIndustrySlug } from "@/lib/leaf-catalog"
import { INDUSTRY_EXPERTISE_ROLE_SEEDS } from "@/lib/industry-expertise-role-seeds"

/** Industria principal (perfil / búsqueda): una sola. */
export interface IndustryDefinition {
  slug: string
  label: string
  sortOrder: number
  mapsTo: FunctionalArea
}

/** Roles de expertise bajo la industria (máx. en UI: MAX_EXPERTISE_SLUGS). */
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

/** Máximo de roles de expertise seleccionables (perfil, búsqueda, filtros). */
export const MAX_EXPERTISE_SLUGS = 3

function buildFromSeeds(): {
  industries: readonly IndustryDefinition[]
  expertiseByVertical: Readonly<Record<string, readonly ExpertiseDefinition[]>>
} {
  const industries: IndustryDefinition[] = []
  const expertiseByVertical: Record<string, ExpertiseDefinition[]> = {}
  let iOrd = 10
  for (const seed of INDUSTRY_EXPERTISE_ROLE_SEEDS) {
    industries.push({
      slug: seed.slug,
      label: seed.label,
      sortOrder: iOrd,
      mapsTo: seed.mapsTo,
    })
    iOrd += 10
    const genKey = `${seed.slug}-general`
    const ex: ExpertiseDefinition[] = []
    let eOrd = 10
    const usedSlugs = new Set<string>()
    for (const row of seed.expertise) {
      const slug = `${seed.slug}-${row.slugSuffix}`
      if (usedSlugs.has(slug)) {
        throw new Error(`industry-expertise-role-seeds: slug duplicado ${slug}`)
      }
      usedSlugs.add(slug)
      ex.push({
        slug,
        label: row.label,
        sortOrder: eOrd,
        mapsTo: seed.mapsTo,
      })
      eOrd += 10
    }
    expertiseByVertical[genKey] = ex
  }
  return { industries, expertiseByVertical }
}

const built = buildFromSeeds()

export const INDUSTRIES: readonly IndustryDefinition[] = built.industries

/** Catálogo de roles (expertise) por vertical; hoy todas las filas viven bajo `{industria}-general` en DB. */
export const EXPERTISE_BY_VERTICAL: Readonly<
  Record<string, readonly ExpertiseDefinition[]>
> = built.expertiseByVertical

/** @deprecated Usar EXPERTISE_BY_VERTICAL[`${ind}-general`] o expertiseListForIndustryVerticals. */
export const EXPERTISE_BY_INDUSTRY: Readonly<
  Record<string, readonly ExpertiseDefinition[]>
> = Object.fromEntries(
  INDUSTRIES.map((ind) => {
    const k = `${ind.slug}-general`
    return [ind.slug, built.expertiseByVertical[k] ?? []]
  })
) as Readonly<Record<string, readonly ExpertiseDefinition[]>>

export const ALL_EXPERTISE: readonly ExpertiseDefinition[] = Object.values(
  EXPERTISE_BY_VERTICAL
).flat()

export function expertiseSlugsForGeneralVertical(
  industrySlug: string
): string[] {
  const k = `${industrySlug}-general`
  return (EXPERTISE_BY_VERTICAL[k] ?? []).map((e) => e.slug)
}

/** Opciones de roles (expertise) para las verticales elegidas; usa catálogo «General» como fallback por vertical sin filas propias. */
export function expertiseListForIndustryVerticals(
  industrySlug: string | null,
  verticalSlugs: readonly string[]
): readonly ExpertiseDefinition[] {
  if (!industrySlug || verticalSlugs.length === 0) return []
  const genKey = `${industrySlug}-general`
  const fallback = EXPERTISE_BY_VERTICAL[genKey] ?? []
  const bySlug = new Map<string, ExpertiseDefinition>()
  for (const v of verticalSlugs) {
    const list = EXPERTISE_BY_VERTICAL[v] ?? fallback
    for (const e of list) {
      bySlug.set(e.slug, e)
    }
  }
  return [...bySlug.values()].sort((a, b) => a.sortOrder - b.sortOrder)
}

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
    const base = slugify(label)
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
  verticalSlugs?: string[] | null | undefined
  expertiseSlugs?: string[] | null | undefined
  functionalAreaTags?: string[] | null | undefined
  area?: FunctionalArea
}): {
  primaryIndustrySlug: string | null
  verticalSlugs: string[]
  expertiseSlugs: string[]
} {
  const inferred =
    input.primaryIndustrySlug ??
    inferIndustryFromExpertiseSlugs(
      input.expertiseSlugs?.length
        ? input.expertiseSlugs
        : input.functionalAreaTags ?? []
    ) ??
    (input.area ? defaultIndustryForFunctionalArea(input.area) : null)

  const verticalFiltered = filterVerticalSlugsForIndustrySlug(
    inferred,
    input.verticalSlugs,
    3
  )

  const vertsForExpertise =
    verticalFiltered.length > 0
      ? verticalFiltered
      : inferred
        ? [`${inferred}-general`]
        : []

  const expertOpts =
    inferred && vertsForExpertise.length > 0
      ? expertiseListForIndustryVerticals(inferred, vertsForExpertise)
      : []
  const allowedExpert = new Set(expertOpts.map((e) => e.slug))

  const raw =
    input.expertiseSlugs?.length
      ? input.expertiseSlugs
      : (input.functionalAreaTags ?? [])
  const expertiseFiltered =
    allowedExpert.size > 0
      ? raw.filter((s) => allowedExpert.has(s)).slice(0, MAX_EXPERTISE_SLUGS)
      : [...raw].slice(0, MAX_EXPERTISE_SLUGS)

  return {
    primaryIndustrySlug: inferred,
    verticalSlugs: verticalFiltered,
    expertiseSlugs: expertiseFiltered,
  }
}

/** Etiqueta legada para slugs antiguos no presentes en el catálogo actual. */
export function labelLegacyFunctionalTag(slug: string): string {
  return labelExpertiseSlug(slug)
}
