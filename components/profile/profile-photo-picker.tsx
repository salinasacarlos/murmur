"use client"

import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProfilePhotoPickerProps {
  value?: string
  initials: string
  name: string
  onChange: (value: string | undefined) => void
}

export function ProfilePhotoPicker({
  value,
  initials,
  name,
  onChange,
}: ProfilePhotoPickerProps) {
  const inputId = React.useId()

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) return
    if (!file.type.startsWith("image/")) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Avatar
          initials={initials}
          imageUrl={value}
          alt={`Foto de ${name}`}
          size="xl"
          className="mx-auto sm:mx-0"
        />

        <div className="flex-1 text-center sm:text-left">
          <p className="text-[13px] font-semibold text-[var(--text)]">
            Foto de perfil
          </p>
          <p className="mt-0.5 text-[12px] text-[var(--text2)]">
            Sube una imagen cuadrada o vertical. Se ajustará automáticamente.
          </p>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              id={inputId}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onFileChange}
            />
            <label
              htmlFor={inputId}
              className={cn(
                "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-4 py-[7px]",
                "select-none whitespace-nowrap text-[12px] font-semibold transition-all hover:opacity-85",
                "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)]"
              )}
            >
              {value ? "Cambiar foto" : "Agregar foto"}
            </label>
            {value && (
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="justify-center"
                onClick={() => onChange(undefined)}
              >
                Eliminar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
