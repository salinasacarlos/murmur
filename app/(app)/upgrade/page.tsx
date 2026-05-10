import { Suspense } from "react"

import { UpgradeClient } from "./upgrade-client"

export default function UpgradePage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-10 text-[13px] text-[var(--text2)]">
          Cargando…
        </div>
      }
    >
      <UpgradeClient />
    </Suspense>
  )
}
