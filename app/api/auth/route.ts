import { NextRequest, NextResponse } from 'next/server'

// ============================================================
// API ROUTE: /api/payment/create-intent
// ============================================================
// TODO: Integrare Stripe per pagamenti reali
//
// 1. Installa: npm install stripe @stripe/stripe-js @stripe/react-stripe-js
// 2. Aggiungi a .env.local:
//    STRIPE_SECRET_KEY=sk_live_...
//    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
//
// Esempio implementazione:
//   import Stripe from 'stripe'
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
//
//   export async function POST(req: NextRequest) {
//     const { amount, carId, dateFrom, dateTo, customerEmail } = await req.json()
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount * 100, // in centesimi
//       currency: 'eur',
//       metadata: { carId, dateFrom, dateTo },
//       receipt_email: customerEmail,
//     })
//     return NextResponse.json({ clientSecret: paymentIntent.client_secret })
//   }
// ============================================================

export async function POST(req: NextRequest) {
  const body = await req.json()

  return NextResponse.json({
    message: 'TODO: Integrare Stripe. Vedi commenti nel file.',
    amount: body.amount,
    clientSecret: 'mock_client_secret',
  })
}
