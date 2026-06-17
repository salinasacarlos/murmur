"use client"

import type { Profile } from "@/lib/types"
import { ProfileViewContent } from "@/components/profile/profile-view-content"
import { ProfileInteractionActions } from "@/components/profile/profile-interaction-actions"

interface PublicProfileViewProps {
  profile: Profile
}

export function PublicProfileView({ profile }: PublicProfileViewProps) {
  return (
    <div className="max-w-3xl mx-auto w-full px-4 md:px-8 py-8 md:py-10">
      <ProfileViewContent profile={profile} />
      <div
        className="mt-8 pt-6 border-t-[0.5px] border-[var(--border)]"
        style={{ paddingBottom: "calc(16px + var(--sab))" }}
      >
        <ProfileInteractionActions profile={profile} loadConnectionHint />
      </div>
    </div>
  )
}
