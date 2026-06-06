import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"
import type { ProfileRecommendationVote } from "@/lib/recommendation-types"

type Client = SupabaseClient<Database>

export async function fetchMyRecommendationsForProfiles(
  supabase: Client,
  profileIds: string[]
): Promise<Map<string, ProfileRecommendationVote>> {
  const uniq = [...new Set(profileIds.filter(Boolean))]
  const out = new Map<string, ProfileRecommendationVote>()
  if (!uniq.length) return out

  const { data, error } = await supabase
    .from("profile_recommendations")
    .select("profile_id, vote")
    .in("profile_id", uniq)

  if (error || !data) return out

  for (const row of data) {
    const vote = row.vote
    if (vote === "recommend" || vote === "not_recommend") {
      out.set(row.profile_id, vote)
    }
  }
  return out
}

export async function setProfileRecommendation(
  supabase: Client,
  recommenderId: string,
  profileId: string,
  vote: ProfileRecommendationVote
): Promise<{ ok: true; recommendationCount: number } | { ok: false; error: string }> {
  if (recommenderId === profileId) {
    return { ok: false, error: "No puedes recomendarte a ti mismo." }
  }

  const { error: upsertError } = await supabase
    .from("profile_recommendations")
    .upsert(
      {
        recommender_id: recommenderId,
        profile_id: profileId,
        vote,
      },
      { onConflict: "recommender_id,profile_id" }
    )

  if (upsertError) {
    return { ok: false, error: upsertError.message }
  }

  const recommendationCount = await readRecommendationCount(supabase, profileId)
  return { ok: true, recommendationCount }
}

async function readRecommendationCount(
  supabase: Client,
  profileId: string
): Promise<number> {
  const { data: profileRow, error: readError } = await supabase
    .from("profiles")
    .select("recommendation_count")
    .eq("id", profileId)
    .maybeSingle()

  if (readError || !profileRow) return 0
  return profileRow.recommendation_count ?? 0
}

export async function clearProfileRecommendation(
  supabase: Client,
  recommenderId: string,
  profileId: string
): Promise<{ ok: true; recommendationCount: number } | { ok: false; error: string }> {
  if (recommenderId === profileId) {
    return { ok: false, error: "No puedes recomendarte a ti mismo." }
  }

  const { error: deleteError } = await supabase
    .from("profile_recommendations")
    .delete()
    .eq("recommender_id", recommenderId)
    .eq("profile_id", profileId)

  if (deleteError) {
    return { ok: false, error: deleteError.message }
  }

  const recommendationCount = await readRecommendationCount(supabase, profileId)
  return { ok: true, recommendationCount }
}
