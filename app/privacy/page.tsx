import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="min-h-svh bg-[var(--bg)] text-[var(--text)] px-4 md:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-[24px] font-extrabold mb-4">Privacidad</h1>
        <p className="text-[14px] text-[var(--text2)] leading-relaxed mb-8">
          Estamos preparando la política de privacidad completa. Mientras tanto,
          solo recopilamos los datos necesarios para crear tu perfil, búsquedas y
          conexiones en Murmur (según lo que nos indiques en la app). No vendemos
          tu información personal a terceros.
        </p>
        <Link
          href="/"
          className={buttonVariants({ variant: "secondary" })}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
