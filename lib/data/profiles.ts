import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"
import { mapProfileBareRow, mapProfileJoinRow } from "@/lib/data/mappers"
import type { Profile } from "@/lib/types"

type Client = SupabaseClient<Database>

const PROFILE_SELECT = `
  *,
  profile_relations_looking(relation),
  profile_industries(industry_slug),
  profile_work_styles(work_style),
  profile_events(event_code),
  profile_cities(city_slug, is_primary)
` as const

export async function fetchVisibleProfilesForFeed(
  supabase: Client,
  options: { excludeUserId: string; eventCode?: string | null }
): Promise<Profile[]> {
  const { excludeUserId, eventCode } = options

  if (eventCode) {
    const { data: rpcRows, error: rpcError } = await supabase.rpc(
      "profiles_by_event_code",
      { p_code: eventCode.trim().toUpperCase() }
    )
    if (rpcError || !rpcRows?.length) return []

    const ids = rpcRows
      .map((r) => r.id)
      .filter((id) => id && id !== excludeUserId)
    if (!ids.length) return []

    const { data, error } = await supabase
      .from("profiles")
      .select(PROFILE_SELECT)
      .in("id", ids)
      .eq("visible", true)

    if (error || !data) return []
    return data.map((row) => mapProfileJoinRow(row))
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("visible", true)
    .neq("id", excludeUserId)
    .order("updated_at", { ascending: false })
    .limit(48)

  if (error || !data) return []
  return data.map((row) => mapProfileJoinRow(row))
}

export async function fetchProfilesByIds(
  supabase: Client,
  ids: string[]
): Promise<Map<string, Profile>> {
  const uniq = [...new Set(ids.filter(Boolean))]
  const out = new Map<string, Profile>()
  if (!uniq.length) return out

  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .in("id", uniq)

  if (error || !data) return out
  for (const row of data) {
    out.set(row.id, mapProfileJoinRow(row))
  }
  return out
}

export async function fetchProfileById(
  supabase: Client,
  id: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", id)
    .maybeSingle()

  if (error || !data) return null
  return mapProfileJoinRow(data)
}

export async function fetchProfileBareById(
  supabase: Client,
  id: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle()
  if (error || !data) return null
  return mapProfileBareRow(data)
}
