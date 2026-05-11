import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import {
  TERMS_DISCLAIMER,
  TERMS_LAST_UPDATED,
  TERMS_SECTIONS,
} from "@/lib/terms-generic-content"

export default function TermsPage() {
  return (
    <div className="min-h-svh bg-[var(--bg)] text-[var(--text)] px-4 md:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1
          className="font-extrabold tracking-[-0.5px] mb-2"
          style={{ fontSize: "clamp(22px, 4vw, 32px)", lineHeight: 1.15 }}
        >
          Términos y condiciones
        </h1>
        <p className="text-[12px] text-[var(--text3)] mb-10">
          Actualizado el {TERMS_LAST_UPDATED}
        </p>
        <div className="space-y-8 text-[13px] text-[var(--text2)] leading-relaxed">
          {TERMS_SECTIONS.map((s) => (
            <div key={s.id}>
              <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">
                {s.title}
              </h2>
              {s.paragraphs.map((p, i) => (
                <p key={`${s.id}-${i}`} className="mb-3 last:mb-0">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[var(--text3)] mt-10 pt-10 border-t-[0.5px] border-[var(--border)] leading-relaxed">
          {TERMS_DISCLAIMER}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className={buttonVariants({ variant: "secondary" })}>
            Volver al inicio
          </Link>
          <Link
            href="/#terminos"
            className={buttonVariants({ variant: "ghost" })}
          >
            Ver en landing
          </Link>
        </div>
      </div>
    </div>
  )
}
