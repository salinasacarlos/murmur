import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "rounded-lg font-semibold whitespace-nowrap select-none",
    "transition-all outline-none",
    "focus-visible:ring-2 focus-visible:ring-[var(--p)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] hover:opacity-85",
        secondary:
          "bg-transparent text-[var(--text2)] border border-[var(--border)] hover:border-[var(--border2)] hover:text-[var(--text)]",
        brand:
          "bg-[var(--pl)] text-[var(--p)] border border-[var(--pm)] hover:bg-[#e0deff]",
        ghost:
          "bg-transparent text-[var(--text2)] hover:bg-[var(--bg2)] hover:text-[var(--text)]",
        destructive:
          "bg-[var(--red-bg)] text-[var(--red)] border border-[var(--red)]/30 hover:bg-[var(--red)] hover:text-white",
        link: "text-[var(--p)] underline-offset-4 hover:underline px-0",
      },
      size: {
        lg: "px-4 py-[9px] text-[13px]",
        md: "px-4 py-[7px] text-[12px]",
        sm: "px-3 py-[5px] text-[11px]",
        icon: "p-2 text-[12px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
