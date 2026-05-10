import type { SupabaseClient } from "@supabase/supabase-js"

import { cityLabelToSlug, industryLabelToSlug } from "@/lib/catalogs"
import type { Database } from "@/lib/database.types"
import type { RelationType, WorkStyle } from "@/lib/types"
import {
  freeAllowsCitySlugs,
  isPremiumPlan,
  MSG_FREE_CITIES_LIMIT,
} from "@/lib/plan-limits"

type Client = SupabaseClient<Database>

export async function replaceProfileWorkStyles(
  supabase: Client,
  profileId: string,
  styles: WorkStyle[]
): Promise<{ ok: boolean; error?: string }> {
  const { error: delErr } = await supabase
    .from("profile_work_styles")
    .delete()
    .eq("profile_id", profileId)
  if (delErr) return { ok: false, error: delErr.message }
  if (styles.length === 0) return { ok: true }
  const { error } = await supabase.from("profile_work_styles").insert(
    styles.map((work_style) => ({ profile_id: profileId, work_style }))
  )
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function replaceProfileIndustries(
  supabase: Client,
  profileId: string,
  industryLabels: string[]
): Promise<{ ok: boolean; error?: string }> {
  const slugs = [
    ...new Set(
      industryLabels.map((label) => industryLabelToSlug(label)).filter(Boolean)
    ),
  ]
  const { error: delErr } = await supabase
    .from("profile_industries")
    .delete()
    .eq("profile_id", profileId)
  if (delErr) return { ok: false, error: delErr.message }
  if (slugs.length === 0) return { ok: true }
  const { error } = await supabase.from("profile_industries").insert(
    slugs.map((industry_slug) => ({ profile_id: profileId, industry_slug }))
  )
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function replaceProfileRelationsLooking(
  supabase: Client,
  profileId: string,
  relations: RelationType[]
): Promise<{ ok: boolean; error?: string }> {
  const { error: delErr } = await supabase
    .from("profile_relations_looking")
    .delete()
    .eq("profile_id", profileId)
  if (delErr) return { ok: false, error: delErr.message }
  if (relations.length === 0) return { ok: true }
  const { error } = await supabase.from("profile_relations_looking").insert(
    relations.map((relation) => ({ profile_id: profileId, relation }))
  )
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

function normCityLabel(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
}

/** Resolves city labels to FK slugs against `cities_catalog`; skips unknown labels. */
export async function replaceProfileCities(
  supabase: Client,
  profileId: string,
  primaryCityLabel: string,
  activeCityLabels: string[],
  plan: Database["public"]["Enums"]["user_plan"]
): Promise<{ ok: boolean; error?: string }> {
  const { data: rows, error: catErr } = await supabase
    .from("cities_catalog")
    .select("slug,name")
  if (catErr || !rows?.length) {
    return { ok: true }
  }

  const slugForLabel = (label: string): string | null => {
    const trimmed = label.trim()
    if (!trimmed) return null
    const candidate = cityLabelToSlug(trimmed)
    if (rows.some((r) => r.slug === candidate)) return candidate
    const hit = rows.find((r) => normCityLabel(r.name) === normCityLabel(trimmed))
    return hit?.slug ?? null
  }

  const primary = primaryCityLabel.trim()
  const combined = [
    primary,
    ...activeCityLabels.map((c) => c.trim()).filter(Boolean),
  ]
  const uniqLabels = [...new Set(combined.filter(Boolean))]
  const bySlug = new Map<string, boolean>()
  const nPrimary = normCityLabel(primary)

  for (const label of uniqLabels) {
    const slug = slugForLabel(label)
    if (!slug) continue
    const isPrimary = normCityLabel(label) === nPrimary
    bySlug.set(slug, bySlug.get(slug) || isPrimary)
  }

  const { error: delErr } = await supabase
    .from("profile_cities")
    .delete()
    .eq("profile_id", profileId)
  if (delErr) return { ok: false, error: delErr.message }

  const resolved = [...bySlug.entries()].map(([city_slug, is_primary]) => ({
    profile_id: profileId,
    city_slug,
    is_primary,
  }))
  if (resolved.length === 0) return { ok: true }

  if (
    !isPremiumPlan(plan) &&
    !freeAllowsCitySlugs(resolved.length)
  ) {
    return { ok: false, error: MSG_FREE_CITIES_LIMIT }
  }

  const { error } = await supabase.from("profile_cities").insert(resolved)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
