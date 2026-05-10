import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"
import { mapSearchJoinRow } from "@/lib/data/mappers"
import { filterProfileVerticalSlugsForIndustry } from "@/lib/industry-tree"
import {
  inferIndustryFromExpertiseSlugs,
  resolveProfileArea,
} from "@/lib/profile-taxonomy"
import type { Search } from "@/lib/types"
import {
  freeAllowsNewActiveSearch,
  isPremiumPlan,
  MSG_FREE_SEARCH_LIMIT,
  type UserPlan,
} from "@/lib/plan-limits"

type Client = SupabaseClient<Database>

async function fetchOwnerPlan(
  supabase: Client,
  ownerId: string
): Promise<UserPlan> {
  const { data } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", ownerId)
    .maybeSingle()
  return data?.plan === "premium" ? "premium" : "free"
}

export async function countActiveSearchesForOwner(
  supabase: Client,
  ownerId: string
): Promise<number | null> {
  const { count, error } = await supabase
    .from("searches")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", ownerId)
    .eq("status", "active")
  if (error) return null
  return count ?? 0
}

async function countOtherActiveSearches(
  supabase: Client,
  ownerId: string,
  excludeSearchId: string
): Promise<number | null> {
  const { count, error } = await supabase
    .from("searches")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", ownerId)
    .eq("status", "active")
    .neq("id", excludeSearchId)
  if (error) return null
  return count ?? 0
}

const SEARCH_SELECT = `
  *,
  search_relations(relation)
` as const

export async function fetchSearchesForOwner(
  supabase: Client,
  ownerId: string
): Promise<Search[]> {
  const { data, error } = await supabase
    .from("searches")
    .select(SEARCH_SELECT)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })

  if (error || !data) return []
  return data.map((row) => mapSearchJoinRow(row))
}

export async function fetchSearchByIdForOwner(
  supabase: Client,
  searchId: string,
  ownerId: string
): Promise<Search | null> {
  const { data, error } = await supabase
    .from("searches")
    .select(SEARCH_SELECT)
    .eq("id", searchId)
    .eq("owner_id", ownerId)
    .maybeSingle()

  if (error || !data) return null
  return mapSearchJoinRow(data)
}

