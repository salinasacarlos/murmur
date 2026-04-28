import * as React from "react"
import Link from "next/link"

import { Logo } from "@/components/brand/logo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh flex flex-col bg-[var(--bg2)]">
      <header className="px-6 md:px-10 py-5">
        <Link href="/">
          <Logo size="md" />
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[400px]">{children}</div>
      </main>
    </div>
  )
}
