import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"

type Client = SupabaseClient<Database>

export type NotificationKind = Database["public"]["Enums"]["notification_kind"]

export type AppNotification = Database["public"]["Tables"]["notifications"]["Row"]

export async function runDigestNotifications(supabase: Client): Promise<void> {
  await supabase.rpc("ensure_digest_notifications")
  await ensureHighCompatibilitySuggestions(supabase)
}

/** Best-effort scan for high-compatibility matches vs active searches (subject to server anti-spam). */
export async function ensureHighCompatibilitySuggestions(
  supabase: Client
): Promise<void> {
  await supabase.rpc("ensure_high_compatibility_suggestions")
}

/**
 * Same RPC as {@link ensureHighCompatibilitySuggestions}, at most once per browser tab session
 * (see sessionStorage) to avoid extra load on each feed refresh.
 */
export async function ensureHighCompatibilitySuggestionsSessionOnce(
  supabase: Client,
  userId: string
): Promise<void> {
  if (typeof window === "undefined") return
  try {
    const key = `murmur:hc-suggestions:${userId}`
    if (window.sessionStorage.getItem(key)) return
    window.sessionStorage.setItem(key, "1")
    await ensureHighCompatibilitySuggestions(supabase)
  } catch {
    // non-blocking
  }
}

export async function touchProfileActivity(supabase: Client): Promise<void> {
  await supabase.rpc("touch_profile_activity")
}

export async function fetchNotifications(
  supabase: Client,
  userId: string,
  limit = 80
): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return data
}

export async function countUnreadNotifications(
  supabase: Client,
  userId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("read_at", null)

  if (error) return 0
  return count ?? 0
}

export async function markNotificationRead(
  supabase: Client,
  notificationId: string,
  userId: string
): Promise<boolean> {
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", userId)

  return !error
}

export async function markAllNotificationsRead(
  supabase: Client,
  userId: string
): Promise<boolean> {
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null)

  return !error
}
