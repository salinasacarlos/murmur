import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Field, Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function SignupPage() {
  return (
    <Card padding="default" className="bg-[var(--bg)] p-8">
      <h1 className="text-[18px] font-extrabold tracking-[-0.4px] mb-1">
        Crea tu cuenta
      </h1>
      <p className="text-[13px] text-[var(--text2)] mb-6">
        Empieza a construir con las personas correctas.
      </p>

      <div className="flex flex-col gap-2 mb-5">
        <Button variant="secondary" size="lg" className="justify-center">
          Continuar con Google
        </Button>
        <Button variant="secondary" size="lg" className="justify-center">
          Continuar con LinkedIn
        </Button>
      </div>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-[10px] uppercase tracking-[0.07em] font-semibold text-[var(--text3)]">
          o con email
        </span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      <form className="flex flex-col gap-3" action="/onboarding/role">
        <Field label="Email">
          <Input type="email" placeholder="tu@email.com" required />
        </Field>
        <Field
          label="Contraseña"
          hint="Mínimo 8 caracteres con número y mayúscula"
        >
          <Input type="password" placeholder="••••••••" required />
        </Field>

        <Button type="submit" size="lg" className="mt-2 justify-center">
          Crear cuenta
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
