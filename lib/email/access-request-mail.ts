import { Resend } from "resend"

import { getPublicSiteUrl } from "@/lib/public-site-url"

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim()
  if (!key) return null
  return new Resend(key)
}

function getFrom(): string | null {
  const from = process.env.EMAIL_FROM?.trim()
  return from || null
}

export async function sendAccessRequestReceivedEmail(args: {
  to: string
  firstName: string
  queuePosition: number
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const resend = getResend()
  const from = getFrom()
  if (!resend || !from) {
    return {
      ok: false,
      message: "Faltan RESEND_API_KEY o EMAIL_FROM.",
    }
  }

  const site = getPublicSiteUrl()
  const name =
    args.firstName.split(/\s+/)[0] ||
    args.firstName ||
    "Hola"

  const subject = `Recibimos tu solicitud — lugar #${args.queuePosition} en la lista`
  const text = `${name},

Gracias por querer entrar a Murmur. Ya tenemos tu solicitud y la vamos revisando con calma; no es automatizado, así que puede llevarnos un poco.

Mientras tanto, guarda este dato: estás en el lugar #${args.queuePosition} de quienes esperan. Te avisaremos por correo cuando haya novedades.

Si llegas antes que el acceso, aquí está la puerta cuando quieras volver: ${site}

Un abrazo,
El equipo de Murmur`

  const html = `
<p>Hola${name !== "Hola" ? ` ${escapeHtml(name)}` : ""},</p>
<p>Gracias por querer entrar a <strong>Murmur</strong>. Ya tenemos tu solicitud y la vamos revisando con calma; no es automatizado, así que puede llevarnos un poco.</p>
<p>Mientras tanto, guarda este dato: estás en el <strong>lugar #${args.queuePosition}</strong> de quienes esperan. Te avisaremos por correo cuando haya novedades.</p>
<p>Si quieres volver a nuestra entrada: <a href="${escapeHtml(site)}">${escapeHtml(site)}</a></p>
<p>Un abrazo,<br/>El equipo de Murmur</p>`

  const { error } = await resend.emails.send({
    from,
    to: args.to,
    subject,
    text,
    html,
  })

  if (error) {
    console.error("[access-request-mail] received:", error)
    return { ok: false, message: error.message }
  }
  return { ok: true }
}

export async function sendAccessRequestApprovedEmail(args: {
  to: string
  firstName: string
  inviteCode: string
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const resend = getResend()
  const from = getFrom()
  if (!resend || !from) {
    return {
      ok: false,
      message: "Faltan RESEND_API_KEY o EMAIL_FROM.",
    }
  }

  const site = getPublicSiteUrl()
  const signupUrl = `${site}/auth/signup?invite=${encodeURIComponent(args.inviteCode)}`
  const name =
    args.firstName.split(/\s+/)[0] ||
    args.firstName ||
    "Hola"

  const subject = "Tu acceso a Murmur está listo"
  const text = `${name},

¡Buenas noticias! Nos encantó lo que compartiste: bienvenido/a a Murmur.

Tu código de invitación es: ${args.inviteCode}

Para completar tu registro, abre este enlace (o pega el código en la página de registro):
${signupUrl}

Ahí crearás tu cuenta y contraseña como siempre. Si algo no cuadra, responde a este correo y lo vemos juntos.

Nos alegra tenerte cerca,
El equipo de Murmur`

  const html = `
<p>Hola${name !== "Hola" ? ` ${escapeHtml(name)}` : ""},</p>
<p>¡Buenas noticias! Nos encantó lo que compartiste: <strong>bienvenido/a a Murmur</strong>.</p>
<p>Tu código de invitación es: <strong>${escapeHtml(args.inviteCode)}</strong></p>
<p>Para completar tu registro, usa este enlace (o pega el código en la página de registro):<br/>
<a href="${escapeHtml(signupUrl)}">${escapeHtml(signupUrl)}</a></p>
<p>Ahí crearás tu cuenta y contraseña como siempre. Si algo no cuadra, responde a este correo y lo vemos juntos.</p>
<p>Nos alegra tenerte cerca,<br/>El equipo de Murmur</p>`

  const { error } = await resend.emails.send({
    from,
    to: args.to,
    subject,
    text,
    html,
  })

  if (error) {
    console.error("[access-request-mail] approved:", error)
    return { ok: false, message: error.message }
  }
  return { ok: true }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
