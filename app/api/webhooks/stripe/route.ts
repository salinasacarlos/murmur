import { NextResponse } from "next/server"

import Stripe from "stripe"

import { getStripe } from "@/lib/stripe"
import { createSupabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET no configurado" },
      { status: 503 }
    )
  }

  const sig = req.headers.get("stripe-signature")
  if (!sig) {
    return NextResponse.json({ error: "Falta stripe-signature" }, { status: 400 })
  }

  const raw = await req.text()

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(raw, sig, secret)
  } catch {
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 })
  }

  let admin: ReturnType<typeof createSupabaseAdmin>
  try {
    admin = createSupabaseAdmin()
  } catch (e) {
    console.error("[stripe webhook] admin client:", e)
    return NextResponse.json(
      { error: "Supabase admin no configurado" },
      { status: 503 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== "subscription") break
        const uid =
          session.client_reference_id ?? session.metadata?.supabase_user_id
        if (uid) {
          await admin.from("profiles").update({ plan: "premium" }).eq("id", uid)
        }
        break
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        const uid = sub.metadata?.supabase_user_id
        if (!uid) break
        const active =
          sub.status === "active" || sub.status === "trialing"
        await admin
          .from("profiles")
          .update({ plan: active ? "premium" : "free" })
          .eq("id", uid)
        break
      }
      default:
        break
    }
  } catch (e) {
    console.error("[stripe webhook]", event.type, e)
    return NextResponse.json({ error: "Error al aplicar evento" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
