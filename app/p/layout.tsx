import { CurrentUserProvider } from "@/components/providers/current-user-provider"
import { AuthenticatedAppShell } from "@/components/layout/authenticated-app-shell"
import { PublicGuestChrome } from "@/components/layout/public-guest-chrome"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function PublicProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()
    profile = data
  }

  const inApp =
    Boolean(user) &&
    Boolean(profile) &&
    profile?.onboarding_completed === true

  if (inApp && user && profile) {
    return (
      <AuthenticatedAppShell user={user} profile={profile}>
        {children}
      </AuthenticatedAppShell>
    )
  }

  return (
    <CurrentUserProvider initialUser={user} initialProfile={profile}>
      <PublicGuestChrome>{children}</PublicGuestChrome>
    </CurrentUserProvider>
  )
}
