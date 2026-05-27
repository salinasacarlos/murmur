import { Resend } from "resend"

/** Remitente por defecto de Resend (solo pruebas; en prod verifica tu dominio). */
const RESEND_TEST_FROM = "Murmur <onboarding@resend.dev>"

export function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim()
  if (!key) return null
  return new Resend(key)
}

export function getEmailFrom(): string {
  const from = process.env.EMAIL_FROM?.trim()
  if (from) return from
  return RESEND_TEST_FROM
}

export function getResendConfigError(): string | null {
  if (!process.env.RESEND_API_KEY?.trim()) {
    return "Falta RESEND_API_KEY en el servidor (Vercel → Environment Variables)."
  }
  return null
}
