import { Suspense } from "react"

import { Card } from "@/components/ui/card"
import { ConnectionsClient } from "./connections-client"

export default function ConnectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 md:px-6 py-5 md:py-6 max-w-[820px] mx-auto w-full">
          <Card padding="default" className="text-center py-10">
            <p className="text-[12px] text-[var(--text2)]">Cargando…</p>
          </Card>
        </div>
      }
    >
      <ConnectionsClient />
    </Suspense>
  )
}
