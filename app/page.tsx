import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"
import { Isotipo } from "@/components/brand/isotipo"

export default function LandingPage() {
  return (
    <div className="min-h-svh flex flex-col">
      <header className="px-6 md:px-10 py-5 flex items-center justify-between">
        <Logo size="md" />
        <nav className="flex items-center gap-2">
          <Link href="/auth/login">
            <Button variant="ghost" size="md">
              Entrar
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="primary" size="md">
              Crear cuenta
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center px-6 md:px-10">
        <div className="w-full max-w-5xl mx-auto py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
              style={{
                background: "var(--pl)",
                border: "1px solid var(--pm)",
              }}
            >
              <Isotipo size={14} color="var(--p)" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--p)]">
                Murmur · Beta
              </span>
            </div>

            <h1
              className="font-extrabold tracking-[-2.5px] mb-6"
              style={{
                fontSize: "clamp(42px, 9vw, 80px)",
                lineHeight: 0.95,
              }}
            >
              Construye con
              <br />
              las personas
              <br />
              <span style={{ color: "var(--p)" }}>correctas.</span>
            </h1>

            <p className="text-[15px] text-[var(--text2)] leading-relaxed max-w-md mb-8">
              La red donde los builders encuentran co-founders, talento,
              mentores e inversionistas. Sin azar, sin frío, con propósito.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Crear cuenta gratis
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>

            <p className="text-[11px] text-[var(--text3)] mt-6 uppercase tracking-[0.07em] font-semibold">
              Gratis · 1 búsqueda · 10 conexiones
            </p>
          </div>

          <div className="hidden md:flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="radar-ring absolute w-32 h-32 rounded-full border-2"
                style={{ borderColor: "var(--pm)" }}
              />
              <span
                className="radar-ring absolute w-32 h-32 rounded-full border-2"
                style={{ borderColor: "var(--pm)", animationDelay: "0.8s" }}
              />
              <span
                className="radar-ring absolute w-32 h-32 rounded-full border-2"
                style={{ borderColor: "var(--pm)", animationDelay: "1.6s" }}
              />
            </div>
            <Isotipo size={140} color="var(--p)" className="relative" />
          </div>
        </div>
      </main>

      <footer
        className="px-6 md:px-10 py-6 border-t-[0.5px] border-[var(--border)]"
        style={{ paddingBottom: "calc(24px + var(--sab))" }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[12px] text-[var(--text3)]">
          <Logo size="sm" />
          <p>Construye con las personas correctas.</p>
        </div>
      </footer>
    </div>
  )
}
