import { resolveHeroIndustrySlug } from "@/lib/profile-taxonomy"
import type { Availability, Profile, RelationType } from "@/lib/types"

/** Filtros del feed «Descubrir» (client-side). */
export interface DiscoverFeedFilters {
  city: string
  availability: Availability | null
  relation: RelationType | null
  /** Industria principal (catálogo profile-taxonomy); null = sin filtrar. */
  primaryIndustrySlug: string | null
  /** Verticales (nivel 2); vacío = sin filtrar. */
  verticalSlugs: string[]
  /** Expertise (nivel 3); vacío = sin filtrar. */
  expertiseSlugs: string[]
  /** Soft skills; vacío = sin filtrar. */
  talentSlugs: string[]
}

export function emptyDiscoverFeedFilters(): DiscoverFeedFilters {
  return {
    city: "",
    availability: null,
    relation: null,
    primaryIndustrySlug: null,
    verticalSlugs: [],
    expertiseSlugs: [],
    talentSlugs: [],
  }
}

function heroIndustryForProfile(p: Profile): string {
  return resolveHeroIndustrySlug({
    primaryIndustrySlug: p.primaryIndustrySlug,
    expertiseSlugs: p.expertiseSlugs,
    functionalAreaTags: p.functionalAreaTags,
    area: p.area,
  })
}

function cityHaystack(p: Profile): string {
  const parts = [p.city, ...(p.cities ?? [])].filter(Boolean)
  return parts.join(" ").toLowerCase()
}

export function profileMatchesDiscoverFilters(
  p: Profile,
  f: DiscoverFeedFilters
): boolean {
  const q = f.city.trim().toLowerCase()
  if (q && !cityHaystack(p).includes(q)) return false

  if (f.availability && p.availability !== f.availability) return false

  if (f.relation && !p.relationsLooking.includes(f.relation)) return false

  if (f.primaryIndustrySlug) {
    if (heroIndustryForProfile(p) !== f.primaryIndustrySlug) return false
  }

  if (f.verticalSlugs.length > 0) {
    const pv = new Set(p.verticalSlugs ?? [])
    const hit = f.verticalSlugs.some((s) => pv.has(s))
    if (!hit) return false
  }

  if (f.expertiseSlugs.length > 0) {
    const pe = new Set(p.expertiseSlugs ?? [])
    const hit = f.expertiseSlugs.some((s) => pe.has(s))
    if (!hit) return false
  }

  if (f.talentSlugs.length > 0) {
    const pt = new Set(p.talentSlugs ?? [])
    const hit = f.talentSlugs.some((s) => pt.has(s))
    if (!hit) return false
  }

  return true
}
