import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"
import { mapEventRowToEntry } from "@/lib/data/mappers"
import type { EventEntry } from "@/lib/types"

type Client = SupabaseClient<Database>

function normalizeEventCode(code: string) {
  return code.trim().toUpperCase()
}

export async function fetchEventByCode(
  supabase: Client,
  code: string
): Promise<EventEntry | null> {
  const normalized = normalizeEventCode(code)
  if (!normalized) return null

  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "find_event_by_code",
    { p_code: normalized }
  )

  if (!rpcError && rpcData) {
    const row = Array.isArray(rpcData) ? rpcData[0] : rpcData
    if (row && typeof row === "object" && "code" in row) {
      return mapEventRowToEntry(row as Parameters<typeof mapEventRowToEntry>[0])
    }
  }

  const { data: direct, error: directError } = await supabase
    .from("events")
    .select("code, name, description")
    .eq("code", normalized)
    .maybeSingle()

  if (directError || !direct) return null
  return mapEventRowToEntry(direct)
}

export async function countProfilesInEvent(
  supabase: Client,
  code: string
): Promise<number> {
  const normalized = normalizeEventCode(code)
  const { count, error } = await supabase
    .from("profile_events")
    .select("profile_id", { count: "exact", head: true })
    .eq("event_code", normalized)

  if (error) return 0
  return count ?? 0
}

export async function joinEventByCode(
  supabase: Client,
  code: string
): Promise<{ ok: true; event: EventEntry } | { ok: false; message: string }> {
  const normalized = normalizeEventCode(code)
  const { data, error } = await supabase.rpc("join_event", { p_code: normalized })

  if (error) {
    return { ok: false, message: error.message }
  }

  const row = Array.isArray(data) ? data[0] : data
  if (!row || typeof row !== "object" || !("code" in row)) {
    return { ok: false, message: "No pudimos unirte al evento." }
  }

  return {
    ok: true,
    event: mapEventRowToEntry(row as Parameters<typeof mapEventRowToEntry>[0]),
  }
}
