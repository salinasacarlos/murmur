import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"
import type {
  Availability,
  Compatibility,
  ExperienceRange,
  FunctionalArea,
  InvestorActivity,
  OnboardingIntent,
  Profile,
  ProjectStage,
  RelationType,
  WorkStyle,
} from "@/lib/types"

type Client = SupabaseClient<Database>

type PublicProfileCity = { city_slug: string; is_primary: boolean }

export type PublicProfileJson = {
  id: string
  name: string
  initials: string
  photo_url: string | null
  role: string
  bio: string
  fun_fact: string
  area: FunctionalArea | null
  functional_area_tags: string[]
  primary_industry_slug: string | null
  vertical_slugs: string[]
  expertise_slugs: string[]
  talent_slugs: string[]
  experience: ExperienceRange | null
  achievement: string
  availability: Availability | null
  city: string | null
  compatibility: Compatibility | null
  online: boolean
  onboarding_intent: OnboardingIntent | null
  project_stage: ProjectStage | null
  project_name: string | null
  project_seek_summary: string | null
  opportunity_seek_summary: string | null
  contributor_pitch: string | null
  investor_activity: InvestorActivity | null
  recommendation_count: number
  show_recommendation_count: boolean
  visible: boolean
  relations_looking: RelationType[]
  work_styles: WorkStyle[]
  event_codes: string[]
  cities: PublicProfileCity[]
}

function slugToCityLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export function mapPublicProfileJson(raw: PublicProfileJson): Profile {
  const cityLabels =
    raw.cities?.length > 0
      ? raw.cities.map((c) => slugToCityLabel(c.city_slug))
      : raw.city
        ? [raw.city]
        : []

  return {
    id: raw.id,
    name: raw.name,
    initials: raw.initials,
    photoUrl: raw.photo_url ?? undefined,
    role: raw.role,
    bio: raw.bio,
    funFact: raw.fun_fact ?? "",
    area: (raw.area ?? "negocio") as FunctionalArea,
    functionalAreaTags: raw.functional_area_tags?.length
      ? raw.functional_area_tags
      : undefined,
    primaryIndustrySlug: raw.primary_industry_slug ?? undefined,
    verticalSlugs: raw.vertical_slugs?.length ? raw.vertical_slugs : undefined,
    expertiseSlugs: raw.expertise_slugs?.length ? raw.expertise_slugs : undefined,
    talentSlugs: raw.talent_slugs?.length ? raw.talent_slugs : undefined,
    experience: (raw.experience ?? "3-5") as ExperienceRange,
    achievement: raw.achievement,
    availability: (raw.availability ?? "full-time") as Availability,
    workStyle: raw.work_styles ?? [],
    city: raw.city ?? cityLabels[0] ?? "",
    cities: cityLabels.length > 0 ? cityLabels : undefined,
    relationsLooking: raw.relations_looking ?? [],
    compatibility: (raw.compatibility ?? "media") as Compatibility,
    online: raw.online,
    eventCodes: raw.event_codes?.length ? raw.event_codes : undefined,
    onboardingIntent: raw.onboarding_intent ?? undefined,
    projectStage: raw.project_stage ?? undefined,
    projectName: raw.project_name ?? undefined,
    projectSeekSummary: raw.project_seek_summary ?? undefined,
    opportunitySeekSummary: raw.opportunity_seek_summary ?? undefined,
    contributorPitch: raw.contributor_pitch ?? undefined,
    investorActivity: raw.investor_activity ?? undefined,
    recommendationCount: raw.recommendation_count ?? 0,
    showRecommendationCount: raw.show_recommendation_count ?? true,
  }
}

export async function fetchPublicProfile(
  supabase: Client,
  profileId: string
): Promise<Profile | null> {
  const { data, error } = await supabase.rpc("get_public_profile", {
    p_id: profileId,
  })
  if (error || data == null) return null
  return mapPublicProfileJson(data as unknown as PublicProfileJson)
}
