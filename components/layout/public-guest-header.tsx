"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { safeInternalPath } from "@/lib/safe-internal-path"

export function PublicGuestHeader() {
  const pathname = usePathname()
  const returnTo = safeInternalPath(pathname, "/feed")
  const loginHref = `/auth/login?next=${encodeURIComponent(returnTo)}`
  const signupHref = `/auth/signup?next=${encodeURIComponent(returnTo)}`

  return (
    <header className="sticky top-0 z-20 border-b-[0.5px] border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md px-4 md:px-8 py-3.5">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <Logo size="md" />
        </Link>
        <nav className="flex items-center gap-2 shrink-0">
          <Link href={loginHref}>
            <Button variant="ghost" size="md">
              Iniciar sesión
            </Button>
          </Link>
          <Link href={signupHref}>
            <Button size="md">Únete</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
