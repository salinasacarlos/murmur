import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-svh bg-[var(--bg)] text-[var(--text)] px-4 md:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-[24px] font-extrabold mb-4">Términos</h1>
        <p className="text-[14px] text-[var(--text2)] leading-relaxed mb-8">
          Estamos preparando los términos de uso completos. El uso de Murmur
          implica respetar a otras personas en la red: sin acoso, sin spam y sin
          suplantación. Las suscripciones y pagos se procesan a través de Stripe
          según sus condiciones.
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
