"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function OnboardingSignOutLink() {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)

  async function handleSignOut() {
    if (busy) return
    setBusy(true)
    try {
      const supabase = getSupabaseBrowserClient()
      await supabase.auth.signOut()
      router.replace("/auth/login")
      router.refresh()
    } catch {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      disabled={busy}
      className="text-[12px] text-[var(--text2)] hover:text-[var(--text)] transition-colors disabled:opacity-50 text-right max-w-[min(100%,220px)]"
    >
      {busy ? (
        "Cerrando sesión…"
      ) : (
        <>
          <span className="text-[var(--text3)]">¿No eres tú?</span>{" "}
          <span className="font-semibold text-[var(--p)]">Cerrar sesión</span>
        </>
      )}
    </button>
  )
}
