import * as React from "react"
import { redirect } from "next/navigation"

import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Topbar } from "@/components/layout/topbar"
import { CurrentUserProvider } from "@/components/providers/current-user-provider"
import { DiscoverFeedProvider } from "@/components/providers/discover-feed-provider"
import { NotificationsUnreadProvider } from "@/components/providers/notifications-unread-provider"
import { ActivityPing } from "@/components/providers/activity-ping"
import { VisibilityDbSync } from "@/components/providers/visibility-db-sync"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// Session + Supabase live in cookies; avoid static prerender (build fails without env).
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
    <CurrentUserProvider initialUser={user} initialProfile={profile}>
      <NotificationsUnreadProvider>
        <DiscoverFeedProvider>
          <VisibilityDbSync />
          <ActivityPing />
          <div className="min-h-svh bg-[var(--bg)]">
            <Sidebar />
            <div className="md:pl-[224px] flex flex-col min-h-svh">
              <Topbar />
              <main className="flex min-h-0 flex-1 flex-col pb-[calc(var(--mobile-nav-h)+var(--sab))] md:pb-0">
                {children}
              </main>
              <BottomNav />
            </div>
          </div>
        </DiscoverFeedProvider>
      </NotificationsUnreadProvider>
    </CurrentUserProvider>
  )
}
