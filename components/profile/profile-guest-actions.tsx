"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { profilePublicPath } from "@/lib/profile-path"
import { safeInternalPath } from "@/lib/safe-internal-path"
import type { Profile } from "@/lib/types"

/** Un solo CTA inferior para visitantes. Auth vive en el header. */
export function ProfileGuestConnectButton({ profile }: { profile: Profile }) {
  const profilePath = profilePublicPath(profile.id)
  const returnTo = safeInternalPath(profilePath, profilePath)
  const signupHref = `/auth/signup?next=${encodeURIComponent(returnTo)}`

  return (
    <Link href={signupHref} className="block">
      <Button size="lg" className="w-full justify-center">
        Conectar
      </Button>
    </Link>
  )
}
