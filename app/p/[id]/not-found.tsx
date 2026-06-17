import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function PublicProfileNotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <h1 className="text-[20px] font-bold mb-2">Perfil no disponible</h1>
      <p className="text-[14px] text-[var(--text2)] mb-6 leading-relaxed">
        Este perfil no existe o no está visible en Murmur.
      </p>
      <Link href="/">
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  )
}
