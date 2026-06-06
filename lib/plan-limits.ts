import type { DiscoverFeedFilters } from "@/lib/feed-filters"
import type { Database } from "@/lib/database.types"

/**
 * Límites del plan Free en aplicación. Deben coincidir con las RPCs/triggers SQL:
 * - `accept_connection` — tope al aceptar (20260525120000_plan_gates_accept_and_compat.sql)
 * - `profile_cities`, `searches`, `connections` — triggers (20260619120000_plan_gates_server_enforcement.sql)
 * Ver PRD §7 checklist.
 */

export type UserPlan = Database["public"]["Enums"]["user_plan"]

export const FREE_MAX_ACTIVE_SEARCHES = 1
export const FREE_MAX_ACCEPTED_CONNECTIONS = 10
export const FREE_MAX_PROFILE_CITY_SLUGS = 1

export const MSG_FREE_SEARCH_LIMIT =
  "En el plan Free solo puedes tener una búsqueda activa. Pausa la otra o actualiza a Premium para varias activas."

export const MSG_FREE_CONNECTION_SEND_LIMIT = `En el plan Free tienes hasta ${FREE_MAX_ACCEPTED_CONNECTIONS} conexiones aceptadas. Actualiza a Premium para conectar sin límite.`

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

/** En plan Free, oculta el filtro por soft skills en Descubrir (Premium lo mantiene). */
export function sanitizeDiscoverFiltersForPlan(
  f: DiscoverFeedFilters,
  plan: UserPlan | null | undefined
): DiscoverFeedFilters {
  if (isPremiumPlan(plan)) return f
  const next = { ...f }
  if (next.talentSlugs?.length) next.talentSlugs = []
  return next
}
