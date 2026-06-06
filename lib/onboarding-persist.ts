import type { SupabaseClient } from "@supabase/supabase-js"

import { initialsFromName } from "@/lib/current-user-mapping"
import type { Database } from "@/lib/database.types"
import {
  replaceProfileCities,
  replaceProfileRelationsLooking,
  replaceProfileWorkStyles,
} from "@/lib/data/profile-mutations"
import { filterProfileVerticalSlugsForIndustry } from "@/lib/industry-tree"
import { PENDING_EVENT_STORAGE_KEY } from "@/lib/murmur-onboarding"
import {
  MAX_PROFILE_VERTICAL_SLUGS,
  MAX_TALENT_SLUGS,
} from "@/lib/product-config"
import { resolveProfileArea, MAX_EXPERTISE_SLUGS } from "@/lib/profile-taxonomy"
import { userHasProjectIntent } from "@/lib/profile-project-guard"
import type {
  Availability,
  ExperienceRange,
  InvestorActivity,
  OnboardingIntent,
  ProjectStage,
  RelationType,
  WorkStyle,
} from "@/lib/types"

type Client = SupabaseClient<Database>

export async function requireUserId(supabase: Client): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

export async function persistOnboardingRelationships(
  supabase: Client,
  userId: string,
  relations: RelationType[]
): Promise<{ ok: boolean; error?: string }> {
  return replaceProfileRelationsLooking(supabase, userId, relations)
}

export async function persistOnboardingIntent(
  supabase: Client,
  userId: string,
  intent: OnboardingIntent
): Promise<{ ok: boolean; error?: string }> {
  const { data: existing } = await supabase
    .from("profiles")
    .select("onboarding_intent")
    .eq("id", userId)
    .maybeSingle()

  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_intent: intent })
    .eq("id", userId)

  if (error) return { ok: false, error: error.message }

  if (existing?.onboarding_intent && existing.onboarding_intent !== intent) {
    await replaceProfileRelationsLooking(supabase, userId, [])
  }

  return { ok: true }
}

export async function persistOnboardingIntentStep(
  supabase: Client,
  userId: string,
  input: { intent: OnboardingIntent; relations: RelationType[] }
): Promise<{ ok: boolean; error?: string }> {
  const intentResult = await persistOnboardingIntent(
    supabase,
    userId,
    input.intent
  )
  if (!intentResult.ok) return intentResult
  return persistOnboardingRelationships(supabase, userId, input.relations)
}

