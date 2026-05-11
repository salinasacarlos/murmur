"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { AuthDivider, GoogleAuthButton } from "@/components/auth/google-auth-button"
import { Button } from "@/components/ui/button"
import { Field, Input, PasswordInput } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const router = useRouter()

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [info, setInfo] = React.useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    setInfo(null)

    try {
      if (password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres.")
        return
      }

      const trimmedEmail = email.trim()
      const supabase = getSupabaseBrowserClient()
      const emailRedirectTo =
        process.env.NEXT_PUBLIC_AUTH_CONFIRM_REDIRECT?.trim() ||
        `${window.location.origin}/auth/login`

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo,
          data: {
            name: name.trim(),
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (!data.session) {
        // Supabase no reenvía el correo de confirmación si el email ya existe
        // (logs: user_repeated_signup). identities vacío = cuenta ya registrada.
        const identities = data.user?.identities
        const isRepeatedSignup =
          Boolean(data.user) &&
          Array.isArray(identities) &&
          identities.length === 0

        if (isRepeatedSignup) {
          const { error: resendError } = await supabase.auth.resend({
            type: "signup",
            email: trimmedEmail,
            options: { emailRedirectTo },
          })
          if (resendError) {
            setError(
              `${resendError.message} Si ya confirmaste tu cuenta, inicia sesión.`
            )
            return
          }
        }

        setInfo(
          "Te enviamos un correo para confirmar tu cuenta. Confirma desde el enlace y vuelve a iniciar sesión. Revisa spam o la carpeta Promociones."
        )
        return
      }

      router.replace("/onboarding")
      router.refresh()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No pudimos crear tu cuenta. Intenta de nuevo."
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card padding="default" className="bg-[var(--bg)] p-8">
      <h1 className="text-[18px] font-extrabold tracking-[-0.4px] mb-1">
        Crea tu cuenta
      </h1>
      <p className="text-[13px] text-[var(--text2)] mb-6">
        Empieza a construir con las personas correctas.
      </p>

      <GoogleAuthButton onError={(message) => setError(message)} />
      <AuthDivider />

      <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
        <Field label="Nombre">
          <Input
            type="text"
            placeholder="Cómo te llamas"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
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
        <Field
          label="Contraseña"
          hint="Mínimo 8 caracteres."
        >
          <PasswordInput
            placeholder="••••••••"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        {error && (
          <p className="text-[12px] text-[var(--red)] -mt-1" role="alert">
            {error}
          </p>
        )}
        {info && (
          <p className="text-[12px] text-[var(--text2)] -mt-1" role="status">
            {info}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="mt-2 justify-center"
          disabled={submitting}
        >
          {submitting ? "Creando cuenta..." : "Crear cuenta"}
        </Button>

        <p className="text-[10px] text-[var(--text3)] text-center mt-1 leading-relaxed">
          Al continuar aceptas los{" "}
          <Link href="/terms" className="text-[var(--p)] underline-offset-2 hover:underline">
            Términos
          </Link>{" "}
          y el{" "}
          <Link href="/privacy" className="text-[var(--p)] underline-offset-2 hover:underline">
            Aviso de privacidad
          </Link>
          .
        </p>
      </form>

      <p className="text-[12px] text-[var(--text2)] text-center mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="text-[var(--p)] font-semibold">
          Entrar
        </Link>
      </p>
    </Card>
  )
}
