"use client"

import type { Profile } from "@/lib/types"
import { ProfileViewContent } from "@/components/profile/profile-view-content"
import { ProfileInteractionActions } from "@/components/profile/profile-interaction-actions"
import { useCurrentUser } from "@/components/providers/current-user-provider"
import { cn } from "@/lib/utils"

interface PublicProfileViewProps {
  profile: Profile
}

export function PublicProfileView({ profile }: PublicProfileViewProps) {
  const { user, profile: myProfile, loading } = useCurrentUser()
  const inApp =
    !loading &&
    Boolean(user) &&
    Boolean(myProfile?.onboarding_completed)

  return (
    <div
      className={cn(
        "mx-auto w-full",
        inApp
          ? "max-w-2xl px-4 md:px-6 py-6 md:py-8"
          : "max-w-3xl px-4 md:px-8 py-8 md:py-10"
      )}
    >
      <ProfileViewContent profile={profile} />
      <div
        className={cn(
          "mt-8 pt-6 border-t-[0.5px] border-[var(--border)]",
          !inApp && "pb-[calc(16px+var(--sab))]"
        )}
      >
        <ProfileInteractionActions profile={profile} loadConnectionHint />
      </div>
    </div>
  )
}
