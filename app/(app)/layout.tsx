import * as React from "react"
import { redirect } from "next/navigation"

import { AuthenticatedAppShell } from "@/components/layout/authenticated-app-shell"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  const onboardingDone = profile?.onboarding_completed === true
  if (!profile || !onboardingDone) {
    redirect("/onboarding")
  }

  return (
    <AuthenticatedAppShell user={user} profile={profile}>
      {children}
    </AuthenticatedAppShell>
  )
}
