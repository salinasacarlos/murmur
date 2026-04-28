import * as React from "react"

export interface IsotipoProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number
  color?: string
}

export function Isotipo({
  size = 24,
  color = "currentColor",
  ...props
}: IsotipoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <path
        className="murmur-wing murmur-wing-1"
        d="M3 42 Q11 30 22 36 Q11 24 3 42Z"
        fill={color}
        opacity="0.45"
      />
      <path
        className="murmur-wing murmur-wing-2"
        d="M16 30 Q26 16 38 23 Q26 10 16 30Z"
        fill={color}
        opacity="0.72"
      />
      <path
        className="murmur-wing murmur-wing-3"
        d="M32 20 Q43 6 55 13 Q43 2 32 20Z"
        fill={color}
      />
    </svg>
  )
}
