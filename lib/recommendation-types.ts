export const PROFILE_RECOMMENDATION_VOTES = [
  "recommend",
  "not_recommend",
] as const

export type ProfileRecommendationVote =
  (typeof PROFILE_RECOMMENDATION_VOTES)[number]

export function isProfileRecommendationVote(
  value: string
): value is ProfileRecommendationVote {
  return (PROFILE_RECOMMENDATION_VOTES as readonly string[]).includes(value)
}
