"use client"

import * as React from "react"

import { SidePanel } from "@/components/ui/drawer"
import { ProfileViewContent } from "@/components/profile/profile-view-content"
import { ProfileInteractionActions } from "@/components/profile/profile-interaction-actions"
import type { PeerConnectionHint } from "@/lib/data/connections"
import type { ProfileRecommendationVote } from "@/lib/recommendation-types"
import type { Profile } from "@/lib/types"
import { IconX } from "@/components/icons"

interface ProfileDetailPanelProps {
  profile: Profile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  connectionHint?: PeerConnectionHint
  onConnectionsChanged?: () => void
  myRecommendationVote?: ProfileRecommendationVote | null
  onRecommendationChange?: (
    vote: ProfileRecommendationVote | null,
    recommendationCount: number
  ) => void
}

export function ProfileDetailPanel({
  profile,
  open,
  onOpenChange,
  connectionHint = { state: "none" },
  onConnectionsChanged,
  myRecommendationVote = null,
  onRecommendationChange,
}: ProfileDetailPanelProps) {
  if (!profile) return null

  return (
    <SidePanel
      open={open}
      onOpenChange={onOpenChange}
      ariaLabel={`Perfil de ${profile.name}`}
    >
      <div className="flex flex-col h-full">
        <div
          className="flex items-center justify-between px-5 py-4 border-b-[0.5px] border-[var(--border)] sticky top-0 bg-[var(--bg)]"
          style={{ paddingTop: "calc(16px + var(--sat))" }}
        >
          <h2 className="text-[16px] font-bold tracking-[-0.3px]">Perfil</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-1.5 rounded-md hover:bg-[var(--bg2)] text-[var(--text2)]"
            aria-label="Cerrar"
          >
            <IconX size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <ProfileViewContent profile={profile} showAchievementHint />
        </div>

        <div
          className="border-t-[0.5px] border-[var(--border)] px-5 py-4 sticky bottom-0 bg-[var(--bg)]"
          style={{ paddingBottom: "calc(16px + var(--sab))" }}
        >
          <ProfileInteractionActions
            profile={profile}
            onClose={() => onOpenChange(false)}
            connectionHint={connectionHint}
            onConnectionsChanged={onConnectionsChanged}
            myRecommendationVote={myRecommendationVote}
            onRecommendationChange={onRecommendationChange}
          />
        </div>
      </div>
    </SidePanel>
  )
}
