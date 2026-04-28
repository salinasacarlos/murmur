import * as React from "react"

import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  interactive?: boolean
  padding?: "none" | "tight" | "default" | "page"
}

const paddingMap = {
  none: "",
  tight: "p-[10px_14px]",
  default: "p-[16px_20px]",
  page: "p-[20px_24px]",
}

export function Card({
  className,
  active,
  interactive,
  padding = "default",
  ...props
}: CardProps) {
  return (
    <div
      data-active={active ? "true" : "false"}
      className={cn(
        "ds-card",
        paddingMap[padding],
        interactive && "cursor-pointer",
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)} {...props} />
  )
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-[14px] font-bold text-[var(--text)] tracking-[-0.2px]",
        className
      )}
      {...props}
    />
  )
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-[12px] text-[var(--text2)] leading-relaxed", className)}
      {...props}
    />
  )
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between gap-2 mt-3", className)}
      {...props}
    />
  )
}
