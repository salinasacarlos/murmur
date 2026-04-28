import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Field, Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <Card padding="default" className="bg-[var(--bg)] p-8">
      <h1 className="text-[18px] font-extrabold tracking-[-0.4px] mb-1">
        Bienvenido de vuelta
      </h1>
      <p className="text-[13px] text-[var(--text2)] mb-6">
        Continúa construyendo con la gente correcta.
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

      <form className="flex flex-col gap-3" action="/feed">
        <Field label="Email">
          <Input type="email" placeholder="tu@email.com" required />
        </Field>
        <Field label="Contraseña">
          <Input type="password" placeholder="••••••••" required />
        </Field>

        <Button type="submit" size="lg" className="mt-2 justify-center">
          Entrar
        </Button>
      </form>

      <p className="text-[12px] text-[var(--text2)] text-center mt-6">
        ¿No tienes cuenta?{" "}
        <Link href="/auth/signup" className="text-[var(--p)] font-semibold">
          Crear cuenta
        </Link>
      </p>
    </Card>
  )
}
