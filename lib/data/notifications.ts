import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"

type Client = SupabaseClient<Database>

export type NotificationKind = Database["public"]["Enums"]["notification_kind"]

export type AppNotification = Database["public"]["Tables"]["notifications"]["Row"]

export async function runDigestNotifications(supabase: Client): Promise<void> {
  await supabase.rpc("ensure_digest_notifications")
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
