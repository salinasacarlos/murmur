import * as React from "react"

import { cn } from "@/lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  initials: string
  imageUrl?: string
  alt?: string
  bg?: string
  color?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  online?: boolean
  unread?: boolean
}

const sizeMap = {
  xs: { box: "w-6 h-6", text: "text-[9px]", dot: "w-1.5 h-1.5" },
  sm: { box: "w-8 h-8", text: "text-[10px]", dot: "w-2 h-2" },
  md: { box: "w-10 h-10", text: "text-xs", dot: "w-2.5 h-2.5" },
  lg: { box: "w-14 h-14", text: "text-sm", dot: "w-3 h-3" },
  xl: { box: "w-20 h-20", text: "text-lg", dot: "w-3.5 h-3.5" },
}

const palette = [
  { bg: "#f0efff", color: "#5b52d4" },
  { bg: "#e6f7f1", color: "#1a9e6e" },
  { bg: "#faeeda", color: "#854f0b" },
  { bg: "#fef2f2", color: "#e24b4a" },
  { bg: "#f0f0f4", color: "#0a0a0f" },
  { bg: "#dbeafe", color: "#1e40af" },
]

export function getAvatarColors(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  return palette[Math.abs(hash) % palette.length]
}

export function Avatar({
  initials,
  imageUrl,
  alt,
  bg,
  color,
  size = "md",
  online,
  unread,
  className,
  ...props
}: AvatarProps) {
  const colors = bg && color ? { bg, color } : getAvatarColors(initials)
  const s = sizeMap[size]

  return (
    <div
      className={cn(
        "rounded-full flex-shrink-0 flex items-center justify-center font-bold relative",
        s.box,
        s.text,
        className
      )}
      style={{ background: colors.bg, color: colors.color }}
      {...props}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={alt ?? initials}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        initials.slice(0, 2).toUpperCase()
      )}
      {(online || unread) && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-[var(--bg)]",
            s.dot
          )}
          style={{ background: unread ? "var(--p)" : "var(--g)" }}
          aria-hidden
        />
      )}
    </div>
  )
}
