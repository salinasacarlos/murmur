"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { AuthDivider, GoogleAuthButton } from "@/components/auth/google-auth-button"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Field, Input, PasswordInput } from "@/components/ui/input"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { initialsFromName } from "@/lib/current-user-mapping"
import {
  mapInviteSignUpErrorMessage,
  normalizeInviteCodeInput,
} from "@/lib/invite-code"
import type { InvitePreviewResponse } from "@/lib/invite-preview"
import { INVITE_PREVIEW_DEBOUNCE_MS } from "@/lib/platform-defaults"
import { getClientAuthOrigin } from "@/lib/site-origin"

function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

function previewErrorLabel(error: string | undefined): string {
  switch (error) {
    case "format":
      return "Formato inválido. Usa MRM- y 8 caracteres (letras o números)."
    case "not_found":
      return "Este código no existe."
    case "used":
      return "Este código ya fue usado."
    case "missing":
      return "Falta el código."
    case "config":
    case "server":
      return "No pudimos validar el código. Intenta de nuevo."
    default:
      return "Código no válido."
  }
}

export function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [inviteInput, setInviteInput] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [info, setInfo] = React.useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = React.useState(false)
  const [preview, setPreview] = React.useState<InvitePreviewResponse | null>(null)

  const debouncedInvite = useDebouncedValue(inviteInput, INVITE_PREVIEW_DEBOUNCE_MS)

  React.useEffect(() => {
    const fromUrl = searchParams.get("invite")?.trim() ?? ""
    if (fromUrl) {
      setInviteInput(fromUrl)
    }
  }, [searchParams])

  React.useEffect(() => {
    const normalized = normalizeInviteCodeInput(debouncedInvite)
    if (!normalized) {
      setPreview(null)
      setPreviewLoading(false)
      return
    }

    let cancelled = false
    setPreviewLoading(true)
    void (async () => {
      try {
        const res = await fetch(
          `/api/invites/preview?code=${encodeURIComponent(normalized)}`
        )
        const body = (await res.json()) as InvitePreviewResponse
        if (cancelled) return
        setPreview(body)
      } catch {
        if (!cancelled) {
          setPreview({ ok: false, error: "server" })
        }
      } finally {
        if (!cancelled) setPreviewLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [debouncedInvite])

  const normalizedCode = React.useMemo(
    () => normalizeInviteCodeInput(inviteInput),
    [inviteInput]
  )
  const inviteValid = preview?.ok === true && Boolean(normalizedCode)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting || !inviteValid || !normalizedCode) return
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
        `${getClientAuthOrigin()}/auth/login`

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo,
          data: {
            name: name.trim(),
            invite_code: normalizedCode,
          },
        },
      })

      if (signUpError) {
        setError(mapInviteSignUpErrorMessage(signUpError.message))
        return
      }

      if (!data.session) {
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
      setError(mapInviteSignUpErrorMessage(message))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <GoogleAuthButton
        inviteCode={inviteValid && normalizedCode ? normalizedCode : null}
        disabled={!inviteValid || previewLoading}
        onError={(message) => setError(message)}
      />
      <AuthDivider />

      <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
        <Field label="Código de invitación" required>
          <Input
            type="text"
            placeholder="MRM-XXXXXXXX"
            autoComplete="off"
            spellCheck={false}
            value={inviteInput}
            onChange={(e) => setInviteInput(e.target.value)}
            aria-invalid={inviteInput.length > 0 && !inviteValid && !previewLoading}
          />
        </Field>

        {previewLoading && debouncedInvite.trim().length > 0 && (
          <p className="text-[12px] text-[var(--text3)] -mt-1">Validando código…</p>
        )}

        {!previewLoading &&
          inviteInput.trim().length > 0 &&
          normalizedCode &&
          preview &&
          !preview.ok && (
            <p className="text-[12px] text-[var(--red)] -mt-1" role="alert">
              {previewErrorLabel(preview.error)}
            </p>
          )}

        {!previewLoading &&
          inviteValid &&
          preview?.ok &&
          (preview.master ? (
            <p className="text-[12px] text-[var(--text2)] -mt-1 leading-snug">
              Código de acceso válido. Completa tu registro para entrar.
            </p>
          ) : preview.inviter ? (
            <div className="flex items-center gap-3 -mt-1 mb-1 p-3 rounded-lg border-[0.5px] border-[var(--border)] bg-[var(--bg2)]">
              <Avatar
                initials={initialsFromName(preview.inviter.name) || "?"}
                imageUrl={preview.inviter.photoUrl ?? undefined}
                size="md"
              />
              <div className="min-w-0">
                <p className="text-[12px] text-[var(--text2)]">
                  Fuiste invitado por{" "}
                  <span className="font-semibold text-[var(--text)]">
                    {preview.inviter.name}
                  </span>
                </p>
                {preview.inviter.role ? (
                  <p className="text-[11px] text-[var(--text3)] truncate">
                    {preview.inviter.role}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null)}

        {!inviteValid && !previewLoading ? (
          <p className="text-[12px] text-[var(--text2)] text-center leading-snug -mt-1 mb-1">
            ¿No tienes código?{" "}
            <Link
              href="/auth/request-access"
              className="text-[var(--p)] font-semibold"
            >
              Solicitar acceso
            </Link>
          </p>
        ) : null}

        <Field label="Nombre">
          <Input
            type="text"
            placeholder="Cómo te llamas"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!inviteValid}
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
            disabled={!inviteValid}
          />
        </Field>
        <Field label="Contraseña" hint="Mínimo 8 caracteres.">
          <PasswordInput
            placeholder="••••••••"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!inviteValid}
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
          disabled={submitting || !inviteValid || previewLoading}
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
    </>
  )
}
