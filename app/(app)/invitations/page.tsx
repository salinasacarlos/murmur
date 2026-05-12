"use client"

import * as React from "react"

import { MyInvitationsSection } from "@/components/profile/my-invitations-section"
import { useCurrentUser } from "@/components/providers/current-user-provider"

export default function InvitationsPage() {
  const { user: authUser } = useCurrentUser()

  if (!authUser?.id) {
    return (
      <div className="px-4 md:px-6 py-10 text-[13px] text-[var(--text2)]">
        Cargando…
      </div>
    )
  }

  return (
    <div className="px-4 md:px-6 py-5 md:py-6 max-w-[640px] mx-auto w-full flex flex-col gap-4">
      <div>
        <h1 className="text-[18px] md:text-[22px] font-extrabold tracking-[-0.4px]">
          Mis invitaciones
        </h1>
        <p className="text-[13px] md:text-[14px] text-[var(--text2)] mt-1 md:mt-1.5 leading-relaxed">
          Comparte tu enlace. Cada código solo puede usarse una vez.
        </p>
      </div>
      <MyInvitationsSection userId={authUser.id} embedInPage />
    </div>
  )
}
