"use client"

import * as React from "react"

import { useCurrentUser } from "@/components/providers/current-user-provider"
import { useVisibility } from "@/components/providers/visibility-provider"

/** Keeps visibility toggle aligned with `profiles.visible` (overrides localStorage when profile loads). */
export function VisibilityDbSync() {
  const { profile } = useCurrentUser()
  const { setVisible } = useVisibility()

  React.useEffect(() => {
    if (!profile) return
    setVisible(profile.visible)
  }, [profile?.id, profile?.visible, setVisible])

  return null
}
