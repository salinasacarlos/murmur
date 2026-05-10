import * as React from "react"
import Link from "next/link"

import { Card } from "@/components/ui/card"

import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <Card padding="default" className="bg-[var(--bg)] p-8">
      <h1 className="text-[18px] font-extrabold tracking-[-0.4px] mb-1">
        Bienvenido de vuelta
      </h1>
      <p className="text-[13px] text-[var(--text2)] mb-6">
        Continúa construyendo con la gente correcta.
      </p>

      <React.Suspense fallback={null}>
        <LoginForm />
      </React.Suspense>

      <p className="text-[12px] text-[var(--text2)] text-center mt-6">
        ¿No tienes cuenta?{" "}
        <Link href="/auth/signup" className="text-[var(--p)] font-semibold">
          Crear cuenta
        </Link>
      </p>
    </Card>
  )
}
