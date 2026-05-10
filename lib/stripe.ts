import Stripe from "stripe"

let stripe: Stripe | null = null

export function getStripeOptional(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) return null
  if (!stripe) {
    stripe = new Stripe(key, {
      typescript: true,
    })
  }
  return stripe
}

export function getStripe(): Stripe {
  const s = getStripeOptional()
  if (!s) {
    throw new Error(
      "STRIPE_SECRET_KEY no está definida. Añádela en .env.local o Vercel."
    )
  }
  return s
}
