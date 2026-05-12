import type { User } from "@supabase/supabase-js"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function getMurmurAdminSession(): Promise<{
  user: User
} | null> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_murmur_admin")
    .eq("id", user.id)
    .maybeSingle()

  if (error || !profile?.is_murmur_admin) return null
  return { user }
}
