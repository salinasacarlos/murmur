"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Field, Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const router = useRouter()
  const supabase = React.useMemo(() => getSupabaseBrowserClient(), [])

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

    if (password.length < 8) {
      setSubmitting(false)
      setError("La contraseña debe tener al menos 8 caracteres.")
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name.trim(),
        },
      },
    })

    if (signUpError) {
      setSubmitting(false)
      setError(signUpError.message)
      return
    }

    if (!data.session) {
      setSubmitting(false)
      setInfo(
        "Te enviamos un correo para confirmar tu cuenta. Confirma desde el enlace y vuelve a iniciar sesión."
      )
      return
    }

    router.replace("/onboarding")
    router.refresh()
  }

  return (
    <Card padding="default" className="bg-[var(--bg)] p-8">
      <h1 className="text-[18px] font-extrabold tracking-[-0.4px] mb-1">
        Crea tu cuenta
      </h1>
      <p className="text-[13px] text-[var(--text2)] mb-6">
        Empieza a construir con las personas correctas.
      </p>

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
          <Input
            type="password"
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
          Al continuar aceptas los Términos y la Política de privacidad.
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
