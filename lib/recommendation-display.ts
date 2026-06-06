import type { Profile } from "@/lib/types"

/** Muestra el contador de recomendaciones en cards/perfil ajeno. */
export function profileShowsRecommendationCount(p: Profile): boolean {
  return (p.recommendationCount ?? 0) > 0 && p.showRecommendationCount !== false
}
