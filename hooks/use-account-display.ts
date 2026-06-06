"use client"

import { useCurrentUser } from "@/components/providers/current-user-provider"

export function useAccountDisplay() {
  const { profile, user } = useCurrentUser()

  const displayName =
    profile?.name?.trim() ||
    (user?.user_metadata?.name as string | undefined)?.trim() ||
    user?.email ||
    "Tu cuenta"

  const initials =
    profile?.initials || displayName.slice(0, 2).toUpperCase() || "TU"

  const photoUrl = profile?.photo_url ?? undefined
  const planLabel = profile?.plan === "premium" ? "Premium" : "Free"

  return { displayName, initials, photoUrl, planLabel }
}
