import * as React from "react"
import Link from "next/link"

import { Logo } from "@/components/brand/logo"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-svh flex flex-col bg-[var(--bg2)]"
      style={{ paddingTop: "var(--sat)", paddingBottom: "var(--sab)" }}
    >
      <header className="px-6 md:px-10 py-5 flex items-center justify-between">
        <Link href="/">
          <Logo size="md" />
        </Link>
        <span className="text-[11px] uppercase tracking-[0.07em] font-semibold text-[var(--text3)]">
          Onboarding
        </span>
      </header>
      <main className="flex-1 flex items-start md:items-center justify-center px-4 py-6">
        <div className="w-full max-w-[520px]">{children}</div>
      </main>
    </div>
  )
}
