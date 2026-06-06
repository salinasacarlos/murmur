import * as React from "react"
import Link from "next/link"

import { Card } from "@/components/ui/card"

import { ForgotPasswordForm } from "./forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <Card padding="default" className="bg-[var(--bg)] p-8">
      <h1 className="text-[18px] font-extrabold tracking-[-0.4px] mb-1">
        Recuperar contraseña
      </h1>
      <p className="text-[13px] text-[var(--text2)] mb-6">
        Te enviamos un enlace al correo con el que te registraste.
      </p>

      <React.Suspense fallback={null}>
        <ForgotPasswordForm />
      </React.Suspense>

      <p className="text-[12px] text-[var(--text2)] text-center mt-6">
        <Link href="/auth/login" className="text-[var(--p)] font-semibold">
          Volver a entrar
        </Link>
      </p>
    </Card>
  )
}
