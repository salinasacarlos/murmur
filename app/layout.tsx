import type { Metadata, Viewport } from "next"
import { Geist_Mono, Raleway } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { VisibilityProvider } from "@/components/providers/visibility-provider"
import { CANONICAL_SITE_ORIGIN } from "@/lib/site"
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
} from "@/lib/site-metadata"
import { cn } from "@/lib/utils"

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? CANONICAL_SITE_ORIGIN
  ),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn(raleway.variable, geistMono.variable, "antialiased")}
    >
      <body>
        <ThemeProvider>
          <VisibilityProvider>{children}</VisibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