/** Paso contexto: proyecto, contribuir o inversionista (después del perfil base). */
export async function persistOnboardingProjectContext(
  supabase: Client,
  userId: string,
  input: {
    intent: OnboardingIntent
    projectName: string
    projectStage: ProjectStage | null
    projectSeekSummary: string
    opportunitySeekSummary: string
    contributorPitch: string
    investorActivity: InvestorActivity | null
  }
): Promise<{ ok: boolean; error?: string }> {
  const hasProject = userHasProjectIntent(input.intent)
  const isInvestor = input.intent === "investor"

  if (hasProject && !input.projectStage) {
    return { ok: false, error: "Elige la etapa de tu proyecto." }
  }
  if (isInvestor && !input.investorActivity) {
    return { ok: false, error: "Indica tu situación como inversionista." }
  }

  const payload = hasProject
    ? {
        project_name: input.projectName.trim() || null,
        project_stage: input.projectStage!,
        project_seek_summary: input.projectSeekSummary.trim() || null,
        opportunity_seek_summary: null,
        contributor_pitch: null,
        investor_activity: null,
      }
    : isInvestor
      ? {
          project_name: null,
          project_stage: null,
          project_seek_summary: null,
          opportunity_seek_summary: null,
          contributor_pitch: null,
          investor_activity: input.investorActivity!,
        }
      : {
          project_name: null,
          project_stage: null,
          project_seek_summary: null,
          opportunity_seek_summary: input.opportunitySeekSummary.trim() || null,
          contributor_pitch: input.contributorPitch.trim() || null,
          investor_activity: null,
        }

  const { error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", userId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function persistOnboardingProfileStep(
  supabase: Client,
  userId: string,
  input: {
    name: string
    jobTitle: string
    bio: string
    funFact: string
    achievement: string
    primaryIndustrySlug: string
    verticalSlugs: string[]
    expertiseSlugs: string[]
    talentSlugs: string[]
    experience: ExperienceRange
    availability: Availability
    workStyle: WorkStyle[]
  }
): Promise<{ ok: boolean; error?: string }> {
  const name = input.name.trim()
  const role = input.jobTitle.trim()
  const verticals = filterProfileVerticalSlugsForIndustry(
    input.primaryIndustrySlug,
    input.verticalSlugs,
    MAX_PROFILE_VERTICAL_SLUGS
  )
  const expertise = input.expertiseSlugs.slice(0, MAX_EXPERTISE_SLUGS)
  const talents = input.talentSlugs.slice(0, MAX_TALENT_SLUGS)
  const area = resolveProfileArea(input.primaryIndustrySlug, expertise)

  const { error } = await supabase
    .from("profiles")
    .update({
      name,
      initials: initialsFromName(name) || "U",
      role,
      bio: input.bio.trim(),
      fun_fact: input.funFact.trim().slice(0, 500),
      achievement: input.achievement.trim(),
      primary_industry_slug: input.primaryIndustrySlug,
      vertical_slugs: verticals,
      expertise_slugs: expertise,
      talent_slugs: talents,
      functional_area_tags: [],
      area,
      experience: input.experience,
      availability: input.availability,
    })
    .eq("id", userId)

  if (error) return { ok: false, error: error.message }

  const ws = await replaceProfileWorkStyles(supabase, userId, input.workStyle)
  if (!ws.ok) return ws

  return { ok: true }
}

export async function persistOnboardingLocationFinish(
  supabase: Client,
  userId: string,
  input: {
    primaryCity: string
    activeCities: string[]
    searchRadiusKm: number
  }
): Promise<{ ok: boolean; error?: string }> {
  const city = input.primaryCity.trim()
  const { error } = await supabase
    .from("profiles")
    .update({
      city: city || null,
      search_radius_km: input.searchRadiusKm,
      onboarding_completed: true,
    })
    .eq("id", userId)

  if (error) return { ok: false, error: error.message }

  const { data: prof } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .maybeSingle()
  const plan = prof?.plan === "premium" ? "premium" : "free"
  const activeCities = plan === "premium" ? input.activeCities : []

  const cities = await replaceProfileCities(
    supabase,
    userId,
    city,
    activeCities,
    plan
  )
  if (!cities.ok) return cities

  return attachPendingEventFromStorage(supabase, userId)
}

async function attachPendingEventFromStorage(
  supabase: Client,
  userId: string
): Promise<{ ok: boolean; error?: string }> {
  if (typeof window === "undefined") return { ok: true }
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(PENDING_EVENT_STORAGE_KEY)
  } catch {
    return { ok: true }
  }
  if (!raw) return { ok: true }

  let code: string | null = null
  try {
    const parsed = JSON.parse(raw) as { code?: string }
    code = typeof parsed.code === "string" ? parsed.code.trim() : null
  } catch {
    return { ok: true }
  }
  if (!code) {
    try {
      window.localStorage.removeItem(PENDING_EVENT_STORAGE_KEY)
    } catch {
      // ignore
    }
    return { ok: true }
  }

  const normalized = code.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
  if (normalized.length < 4) return { ok: true }

  const { error } = await supabase.from("profile_events").upsert(
    {
      profile_id: userId,
      event_code: normalized,
    },
    { onConflict: "profile_id,event_code" }
  )

  if (error) return { ok: false, error: error.message }

  try {
    window.localStorage.removeItem(PENDING_EVENT_STORAGE_KEY)
  } catch {
    // ignore
  }
  return { ok: true }
}
