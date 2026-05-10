import type { DiscoverFeedFilters } from "@/lib/feed-filters"
import type { Database } from "@/lib/database.types"

export type UserPlan = Database["public"]["Enums"]["user_plan"]

export const FREE_MAX_ACTIVE_SEARCHES = 1
export const FREE_MAX_ACCEPTED_CONNECTIONS = 10
export const FREE_MAX_PROFILE_CITY_SLUGS = 1

export const MSG_FREE_SEARCH_LIMIT =
  "En el plan Free solo puedes tener una búsqueda activa. Pausa la otra o actualiza a Premium para varias activas."

export const MSG_FREE_CONNECTION_SEND_LIMIT =
  "En el plan Free tienes hasta 10 conexiones aceptadas. Actualiza a Premium para conectar sin límite."

export const MSG_FREE_CITIES_LIMIT =
  "En el plan Free solo puedes tener una ciudad en tu radar. Actualiza a Premium para varias ciudades."

export function isPremiumPlan(
  plan: UserPlan | null | undefined
): boolean {
  return plan === "premium"
}

export function freeAllowsNewActiveSearch(activeSearchCount: number): boolean {
  return activeSearchCount < FREE_MAX_ACTIVE_SEARCHES
}

export function freeAllowsNewConnection(acceptedCount: number): boolean {
  return acceptedCount < FREE_MAX_ACCEPTED_CONNECTIONS
}

export function freeAllowsCitySlugs(slugCount: number): boolean {
  return slugCount <= FREE_MAX_PROFILE_CITY_SLUGS
}

/** Quita filtros solo disponibles en Premium (afinidad, talentos). */
export function sanitizeDiscoverFiltersForPlan(
  f: DiscoverFeedFilters,
  plan: UserPlan | null | undefined
): DiscoverFeedFilters {
  if (isPremiumPlan(plan)) return f
  const next = { ...f }
  if (next.affinityLabels?.length) next.affinityLabels = [...[]]
  if (next.talentSlugs?.length) next.talentSlugs = [...[]]
  return next
}
