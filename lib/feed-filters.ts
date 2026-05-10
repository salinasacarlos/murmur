import { resolveHeroIndustrySlug } from "@/lib/profile-taxonomy"
import type { Availability, Profile, RelationType } from "@/lib/types"

/** Filtros del feed «Descubrir» (client-side). */
export interface DiscoverFeedFilters {
  city: string
  availability: Availability | null
  relation: RelationType | null
  /** Industria principal (catálogo profile-taxonomy); null = sin filtrar. */
  primaryIndustrySlug: string | null
  /** Expertise dentro de la industria elegida; vacío = sin filtrar. */
  expertiseSlugs: string[]
  /** Talentos; vacío = sin filtrar. */
  talentSlugs: string[]
}

export function emptyDiscoverFeedFilters(): DiscoverFeedFilters {
  return {
    city: "",
    availability: null,
    relation: null,
    primaryIndustrySlug: null,
    expertiseSlugs: [],
    talentSlugs: [],
  }
}

function profileExpertiseSlugs(p: Profile): string[] {
  if (p.expertiseSlugs?.length) return p.expertiseSlugs
  return p.functionalAreaTags ?? []
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

  if (f.expertiseSlugs.length > 0) {
    const pe = new Set(profileExpertiseSlugs(p))
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
