"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Field, Input } from "@/components/ui/input"
import { buildAuthCallbackUrl } from "@/lib/site-origin"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function ForgotPasswordForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fromUrl = searchParams.get("email")?.trim()
    if (fromUrl) setEmail(fromUrl)
  }, [searchParams])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const redirectTo = buildAuthCallbackUrl("/auth/reset-password")
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo }
      )

      if (resetError) {
        setError("No pudimos enviar el enlace. Intenta de nuevo.")
        return
      }

      setSent(true)
    } catch {
      setError("No pudimos enviar el enlace. Intenta de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="text-[13px] text-[var(--text2)] leading-relaxed">
        <p>
          Si existe una cuenta con ese correo, te enviamos un enlace para
          restablecer tu contraseña. Revisa spam si no lo ves en unos minutos.
        </p>
        <Link
          href="/auth/login"
          className="inline-block mt-4 text-[var(--p)] font-semibold text-[13px]"
        >
          Volver a entrar
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
        <Button
          type="submit"
          size="lg"
          className="mt-2 justify-center"
          disabled={submitting}
        >
          {submitting ? "Enviando…" : "Enviar enlace"}
        </Button>
      </form>
    </>
  )
}
