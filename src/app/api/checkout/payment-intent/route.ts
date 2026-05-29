import { type NextRequest, NextResponse } from 'next/server';
import { priceOrder } from '@/lib/orders/pricing';
import { parseLinesOnly } from '@/lib/orders/validate';
import { createLogger } from '@/lib/utils/logger';

const log = createLogger('api/checkout/payment-intent');

/**
 * POST /api/checkout/payment-intent
 * Body: { lines: [{ sku, colourway, quantity }] }
 *
 * Lazy + optional: Stripe is only imported and instantiated when
 * STRIPE_SECRET_KEY is present; otherwise 503 "Payments not configured", so the
 * project builds with no keys. The charge amount is computed server-side via
 * priceOrder — never taken from the client.
 */
export async function POST(request: NextRequest) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: 'Payments not configured' },
        { status: 503 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const parsed = parseLinesOnly(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const priced = priceOrder(parsed.value);
    if (!priced.ok || !priced.order) {
      return NextResponse.json(
        { error: 'One or more line items are invalid.', details: priced.errors },
        { status: 422 },
      );
    }

    // Lazy import keeps `stripe` out of the build graph when unused.
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(secret);

    const intent = await stripe.paymentIntents.create({
      amount: priced.order.totalCents,
      currency: priced.order.currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: intent.client_secret,
      amountCents: priced.order.totalCents,
      currency: priced.order.currency,
    });
  } catch (err) {
    log.error('Failed to create payment intent', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
