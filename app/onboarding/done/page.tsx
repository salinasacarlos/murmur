import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Isotipo } from "@/components/brand/isotipo"

export default function OnboardingDonePage() {
  return (
    <Card padding="none" className="bg-[var(--bg)] p-8 text-center">
      <div className="flex justify-center mb-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "var(--pl)",
            border: "1px solid var(--pm)",
          }}
        >
          <Isotipo size={48} color="var(--p)" />
        </div>
      </div>

      <h1 className="text-[22px] font-extrabold tracking-[-0.4px] mb-2">
        Tu perfil está listo
      </h1>
      <p className="text-[13px] text-[var(--text2)] leading-relaxed mb-6">
        Crea tu primera búsqueda para empezar a recibir matches. Recuerda que
        estás oculto hasta que decidas activarte.
      </p>

      <div className="flex flex-col gap-2">
        <Link href="/searches/new">
          <Button size="lg" className="w-full justify-center">
            Crear mi primera búsqueda
          </Button>
        </Link>
        <Link href="/feed">
          <Button variant="secondary" size="lg" className="w-full justify-center">
            Ir al feed
          </Button>
        </Link>
      </div>
    </Card>
  )
}
