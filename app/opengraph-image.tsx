import { ImageResponse } from "next/og"

export const alt = "Murmur — Construye con las personas correctas"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const BRAND_PURPLE = "#5b52d4"
const BRAND_LAVENDER = "#f0efff"
const TEXT = "#0a0a0f"
const TEXT_MUTED = "#6b6b7a"

function MurmurBirds({ width, height }: { width: number; height: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 42 Q11 30 22 36 Q11 24 3 42Z"
        fill={BRAND_PURPLE}
        opacity={0.45}
      />
      <path
        d="M16 30 Q26 16 38 23 Q26 10 16 30Z"
        fill={BRAND_PURPLE}
        opacity={0.72}
      />
      <path
        d="M32 20 Q43 6 55 13 Q43 2 32 20Z"
        fill={BRAND_PURPLE}
      />
    </svg>
  )
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(180deg, #ffffff 0%, ${BRAND_LAVENDER} 100%)`,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 220,
            height: 220,
            borderRadius: 48,
            background: BRAND_LAVENDER,
            boxShadow: "0 24px 80px rgba(91, 82, 212, 0.18)",
          }}
        >
          <MurmurBirds width={160} height={160} />
        </div>

        <div
          style={{
            marginTop: 48,
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: -2,
            color: TEXT,
          }}
        >
          murmur
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 34,
            color: TEXT_MUTED,
            fontWeight: 500,
            maxWidth: 900,
            textAlign: "center",
            lineHeight: 1.35,
          }}
        >
          Construye con las personas correctas
        </div>
      </div>
    ),
    { ...size }
  )
}
