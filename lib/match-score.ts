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
  }
}

export type DiscoverMatchContext = {
  activeSearchId: string
  activeSearches: Search[]
  cityQuery?: string
}

/** Mejor score entre búsquedas activas; con chip concreto solo esa búsqueda. */
export function scoreProfileForDiscover(
  profile: Profile,
  context: DiscoverMatchContext
): MatchScoreResult {
  const { activeSearchId, activeSearches, cityQuery } = context
  const actives = activeSearches.filter((s) => s.status === "active")

  if (activeSearchId !== "all") {
    const search = actives.find((s) => s.id === activeSearchId)
    if (search) {
      return scoreProfileAgainstSearch(profile, search, { cityQuery })
    }
  }

  if (actives.length === 0) {
    const score = cityQuery?.trim()
      ? computeMatchScore(profile, {}, { cityQuery })
      : 40
    return {
      score,
      compatibility: compatibilityFromScore(score),
      matchedSearchId: null,
    }
  }

  let best: MatchScoreResult = {
    score: 0,
    compatibility: "baja" as Compatibility,
    matchedSearchId: null,
  }

  for (const search of actives) {
    const result = scoreProfileAgainstSearch(profile, search, { cityQuery })
    if (result.score > best.score) {
      best = result
    }
  }

  return best
}

export function rankProfilesForDiscover(
  profiles: Profile[],
  context: DiscoverMatchContext
): Array<Profile & { matchScore: number }> {
  return profiles
    .map((profile) => {
      const { score, compatibility } = scoreProfileForDiscover(profile, context)
      return {
        ...profile,
        compatibility,
        matchScore: score,
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
}

export function countProfilesMatchingSearch(
  profiles: Profile[],
  search: Search
): number {
  const criteria = searchToMatchCriteria(search)
  return profiles.filter((p) => profileMatchesSearchCriteria(p, criteria)).length
}
