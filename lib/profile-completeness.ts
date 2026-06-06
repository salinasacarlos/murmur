import { PROFILE_FIELD_COPY } from "@/lib/profile-field-copy"
import type { Compatibility, CurrentUser, Profile } from "@/lib/types"
import {
  userHasProjectIntent,
  userIsInvestor,
} from "@/lib/profile-project-guard"

export type ProfileCompletenessSection =
  | "identity"
  | "professional"
  | "work"
  | "location"
  | "interests"

export interface ProfileCompletenessItem {
  id: string
  label: string
  ok: boolean
  section: ProfileCompletenessSection
}

export interface ProfileCompleteness {
  percent: number
  items: ProfileCompletenessItem[]
  missing: ProfileCompletenessItem[]
}

/** Maps session user + enriched fields into a `Profile` for completeness rules. */
export function profileFromCurrentUserForCompleteness(
  user: CurrentUser,
  compatibility: Compatibility = "media"
): Profile {
  return {
    id: user.id,
    name: user.name,
    initials: user.initials,
    photoUrl: user.photoUrl,
    role: user.role,
    bio: user.bio,
    funFact: user.funFact,
    area: user.area,
    functionalAreaTags: user.functionalAreaTags,
    primaryIndustrySlug: user.primaryIndustrySlug,
    verticalSlugs: user.verticalSlugs,
    expertiseSlugs: user.expertiseSlugs,
    talentSlugs: user.talentSlugs,
    experience: user.experience,
    achievement: user.achievement,
    availability: user.availability,
    workStyle: user.workStyle,
    city: user.city,
    cities: user.cities,
    relationsLooking: user.relationsLooking,
    compatibility,
    eventCodes: user.eventCodes,
    onboardingIntent: user.onboardingIntent,
    projectStage: user.projectStage,
    projectName: user.projectName,
    projectSeekSummary: user.projectSeekSummary,
    opportunitySeekSummary: user.opportunitySeekSummary,
    contributorPitch: user.contributorPitch,
    investorActivity: user.investorActivity,
  }
}

export function computeProfileCompleteness(
  profile: Profile | null,
  extras: {
    email: string
    searchRadiusKm: number | null | undefined
  }
): ProfileCompleteness {
  if (!profile) {
    return {
      percent: 0,
      items: [],
      missing: [],
    }
  }

  const hasPhoto = Boolean(profile.photoUrl)
  const items: ProfileCompletenessItem[] = [
    {
      id: "name",
      label: "Nombre",
      ok: profile.name.trim().length > 0,
      section: "identity",
    },
    {
      id: "role",
      label: "Título o rol",
      ok: profile.role.trim().length > 0,
      section: "identity",
    },
    {
      id: "bio",
      label: "Bio",
      ok: profile.bio.trim().length > 0,
      section: "identity",
    },
    {
      id: "fun_fact",
      label: "Dato curioso",
      ok: profile.funFact.trim().length > 0,
      section: "identity",
    },
    {
      id: "photo",
      label: "Foto de perfil",
      ok: hasPhoto,
      section: "identity",
    },
    {
      id: "primary_industry",
      label: PROFILE_FIELD_COPY.industryPrincipal,
      ok: Boolean(profile.primaryIndustrySlug),
      section: "professional",
    },
    {
      id: "verticals",
      label: PROFILE_FIELD_COPY.verticales,
      ok: (profile.verticalSlugs?.length ?? 0) >= 1,
      section: "professional",
    },
    {
      id: "expertise",
      label: PROFILE_FIELD_COPY.expertise,
      ok: (profile.expertiseSlugs?.length ?? 0) >= 1,
      section: "professional",
    },
    {
      id: "achievement",
      label: "Logro destacado",
      ok: profile.achievement.trim().length > 0,
      section: "professional",
    },
    {
      id: "work_styles",
      label: "Forma de trabajar",
      ok: profile.workStyle.length > 0,
      section: "work",
    },
    {
      id: "relations",
      label: "Tipos de relación",
      ok: profile.relationsLooking.length > 0,
      section: "interests",
    },
    {
      id: "onboarding_intent",
      label: "Tu rol en murmur (proyecto, contribuir o invertir)",
      ok: Boolean(profile.onboardingIntent),
      section: "interests",
    },
    {
      id: "project_stage",
      label: "Etapa del proyecto",
      ok:
        !userHasProjectIntent(profile.onboardingIntent) ||
        Boolean(profile.projectStage),
      section: "interests",
    },
    {
      id: "investor_activity",
      label: "Situación como inversionista",
      ok:
        !userIsInvestor(profile.onboardingIntent) ||
        Boolean(profile.investorActivity),
      section: "interests",
    },
    {
      id: "city",
      label: "Ciudad principal",
      ok: profile.city.trim().length > 0,
      section: "location",
    },
    {
      id: "radius",
      label: "Radio de búsqueda",
      ok: (extras.searchRadiusKm ?? 0) > 0,
      section: "location",
    },
    {
      id: "email",
      label: "Email verificado",
      ok: extras.email.trim().length > 0,
      section: "identity",
    },
  ]

  const core = items.filter(
    (i) =>
      i.id !== "photo" &&
      i.id !== "fun_fact"
  )
  const okCore = core.filter((i) => i.ok).length
  const percent = Math.round((okCore / core.length) * 100)
  /** No cuenta para el % ni en la lista de pendientes (mejora opcional). */
  const OPTIONAL_GAP_IDS = new Set<string>(["fun_fact", "photo"])

  const missing = items.filter(
    (i) => !i.ok && !OPTIONAL_GAP_IDS.has(i.id)
  )

  return { percent, items, missing }
}