export async function updateSearchStatus(
  supabase: Client,
  searchId: string,
  ownerId: string,
  status: Database["public"]["Enums"]["search_status"]
): Promise<{ ok: boolean; error?: string }> {
  if (status === "active") {
    const { data: row } = await supabase
      .from("searches")
      .select("status")
      .eq("id", searchId)
      .eq("owner_id", ownerId)
      .maybeSingle()
    if (row?.status !== "active") {
      const plan = await fetchOwnerPlan(supabase, ownerId)
      if (!isPremiumPlan(plan)) {
        const others = await countOtherActiveSearches(
          supabase,
          ownerId,
          searchId
        )
        if (others === null) {
          return {
            ok: false,
            error:
              "No se pudo comprobar tus otras búsquedas activas. Intenta de nuevo.",
          }
        }
        if (!freeAllowsNewActiveSearch(others)) {
          return { ok: false, error: MSG_FREE_SEARCH_LIMIT }
        }
      }
    }
  }

  const { error } = await supabase
    .from("searches")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", searchId)
    .eq("owner_id", ownerId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function deleteSearchForOwner(
  supabase: Client,
  searchId: string,
  ownerId: string
): Promise<{ ok: boolean; error?: string }> {
  const { error: sr } = await supabase
    .from("search_relations")
    .delete()
    .eq("search_id", searchId)
  if (sr) return { ok: false, error: sr.message }

  const { error } = await supabase
    .from("searches")
    .delete()
    .eq("id", searchId)
    .eq("owner_id", ownerId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export interface SearchFormPayload {
  title: string
  description: string
  relations: Database["public"]["Enums"]["relation_type"][]
  primaryIndustrySlug: string | null
  verticalSlugs: string[]
  expertiseSlugs: string[]
  talentSlugs: string[]
}

function taxonomyRowForPayload(
  payload: SearchFormPayload
): Pick<
  Database["public"]["Tables"]["searches"]["Insert"],
  | "area"
  | "primary_industry_slug"
  | "vertical_slugs"
  | "expertise_slugs"
  | "talent_slugs"
  | "functional_area_tags"
> {
  const expertise = payload.expertiseSlugs.slice(0, 5)
  const talents = payload.talentSlugs.slice(0, 5)
  const industry =
    payload.primaryIndustrySlug ??
    inferIndustryFromExpertiseSlugs(expertise) ??
    null
  const verticalsFiltered = industry
    ? filterProfileVerticalSlugsForIndustry(industry, payload.verticalSlugs, 3)
    : []
  const hasCore = !!industry || expertise.length > 0
  const area = hasCore
    ? (resolveProfileArea(industry, expertise) as Database["public"]["Enums"]["functional_area"])
    : null
  return {
      area,
      primary_industry_slug: hasCore ? industry : null,
      vertical_slugs: hasCore ? verticalsFiltered : [],
      expertise_slugs: expertise,
      talent_slugs: talents,
      functional_area_tags: [],
  }
}

export async function createSearch(
  supabase: Client,
  ownerId: string,
  payload: SearchFormPayload
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const plan = await fetchOwnerPlan(supabase, ownerId)
  if (!isPremiumPlan(plan)) {
    const n = await countActiveSearchesForOwner(supabase, ownerId)
    if (n === null) {
      return {
        ok: false,
        error:
          "No se pudo comprobar tus búsquedas activas. Revisa la conexión e intenta de nuevo.",
      }
    }
    if (!freeAllowsNewActiveSearch(n)) {
      return { ok: false, error: MSG_FREE_SEARCH_LIMIT }
    }
  }

  const tax = taxonomyRowForPayload(payload)
  const insert: Database["public"]["Tables"]["searches"]["Insert"] = {
    owner_id: ownerId,
    title: payload.title.trim(),
    description: payload.description.trim(),
    ...tax,
    status: "active",
  }

  const { data: row, error } = await supabase
    .from("searches")
    .insert(insert)
    .select("id")
    .single()

  if (error || !row) return { ok: false, error: error?.message ?? "Error al crear" }

  const searchId = row.id

  if (payload.relations.length > 0) {
    const { error: relErr } = await supabase.from("search_relations").insert(
      payload.relations.map((relation) => ({ search_id: searchId, relation }))
    )
    if (relErr) return { ok: false, error: relErr.message }
  }

  return { ok: true, id: searchId }
}

export async function updateSearch(
  supabase: Client,
  searchId: string,
  ownerId: string,
  payload: SearchFormPayload
): Promise<{ ok: boolean; error?: string }> {
  const tax = taxonomyRowForPayload(payload)

  const { data: currentRow, error: curErr } = await supabase
    .from("searches")
    .select(
      "area, functional_area_tags, primary_industry_slug, vertical_slugs, expertise_slugs, talent_slugs"
    )
    .eq("id", searchId)
    .eq("owner_id", ownerId)
    .maybeSingle()

  if (curErr || !currentRow) {
    return { ok: false, error: curErr?.message ?? "Búsqueda no encontrada" }
  }

  const expertise = tax.expertise_slugs ?? []
  const verticals = tax.vertical_slugs ?? []
  const hasCore =
    expertise.length > 0 ||
    !!tax.primary_industry_slug ||
    verticals.length > 0
  const prevHadCore =
    (currentRow.expertise_slugs?.length ?? 0) > 0 ||
    !!currentRow.primary_industry_slug ||
    (currentRow.functional_area_tags?.length ?? 0) > 0 ||
    (currentRow.vertical_slugs?.length ?? 0) > 0

  let nextArea: Database["public"]["Enums"]["functional_area"] | null
  if (hasCore) {
    nextArea = tax.area ?? null
  } else if (prevHadCore) {
    nextArea = null
  } else {
    nextArea = currentRow.area ?? null
  }

  const { error: upErr } = await supabase
    .from("searches")
    .update({
      title: payload.title.trim(),
      description: payload.description.trim(),
      area: nextArea,
      primary_industry_slug: hasCore ? tax.primary_industry_slug : null,
      vertical_slugs: hasCore ? verticals : [],
      expertise_slugs: tax.expertise_slugs,
      talent_slugs: tax.talent_slugs,
      functional_area_tags: tax.functional_area_tags,
      updated_at: new Date().toISOString(),
    })
    .eq("id", searchId)
    .eq("owner_id", ownerId)

  if (upErr) return { ok: false, error: upErr.message }

  const { error: dr } = await supabase
    .from("search_relations")
    .delete()
    .eq("search_id", searchId)
  if (dr) return { ok: false, error: dr.message }

  if (payload.relations.length > 0) {
    const { error: ir } = await supabase.from("search_relations").insert(
      payload.relations.map((relation) => ({ search_id: searchId, relation }))
    )
    if (ir) return { ok: false, error: ir.message }
  }

  return { ok: true }
}
