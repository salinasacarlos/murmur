"use client"

import type { Profile } from "@/lib/types"
import { ProfileViewContent } from "@/components/profile/profile-view-content"
import { ProfileGuestConnectButton } from "@/components/profile/profile-guest-actions"
import { ProfileInteractionActions } from "@/components/profile/profile-interaction-actions"
import { useCurrentUser } from "@/components/providers/current-user-provider"
import { cn } from "@/lib/utils"

interface PublicProfileViewProps {
  profile: Profile
  /** Resuelto en servidor: visitante sin sesión (no usar ProfileInteractionActions). */
  isPublicGuest: boolean
}

export function PublicProfileView({
  profile,
  isPublicGuest,
}: PublicProfileViewProps) {
  const { user, profile: myProfile, loading } = useCurrentUser()
  const inApp =
    !isPublicGuest &&
    !loading &&
    Boolean(user) &&
    Boolean(myProfile?.onboarding_completed)

  return (
    <div
      className={cn(
        "mx-auto w-full",
        inApp
          ? "max-w-2xl px-4 md:px-6 py-6 md:py-8"
          : "max-w-3xl px-4 md:px-8 py-6 md:py-10"
      )}
    >
      {isPublicGuest ? (
        <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text3)]">
          Perfil en Murmur
        </p>
      ) : null}

      <ProfileViewContent profile={profile} />

      <div
        className="mt-8 pt-6 border-t-[0.5px] border-[var(--border)]"
        style={isPublicGuest ? { paddingBottom: "calc(16px + var(--sab))" } : undefined}
      >
        {isPublicGuest ? (
          <ProfileGuestConnectButton profile={profile} />
        ) : inApp ? (
          <ProfileInteractionActions profile={profile} loadConnectionHint />
        ) : null}
      </div>
    </div>
  )
}
