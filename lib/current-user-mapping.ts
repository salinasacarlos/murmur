import type { User } from "@supabase/supabase-js"

import type { ProfileRow } from "@/components/providers/current-user-provider"
import type {
  Availability,
  CurrentUser,
  ExperienceRange,
  FunctionalArea,
  Profile,
} from "@/lib/types"

const DEFAULT_AREA: FunctionalArea = "negocio"
const DEFAULT_EXPERIENCE: ExperienceRange = "3-5"
const DEFAULT_AVAILABILITY: Availability = "full-time"

export function deriveCurrentUser(
  user: User,
  profile: ProfileRow | null
): CurrentUser {
  const name =
    profile?.name?.trim() ||
    (user.user_metadata?.name as string | undefined)?.trim() ||
    user.email?.split("@")[0] ||
    "Tu cuenta"

  const initials =
    profile?.initials?.trim() ||
    initialsFromName(name) ||
    "TU"

  return {
    id: user.id,
    name,
    initials,
    photoUrl: profile?.photo_url ?? undefined,
    email: profile?.email ?? user.email ?? "",
    role: profile?.role ?? "",
    bio: profile?.bio ?? "",
    funFact: profile?.fun_fact ?? "",
    area: (profile?.area as FunctionalArea | null) ?? DEFAULT_AREA,
    functionalAreaTags:
      profile?.functional_area_tags && profile.functional_area_tags.length > 0
        ? profile.functional_area_tags
        : undefined,
    primaryIndustrySlug: profile?.primary_industry_slug ?? undefined,
    verticalSlugs:
      profile?.vertical_slugs && profile.vertical_slugs.length > 0
        ? profile.vertical_slugs
        : undefined,
    expertiseSlugs:
      profile?.expertise_slugs && profile.expertise_slugs.length > 0
        ? profile.expertise_slugs
        : undefined,
    talentSlugs:
      profile?.talent_slugs && profile.talent_slugs.length > 0
        ? profile.talent_slugs
        : undefined,
    experience:
      (profile?.experience as ExperienceRange | null) ?? DEFAULT_EXPERIENCE,
    achievement: profile?.achievement ?? "",
    availability:
      (profile?.availability as Availability | null) ?? DEFAULT_AVAILABILITY,
    workStyle: [],
    city: profile?.city ?? "",
    cities: profile?.city ? [profile.city] : [],
    searchRadiusKm: profile?.search_radius_km ?? 50,
    relationsLooking: [],
    plan: profile?.plan === "premium" ? "premium" : "free",
    stats: {
      matches: profile?.stats_matches ?? 0,
      connections: profile?.stats_connections ?? 0,
      messages: profile?.stats_messages ?? 0,
    },
    onboardingIntent: profile?.onboarding_intent ?? null,
    projectStage: profile?.project_stage ?? null,
    projectName: profile?.project_name ?? null,
    projectSeekSummary: profile?.project_seek_summary ?? null,
    opportunitySeekSummary: profile?.opportunity_seek_summary ?? null,
    contributorPitch: profile?.contributor_pitch ?? null,
    investorActivity: profile?.investor_activity ?? null,
  }
}

export function mergeEnrichedIntoCurrentUser(
  base: CurrentUser,
  enriched: Profile
): CurrentUser {
  return {
    ...base,
    name: enriched.name,
    initials: enriched.initials,
    photoUrl: enriched.photoUrl ?? base.photoUrl,
    role: enriched.role,
    bio: enriched.bio,
    funFact: enriched.funFact,
    area: enriched.area,
    functionalAreaTags:
      enriched.functionalAreaTags ?? base.functionalAreaTags,
    primaryIndustrySlug:
      enriched.primaryIndustrySlug ?? base.primaryIndustrySlug,
    verticalSlugs: enriched.verticalSlugs ?? base.verticalSlugs,
    expertiseSlugs: enriched.expertiseSlugs ?? base.expertiseSlugs,
    talentSlugs: enriched.talentSlugs ?? base.talentSlugs,
    experience: enriched.experience,
    achievement: enriched.achievement,
    availability: enriched.availability,
    workStyle: enriched.workStyle,
    city: enriched.city,
    cities:
      enriched.cities && enriched.cities.length > 0
        ? enriched.cities
        : enriched.city
          ? [enriched.city]
          : base.cities,
    relationsLooking: enriched.relationsLooking,
    eventCodes: enriched.eventCodes,
    onboardingIntent:
      enriched.onboardingIntent ?? base.onboardingIntent ?? null,
    projectStage: enriched.projectStage ?? base.projectStage ?? null,
    projectName: enriched.projectName ?? base.projectName ?? null,
    projectSeekSummary:
      enriched.projectSeekSummary ?? base.projectSeekSummary ?? null,
    opportunitySeekSummary:
      enriched.opportunitySeekSummary ??
      base.opportunitySeekSummary ??
      null,
    contributorPitch:
      enriched.contributorPitch ?? base.contributorPitch ?? null,
    investorActivity:
      enriched.investorActivity ?? base.investorActivity ?? null,
  }
}

export function initialsFromName(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || ""
  )
}
