import * as React from "react"

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
