"use client"

import * as React from "react"

import { Card } from "@/components/ui/card"
import { Drawer, DrawerHeader } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { IconEdit } from "@/components/icons"

interface ProfileSectionProps {
  title: string
  children: React.ReactNode
  editTitle: string
  editDescription?: string
  editContent?: React.ReactNode
  onSave?: () => void | Promise<void>
  saving?: boolean
}

export function ProfileSection({
  title,
  children,
  editTitle,
  editDescription,
  editContent,
  onSave,
  saving,
}: ProfileSectionProps) {
  const [open, setOpen] = React.useState(false)

  async function handleSave() {
    if (onSave) {
      await onSave()
    }
    setOpen(false)
  }

  return (
    <Card padding="default" className="ds-fade-up">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="ds-label-uppercase">{title}</h3>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-[var(--text3)] hover:text-[var(--p)] p-1 -m-1"
          aria-label={`Editar ${title}`}
        >
          <IconEdit size={14} />
        </button>
      </div>
      <div>{children}</div>

      <Drawer open={open} onOpenChange={setOpen} ariaLabel={editTitle}>
        <DrawerHeader title={editTitle} description={editDescription} />
        <div className="flex flex-col gap-3 mb-4">
          {editContent ?? (
            <p className="text-[12px] text-[var(--text2)]">
              Los campos editables se conectarán al backend más adelante.
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 justify-center"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            className="flex-1 justify-center"
            disabled={saving}
            onClick={() => void handleSave()}
          >
            {saving ? "Guardando..." : onSave ? "Guardar" : "Cerrar"}
          </Button>
        </div>
      </Drawer>
    </Card>
  )
}
