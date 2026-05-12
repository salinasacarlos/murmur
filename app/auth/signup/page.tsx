import * as React from "react"
import Link from "next/link"

import { Card } from "@/components/ui/card"

import { SignupForm } from "./signup-form"

export default function SignupPage() {
  return (
    <Card padding="default" className="bg-[var(--bg)] p-8">
      <h1 className="text-[18px] font-extrabold tracking-[-0.4px] mb-1">
        Crea tu cuenta
      </h1>
      <p className="text-[13px] text-[var(--text2)] mb-6">
        Murmur es solo con invitación. Pega tu código o abre el enlace que te
        compartieron.
      </p>

      <React.Suspense fallback={<p className="text-[13px] text-[var(--text2)]">Cargando…</p>}>
        <SignupForm />
      </React.Suspense>

      <p className="text-[12px] text-[var(--text2)] text-center mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="text-[var(--p)] font-semibold">
          Entrar
        </Link>
      </p>
    </Card>
  )
}
