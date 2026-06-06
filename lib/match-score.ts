/**
 * Match score v1 — overlap ponderado normalizado (patrón común en ATS / marketplaces).
 * Cada dimensión con criterio definido aporta peso; el score es 0–100.
 * Tiers: alta ≥ 60, media ≥ 30, baja < 30.
 */

import { resolveHeroIndustrySlug } from "@/lib/profile-taxonomy"
import type { Compatibility, Profile, RelationType, Search } from "@/lib/types"

export const MATCH_WEIGHTS = {
  industry: 30,
  expertise: 25,
  vertical: 15,
  talent: 15,
  relations: 15,
} as const

export const MATCH_TIER_ALTA = 60
export const MATCH_TIER_MEDIA = 30

export type MatchCriteria = {
  primaryIndustrySlug?: string | null
  verticalSlugs?: string[]
  expertiseSlugs?: string[]
  talentSlugs?: string[]
  relations?: RelationType[]
}

export type MatchScoreResult = {
  score: number
  compatibility: Compatibility
  /** Búsqueda que mejor explica el score (útil con chip «Todas»). */
  matchedSearchId: string | null
  matchedSearchTitle: string | null
}

export function hasSearchMatchCriteria(criteria: MatchCriteria): boolean {
  return (
    Boolean(criteria.primaryIndustrySlug) ||
    (criteria.expertiseSlugs?.length ?? 0) > 0 ||
    (criteria.verticalSlugs?.length ?? 0) > 0 ||
    (criteria.talentSlugs?.length ?? 0) > 0 ||
    (criteria.relations?.length ?? 0) > 0
  )
}

/** ¿El perfil encaja con al menos una búsqueda activa? */
export function profileMatchesAnyActiveSearch(
  profile: Profile,
  activeSearches: Search[]
): boolean {
  const actives = activeSearches.filter((s) => s.status === "active")
  if (actives.length === 0) return false
  return actives.some((search) =>
    profileMatchesSearchCriteria(profile, searchToMatchCriteria(search))
  )
}

export function compatibilityFromScore(score: number): Compatibility {
  if (score >= MATCH_TIER_ALTA) return "alta"
  if (score >= MATCH_TIER_MEDIA) return "media"
  return "baja"
}

function profileExpertiseSlugs(p: Profile): string[] {
  if (p.expertiseSlugs?.length) return p.expertiseSlugs
  if (p.functionalAreaTags?.length) return p.functionalAreaTags
  return []
}

function heroIndustry(p: Profile): string {
  return resolveHeroIndustrySlug({
    primaryIndustrySlug: p.primaryIndustrySlug,
    expertiseSlugs: p.expertiseSlugs,
    functionalAreaTags: p.functionalAreaTags,
    area: p.area,
  })
}

/** Ratio |A ∩ B| / |A| cuando A es el criterio de búsqueda. */
function overlapRatio(criteria: string[], profileValues: string[]): number | null {
  if (criteria.length === 0) return null
  const profileSet = new Set(profileValues)
  const hits = criteria.filter((slug) => profileSet.has(slug)).length
  return hits / criteria.length
}

function relationOverlap(
  criteria: RelationType[],
  profile: Profile
): number | null {
  if (criteria.length === 0) return null
  return criteria.some((r) => profile.relationsLooking.includes(r)) ? 1 : 0
}

export function searchToMatchCriteria(search: Search): MatchCriteria {
  return {
    primaryIndustrySlug: search.primaryIndustrySlug,
    verticalSlugs: search.verticalSlugs ?? [],
    expertiseSlugs: search.expertiseSlugs ?? [],
    talentSlugs: search.talentSlugs ?? [],
    relations: search.relations ?? [],
  }
}

/** Gate duro: mismo criterio que el chip de búsqueda activa en el feed. */
export function profileMatchesSearchCriteria(
  profile: Profile,
  criteria: MatchCriteria
): boolean {
  if (criteria.primaryIndustrySlug) {
    if (heroIndustry(profile) !== criteria.primaryIndustrySlug) return false
  }
  if (criteria.expertiseSlugs?.length) {
    const pe = new Set(profileExpertiseSlugs(profile))
    if (!criteria.expertiseSlugs.some((x) => pe.has(x))) return false
  }
  if (criteria.talentSlugs?.length) {
    const pt = new Set(profile.talentSlugs ?? [])
    if (!criteria.talentSlugs.some((x) => pt.has(x))) return false
  }
  if (criteria.relations?.length) {
    if (!criteria.relations.some((r) => profile.relationsLooking.includes(r))) {
      return false
    }
  }
  return true
}

