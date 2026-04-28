import * as React from "react"

import { Isotipo } from "./isotipo"
import { cn } from "@/lib/utils"

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  color?: string
  showWordmark?: boolean
}

const sizeMap = {
  sm: { iconSize: 20, fontSize: "13px" },
  md: { iconSize: 24, fontSize: "15px" },
  lg: { iconSize: 28, fontSize: "18px" },
}

export function Logo({
  size = "md",
  color = "var(--p)",
  showWordmark = true,
  className,
  ...props
}: LogoProps) {
  const { iconSize, fontSize } = sizeMap[size]
  return (
    <div
      className={cn("flex items-center gap-1.5 select-none", className)}
      {...props}
    >
      <Isotipo size={iconSize} color={color} />
      {showWordmark && (
        <span
          className="font-bold"
          style={{
            fontSize,
            letterSpacing: "-0.5px",
            color: "var(--text)",
          }}
        >
          murmur
        </span>
      )}
    </div>
  )
}
