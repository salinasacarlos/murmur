import type { User } from "@supabase/supabase-js"

import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Topbar } from "@/components/layout/topbar"
import { CurrentUserProvider } from "@/components/providers/current-user-provider"
import type { ProfileRow } from "@/components/providers/current-user-provider"
import { DiscoverFeedProvider } from "@/components/providers/discover-feed-provider"
import { NotificationsUnreadProvider } from "@/components/providers/notifications-unread-provider"
import { ActivityPing } from "@/components/providers/activity-ping"
import { VisibilityDbSync } from "@/components/providers/visibility-db-sync"

interface AuthenticatedAppShellProps {
  user: User
  profile: ProfileRow
  children: React.ReactNode
}

/** Shell principal de Murmur: sidebar, topbar y bottom nav (estilo LinkedIn in-app). */
export function AuthenticatedAppShell({
  user,
  profile,
  children,
}: AuthenticatedAppShellProps) {
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
