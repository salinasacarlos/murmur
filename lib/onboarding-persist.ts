import type { SupabaseClient } from "@supabase/supabase-js"

import { initialsFromName } from "@/lib/current-user-mapping"
import type { Database } from "@/lib/database.types"
import {
  replaceProfileCities,
  replaceProfileIndustries,
  replaceProfileRelationsLooking,
  replaceProfileWorkStyles,
} from "@/lib/data/profile-mutations"
import { PENDING_EVENT_STORAGE_KEY } from "@/lib/murmur-onboarding"
import type {
  Availability,
  ExperienceRange,
  RelationType,
  WorkStyle,
} from "@/lib/types"
import { mapsToForOnboardingSlug } from "@/lib/onboarding-functional-areas"

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

export async function persistOnboardingProfileStep(
  supabase: Client,
  userId: string,
  input: {
    name: string
    jobTitle: string
    bio: string
    achievement: string
    areaTagSlugs: string[]
    experience: ExperienceRange
    availability: Availability
    workStyle: WorkStyle[]
    industries: string[]
  }
): Promise<{ ok: boolean; error?: string }> {
  const name = input.name.trim()
  const role = input.jobTitle.trim()
  const tags = input.areaTagSlugs.slice(0, 5)
  const firstMaps = tags[0] ? mapsToForOnboardingSlug(tags[0]) : undefined
  const area = firstMaps ?? "negocio"

  const { error } = await supabase
    .from("profiles")
    .update({
      name,
      initials: initialsFromName(name) || "U",
      role,
      bio: input.bio.trim(),
      achievement: input.achievement.trim(),
      area,
      functional_area_tags: tags,
      experience: input.experience,
      availability: input.availability,
    })
    .eq("id", userId)

  if (error) return { ok: false, error: error.message }

  const ws = await replaceProfileWorkStyles(supabase, userId, input.workStyle)
  if (!ws.ok) return ws

  const ind = await replaceProfileIndustries(supabase, userId, input.industries)
  if (!ind.ok) return ind

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

  const cities = await replaceProfileCities(
    supabase,
    userId,
    city,
    input.activeCities
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
