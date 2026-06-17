import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"

/** Cabecera mínima para visitantes sin sesión (vista pública compartible). */
export function PublicGuestChrome({
  children,
  showAuthActions = true,
}: {
  children: React.ReactNode
  showAuthActions?: boolean
}) {
  return (
    <div className="min-h-svh flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-20 border-b-[0.5px] border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md px-4 md:px-8 py-3.5">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <Logo size="md" />
          </Link>
          {showAuthActions ? (
            <nav className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="md">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="md">Únete</Button>
              </Link>
            </nav>
          ) : null}
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
