"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      viewBox="0 0 24 24"
      width={18}
      height={18}
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

type GoogleAuthButtonProps = {
  /** Ruta interna post-login si el onboarding ya está completo (ej. `next` del query). */
  nextPath?: string | null
  className?: string
  onError?: (message: string) => void
}

export function GoogleAuthButton({
  nextPath,
  className,
  onError,
}: GoogleAuthButtonProps) {
  const [busy, setBusy] = React.useState(false)

  async function handleGoogle() {
    setBusy(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const params = new URLSearchParams()
      if (
        nextPath &&
        nextPath.startsWith("/") &&
        !nextPath.startsWith("//")
      ) {
        params.set("next", nextPath)
      }
      const qs = params.toString()
      const redirectTo = `${window.location.origin}/auth/callback${qs ? `?${qs}` : ""}`
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      })
      if (error) {
        onError?.(error.message)
        setBusy(false)
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No pudimos conectar con Google. Intenta de nuevo."
      onError?.(message)
      setBusy(false)
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      className={cn("w-full justify-center gap-2.5 border-[var(--border)]", className)}
      disabled={busy}
      onClick={() => void handleGoogle()}
    >
      <GoogleGlyph />
      {busy ? "Conectando…" : "Continuar con Google"}
    </Button>
  )
}

function AuthDivider() {
  return (
    <div className="relative my-6" role="presentation">
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className="w-full border-t-[0.5px] border-[var(--border)]" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-[var(--bg)] px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)]">
          o
        </span>
      </div>
    </div>
  )
}

export { AuthDivider }
