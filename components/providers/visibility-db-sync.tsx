"use client"

import * as React from "react"

import { useCurrentUser } from "@/components/providers/current-user-provider"
import { useVisibility } from "@/components/providers/visibility-provider"

/** Keeps visibility toggle aligned con `profiles.visible` al cargar o cuando cambia ese campo en BD. */
export function VisibilityDbSync() {
  const { profile } = useCurrentUser()
  const { setVisible } = useVisibility()

  const visibleFromDb = profile?.visible
  const profileId = profile?.id

  React.useEffect(() => {
    if (!profileId || typeof visibleFromDb !== "boolean") return
    setVisible(visibleFromDb)
  }, [profileId, visibleFromDb, setVisible])

  return null
}
