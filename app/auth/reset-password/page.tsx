import * as React from "react"
import Link from "next/link"

import { Card } from "@/components/ui/card"

import { ResetPasswordForm } from "./reset-password-form"

export default function ResetPasswordPage() {
  return (
    <Card padding="default" className="bg-[var(--bg)] p-8">
      <h1 className="text-[18px] font-extrabold tracking-[-0.4px] mb-1">
        Nueva contraseña
      </h1>
      <p className="text-[13px] text-[var(--text2)] mb-6">
        Elige una contraseña segura para tu cuenta.
      </p>

      <React.Suspense fallback={null}>
        <ResetPasswordForm />
      </React.Suspense>

      <p className="text-[12px] text-[var(--text2)] text-center mt-6">
        <Link href="/auth/login" className="text-[var(--p)] font-semibold">
          Volver a entrar
        </Link>
      </p>
    </Card>
  )
}