export function computeMatchScore(
  profile: Profile,
  criteria: MatchCriteria,
  options?: { cityQuery?: string }
): number {
  let weightedSum = 0
  let weightTotal = 0

  if (criteria.primaryIndustrySlug) {
    weightedSum +=
      MATCH_WEIGHTS.industry *
      (heroIndustry(profile) === criteria.primaryIndustrySlug ? 1 : 0)
    weightTotal += MATCH_WEIGHTS.industry
  }

  const expertiseRatio = overlapRatio(
    criteria.expertiseSlugs ?? [],
    profileExpertiseSlugs(profile)
  )
  if (expertiseRatio !== null) {
    weightedSum += MATCH_WEIGHTS.expertise * expertiseRatio
    weightTotal += MATCH_WEIGHTS.expertise
  }

  const verticalRatio = overlapRatio(
    criteria.verticalSlugs ?? [],
    profile.verticalSlugs ?? []
  )
  if (verticalRatio !== null) {
    weightedSum += MATCH_WEIGHTS.vertical * verticalRatio
    weightTotal += MATCH_WEIGHTS.vertical
  }

  const talentRatio = overlapRatio(
    criteria.talentSlugs ?? [],
    profile.talentSlugs ?? []
  )
  if (talentRatio !== null) {
    weightedSum += MATCH_WEIGHTS.talent * talentRatio
    weightTotal += MATCH_WEIGHTS.talent
  }

  const relationsRatio = relationOverlap(
    criteria.relations ?? [],
    profile
  )
  if (relationsRatio !== null) {
    weightedSum += MATCH_WEIGHTS.relations * relationsRatio
    weightTotal += MATCH_WEIGHTS.relations
  }

  let score =
    weightTotal > 0 ? Math.round((weightedSum / weightTotal) * 100) : 40

  const cityQuery = options?.cityQuery?.trim().toLowerCase()
  if (cityQuery) {
    const haystack = [profile.city, ...(profile.cities ?? [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
    if (haystack.includes(cityQuery)) {
      score = Math.min(100, score + 10)
    }
  }

  return score
}

export function scoreProfileAgainstSearch(
  profile: Profile,
  search: Search,
  options?: { cityQuery?: string }
): MatchScoreResult {
  const criteria = searchToMatchCriteria(search)
  const score = computeMatchScore(profile, criteria, options)
  return {
    score,
    compatibility: compatibilityFromScore(score),
    matchedSearchId: search.id,
    matchedSearchTitle: search.title,
  }
}

export type DiscoverMatchContext = {
  activeSearchId: string
  activeSearches: Search[]
  cityQuery?: string
}

/** Score vs búsquedas activas del usuario (nunca vs su propio perfil). Siempre devuelve resultado. */
export function scoreProfileForDiscover(
  profile: Profile,
  context: DiscoverMatchContext
): MatchScoreResult | null {
  const { activeSearchId, activeSearches, cityQuery } = context
  const actives = activeSearches.filter((s) => s.status === "active")

  if (actives.length === 0) {
    return null
  }

  if (activeSearchId !== "all") {
    const search = actives.find((s) => s.id === activeSearchId)
    if (!search) return null
    const criteria = searchToMatchCriteria(search)
    if (!hasSearchMatchCriteria(criteria)) {
      return {
        score: 35,
        compatibility: "media",
        matchedSearchId: search.id,
        matchedSearchTitle: search.title,
      }
    }
    return scoreProfileAgainstSearch(profile, search, { cityQuery })
  }

  const scorable = actives.filter((s) =>
    hasSearchMatchCriteria(searchToMatchCriteria(s))
  )

  if (scorable.length === 0) {
    const fallback = actives[0]!
    return {
      score: 35,
      compatibility: "media",
      matchedSearchId: fallback.id,
      matchedSearchTitle: fallback.title,
    }
  }

  let best: MatchScoreResult = {
    score: -1,
    compatibility: "baja",
    matchedSearchId: null,
    matchedSearchTitle: null,
  }

  for (const search of scorable) {
    const result = scoreProfileAgainstSearch(profile, search, { cityQuery })
    if (result.score > best.score) {
      best = result
    }
  }

  return best
}

export type RankedDiscoverProfile = Profile & {
  matchScore: number
  matchedSearchId: string | null
  matchedSearchTitle: string | null
}

export function rankProfilesForDiscover(
  profiles: Profile[],
  context: DiscoverMatchContext
): RankedDiscoverProfile[] {
  const actives = context.activeSearches.filter((s) => s.status === "active")

  if (actives.length === 0) {
    return profiles.map((profile) => ({
      ...profile,
      matchScore: 0,
      matchedSearchId: null,
      matchedSearchTitle: null,
    }))
  }

  const ranked: RankedDiscoverProfile[] = profiles.map((profile) => {
    const result = scoreProfileForDiscover(profile, context)
    return {
      ...profile,
      compatibility: result?.compatibility ?? "baja",
      matchScore: result?.score ?? 0,
      matchedSearchId: result?.matchedSearchId ?? null,
      matchedSearchTitle: result?.matchedSearchTitle ?? null,
    }
  })

  return ranked.sort((a, b) => b.matchScore - a.matchScore)
}

export function countProfilesMatchingSearch(
  profiles: Profile[],
  search: Search
): number {
  const criteria = searchToMatchCriteria(search)
  return profiles.filter((p) => profileMatchesSearchCriteria(p, criteria)).length
}
