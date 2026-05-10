import { NextResponse } from "next/server"

import { getStripeOptional } from "@/lib/stripe"
import { CANONICAL_SITE_ORIGIN } from "@/lib/site"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const stripe = getStripeOptional()
  if (!stripe) {
    return NextResponse.json(
      { error: "Pagos no configurados (falta STRIPE_SECRET_KEY)." },
      { status: 503 }
    )
  }

  let body: { interval?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const interval = body.interval === "year" ? "year" : "week"
  const priceId =
    interval === "year"
      ? process.env.STRIPE_PRICE_PREMIUM_ANNUAL?.trim()
      : process.env.STRIPE_PRICE_PREMIUM_WEEKLY?.trim()

  if (!priceId) {
    return NextResponse.json(
      {
        error:
          "Falta STRIPE_PRICE_PREMIUM_WEEKLY o STRIPE_PRICE_PREMIUM_ANNUAL en el servidor.",
      },
      { status: 503 }
    )
  }

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const origin =
    req.headers.get("origin")?.replace(/\/+$/, "") ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    (process.env.NODE_ENV === "production"
      ? CANONICAL_SITE_ORIGIN
      : "http://localhost:3000")

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/upgrade?success=1`,
    cancel_url: `${origin}/upgrade?canceled=1`,
    client_reference_id: user.id,
    customer_email: user.email ?? undefined,
    metadata: { supabase_user_id: user.id },
    subscription_data: {
      metadata: { supabase_user_id: user.id },
    },
  })

  if (!session.url) {
    return NextResponse.json(
      { error: "Stripe no devolvió URL de checkout" },
      { status: 500 }
    )
  }
  return NextResponse.json({ url: session.url })
}
