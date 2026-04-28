import * as React from "react"

import { cn } from "@/lib/utils"

type TagVariant =
  | "brand"
  | "amber"
  | "green"
  | "neutral"
  | "success"
  | "paused"

const variantClass: Record<TagVariant, string> = {
  brand: "ds-tag-brand",
  amber: "ds-tag-amber",
  green: "ds-tag-green",
  neutral: "ds-tag-neutral",
  success: "ds-tag-success",
  paused: "ds-tag-paused",
}

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant
}

export function Tag({ variant = "neutral", className, ...props }: TagProps) {
  return (
    <span className={cn("ds-tag", variantClass[variant], className)} {...props} />
  )
}
