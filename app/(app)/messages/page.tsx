import { Isotipo } from "@/components/brand/isotipo"

export default function MessagesIndexPage() {
  return (
    <div className="hidden md:flex flex-col items-center justify-center text-center px-6 h-full">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ background: "var(--pl)", border: "1px solid var(--pm)" }}
      >
        <Isotipo size={32} color="var(--p)" />
      </div>
      <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-1">
        Selecciona una conversación
      </h2>
      <p className="text-[12px] text-[var(--text2)] max-w-xs">
        Elige un chat de la izquierda. Recuerda: solo puedes chatear con conexiones aceptadas.
      </p>
    </div>
  )
}
