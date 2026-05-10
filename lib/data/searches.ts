import type { SupabaseClient } from "@supabase/supabase-js"

import { industryLabelToSlug } from "@/lib/catalogs"
import type { Database } from "@/lib/database.types"
import { mapSearchJoinRow } from "@/lib/data/mappers"
import type { Search } from "@/lib/types"

type Client = SupabaseClient<Database>

const SEARCH_SELECT = `
  *,
  search_relations(relation),
  search_industries(industry_slug)
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

  const { error: si } = await supabase
    .from("search_industries")
    .delete()
    .eq("search_id", searchId)
  if (si) return { ok: false, error: si.message }

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
  area: Database["public"]["Enums"]["functional_area"] | null
  industryLabels: string[]
}

export async function createSearch(
  supabase: Client,
  ownerId: string,
  payload: SearchFormPayload
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const insert: Database["public"]["Tables"]["searches"]["Insert"] = {
    owner_id: ownerId,
    title: payload.title.trim(),
    description: payload.description.trim(),
    area: payload.area,
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

  const slugs = [
    ...new Set(
      payload.industryLabels.map((label) => industryLabelToSlug(label)).filter(Boolean)
    ),
  ]
  if (slugs.length > 0) {
    const { error: indErr } = await supabase.from("search_industries").insert(
      slugs.map((industry_slug) => ({ search_id: searchId, industry_slug }))
    )
    if (indErr) return { ok: false, error: indErr.message }
  }

  return { ok: true, id: searchId }
}

export async function updateSearch(
  supabase: Client,
  searchId: string,
  ownerId: string,
  payload: SearchFormPayload
): Promise<{ ok: boolean; error?: string }> {
  const { error: upErr } = await supabase
    .from("searches")
    .update({
      title: payload.title.trim(),
      description: payload.description.trim(),
      area: payload.area,
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

  const { error: di } = await supabase
    .from("search_industries")
    .delete()
    .eq("search_id", searchId)
  if (di) return { ok: false, error: di.message }

  if (payload.relations.length > 0) {
    const { error: ir } = await supabase.from("search_relations").insert(
      payload.relations.map((relation) => ({ search_id: searchId, relation }))
    )
    if (ir) return { ok: false, error: ir.message }
  }

  const slugs = [
    ...new Set(
      payload.industryLabels.map((label) => industryLabelToSlug(label)).filter(Boolean)
    ),
  ]
  if (slugs.length > 0) {
    const { error: ii } = await supabase.from("search_industries").insert(
      slugs.map((industry_slug) => ({ search_id: searchId, industry_slug }))
    )
    if (ii) return { ok: false, error: ii.message }
  }

  return { ok: true }
}
