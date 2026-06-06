"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Field, PasswordInput } from "@/components/ui/input"
import { validatePasswordMatch } from "@/lib/password-auth"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [ready, setReady] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!cancelled) setReady(Boolean(user))
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    const validation = validatePasswordMatch(password, confirm)
    if (validation) {
      setError(validation)
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        setError("No pudimos actualizar tu contraseña. Intenta de nuevo.")
        return
      }

      router.replace("/auth/login?reset=1")
      router.refresh()
    } catch {
      setError("No pudimos actualizar tu contraseña. Intenta de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  if (ready === null) {
    return (
      <p className="text-[13px] text-[var(--text2)]">Verificando enlace…</p>
    )
  }

  if (!ready) {
    return (
      <div className="text-[13px] text-[var(--text2)] leading-relaxed">
        <p>
          El enlace no es válido o expiró. Solicita uno nuevo para restablecer
          tu contraseña.
        </p>
        <Link
          href="/auth/forgot-password"
          className="inline-block mt-4 text-[var(--p)] font-semibold"
        >
          Pedir nuevo enlace
        </Link>
      </div>
    )
  }

  return (
    <>
      {error ? (
        <p className="text-[12px] text-[var(--red)] mb-3" role="alert">
          {error}
        </p>
      ) : null}
      <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
        <Field label="Nueva contraseña" hint="Mínimo 8 caracteres.">
          <PasswordInput
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field label="Confirmar contraseña">
          <PasswordInput
            autoComplete="new-password"
            minLength={8}
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>
        <Button
          type="submit"
          size="lg"
          className="mt-2 justify-center"
          disabled={submitting}
        >
          {submitting ? "Guardando…" : "Guardar contraseña"}
        </Button>
      </form>
    </>
  )
}
