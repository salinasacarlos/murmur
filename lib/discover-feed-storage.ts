import type { DiscoverFeedFilters } from "@/lib/feed-filters"
import { emptyDiscoverFeedFilters } from "@/lib/feed-filters"
import type { EventEntry } from "@/lib/types"

const PREFIX = "murmur.feed.v1"

function key(userId: string, part: string) {
  return `${PREFIX}:${userId}:${part}`
}

export function readFeedActivated(userId: string): boolean {
  try {
    const local = localStorage.getItem(key(userId, "activated"))
    if (local === "1") return true
    const legacy = sessionStorage.getItem(key(userId, "activated"))
    if (legacy === "1") {
      localStorage.setItem(key(userId, "activated"), "1")
      sessionStorage.removeItem(key(userId, "activated"))
      return true
    }
    return false
  } catch {
    return false
  }
}

export function writeFeedActivated(userId: string, on: boolean) {
  try {
    if (on) localStorage.setItem(key(userId, "activated"), "1")
    else localStorage.removeItem(key(userId, "activated"))
    sessionStorage.removeItem(key(userId, "activated"))
  } catch {
    /* ignore */
  }
}

export function readFeedActiveSearch(userId: string): string | null {
  try {
    return sessionStorage.getItem(key(userId, "activeSearch"))
  } catch {
    return null
  }
}

export function writeFeedActiveSearch(userId: string, value: string) {
  try {
    sessionStorage.setItem(key(userId, "activeSearch"), value)
  } catch {
    /* ignore */
  }
}

export function readFeedFilters(userId: string): DiscoverFeedFilters {
  try {
    const raw = sessionStorage.getItem(key(userId, "filters"))
    if (!raw) return emptyDiscoverFeedFilters()
    const p = JSON.parse(raw) as DiscoverFeedFilters
    if (!p || typeof p !== "object") return emptyDiscoverFeedFilters()
    const base = emptyDiscoverFeedFilters()
    return {
      ...base,
      city: typeof p.city === "string" ? p.city : base.city,
      availability: p.availability ?? base.availability,
      relation: p.relation ?? base.relation,
      projectStage: p.projectStage ?? base.projectStage,
      investorActivity: p.investorActivity ?? base.investorActivity,
      primaryIndustrySlug: p.primaryIndustrySlug ?? base.primaryIndustrySlug,
      verticalSlugs: Array.isArray(p.verticalSlugs)
        ? (p.verticalSlugs as string[])
        : base.verticalSlugs,
      expertiseSlugs: Array.isArray(p.expertiseSlugs)
        ? (p.expertiseSlugs as string[])
        : base.expertiseSlugs,
      talentSlugs: Array.isArray(p.talentSlugs)
        ? (p.talentSlugs as string[])
        : base.talentSlugs,
    }
  } catch {
    return emptyDiscoverFeedFilters()
  }
}

export function writeFeedFilters(userId: string, filters: DiscoverFeedFilters) {
  try {
    sessionStorage.setItem(key(userId, "filters"), JSON.stringify(filters))
  } catch {
    /* ignore */
  }
}

export function readFeedActiveEvent(userId: string): EventEntry | null {
  try {
    const raw = sessionStorage.getItem(key(userId, "activeEvent"))
    if (!raw || raw === "null") return null
    const p = JSON.parse(raw) as EventEntry
    if (!p?.code || typeof p.name !== "string") return null
    return {
      code: p.code,
      name: p.name,
      description: typeof p.description === "string" ? p.description : undefined,
    }
  } catch {
    return null
  }
}

export function writeFeedActiveEvent(userId: string, ev: EventEntry | null) {
  try {
    if (!ev) sessionStorage.removeItem(key(userId, "activeEvent"))
    else sessionStorage.setItem(key(userId, "activeEvent"), JSON.stringify(ev))
  } catch {
    /* ignore */
  }
}
