import * as React from "react"

import { IconEye, IconEyeOff } from "@/components/icons"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn("ds-input", className)}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export type PasswordInputProps = Omit<InputProps, "type">

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="relative w-full">
      <Input
        type={visible ? "text" : "password"}
        className={cn("pr-11", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[var(--text2)] transition-colors hover:bg-[var(--bg2)] hover:text-[var(--text)]"
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-pressed={visible}
      >
        {visible ? <IconEyeOff size={18} /> : <IconEye size={18} />}
      </button>
    </div>
  )
}

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 3, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn("ds-input", className)}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export interface FieldProps {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-[12px] font-medium text-[var(--text2)]">
          {label}
          {required && <span className="text-[var(--red)] ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-[11px] text-[var(--text3)]">{hint}</p>
      )}
      {error && <p className="text-[11px] text-[var(--red)]">{error}</p>}
    </div>
  )
}
