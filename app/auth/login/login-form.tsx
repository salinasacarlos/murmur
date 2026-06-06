"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { AuthDivider, GoogleAuthButton } from "@/components/auth/google-auth-button"
import { Button } from "@/components/ui/button"
import { Field, Input, PasswordInput } from "@/components/ui/input"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const nextParam = searchParams.get("next")

  React.useEffect(() => {
    const code = searchParams.get("error")
    if (code === "oauth") {
      setError("No pudimos entrar con Google. Intenta de nuevo.")
    } else if (code === "config") {
      setError("Falta configuración del servidor. Contacta soporte.")
    }
  }, [searchParams])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword(
        {
          email: email.trim(),
          password,
        }
      )

      if (signInError || !data.user) {
        setError(signInError?.message ?? "No pudimos iniciar tu sesión.")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", data.user.id)
        .maybeSingle()

      const next = searchParams.get("next")
      const target = profile?.onboarding_completed
        ? next && next.startsWith("/")
          ? next
          : "/feed"
        : "/onboarding"

      router.replace(target)
      router.refresh()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No pudimos iniciar tu sesión."
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const resetOk = searchParams.get("reset") === "1"

  return (
    <>
      {resetOk ? (
        <p
          className="text-[12px] text-[var(--g)] mb-3 -mt-2"
          role="status"
        >
          Contraseña actualizada. Ya puedes entrar.
        </p>
      ) : null}
      <GoogleAuthButton
        nextPath={nextParam}
        onError={(message) => setError(message)}
      />
      <AuthDivider />
      {error && (
        <p className="text-[12px] text-[var(--red)] -mt-2 mb-1" role="alert">
          {error}
        </p>
      )}
      <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
        <Field label="Email">
          <Input
            type="email"
            placeholder="tu@email.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Contraseña">
          <PasswordInput
            placeholder="••••••••"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <p className="text-[11px] text-right -mt-1">
          <Link
            href="/auth/forgot-password"
            className="text-[var(--p)] font-semibold hover:underline underline-offset-2"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </p>

        <Button
          type="submit"
          size="lg"
          className="mt-2 justify-center"
          disabled={submitting}
        >
          {submitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </>
  )
}
