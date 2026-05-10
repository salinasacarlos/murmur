import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"

type Client = SupabaseClient<Database>

export async function sendProjectInvite(
  supabase: Client,
  inviteeId: string,
  title: string,
  contextPath = "/searches"
): Promise<string | null> {
  const { data, error } = await supabase.rpc("send_project_invite", {
    p_invitee_id: inviteeId,
    p_title: title,
    p_context_path: contextPath,
  })
  if (error || data == null) return null
  return data
}

export async function declineProjectInvite(
  supabase: Client,
  inviteId: string
): Promise<boolean> {
  const { error } = await supabase.rpc("decline_project_invite", {
    p_invite_id: inviteId,
  })
  return !error
}
