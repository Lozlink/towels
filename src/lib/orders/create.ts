import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { createLogger } from '@/lib/utils/logger';
import { priceOrder } from './pricing';
import type { CreateOrderInput, Order, OrderStatus } from './types';

const log = createLogger('orders');

const INITIAL_STATUS: OrderStatus = 'pending_payment';

/** Generate a human-friendly order number: ZY- + base36 timestamp + short random. */
export function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ZY-${ts}-${rand}`;
}

export type CreateOrderResult =
  | { readonly ok: true; readonly order: Order }
  | {
      readonly ok: false;
      readonly status: number;
      readonly error: string;
      readonly details?: unknown;
    };

/**
 * Price the order server-side from the catalogue, then persist it to Supabase
 * when configured. When the DB isn't configured the order is still returned
 * (with `persisted: false`) so the checkout flow works end-to-end in dev.
 */
export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const priced = priceOrder(input.lines);
  if (!priced.ok || !priced.order) {
    return {
      ok: false,
      status: 422,
      error: 'One or more line items are invalid.',
      details: priced.errors,
    };
  }

  const orderNumber = generateOrderNumber();
  const { items, subtotalCents, shippingCents, totalCents, currency } =
    priced.order;

  const admin = getSupabaseAdmin();
  if (!admin) {
    log.warn(
      'Supabase not configured — returning computed order without persisting',
      orderNumber,
    );
    return {
      ok: true,
      order: {
        orderNumber,
        status: INITIAL_STATUS,
        customer: input.customer,
        items,
        subtotalCents,
        shippingCents,
        totalCents,
        currency,
        persisted: false,
      },
    };
  }

  const address = input.customer.shippingAddress;

  const { data: orderRow, error: orderError } = await admin
    .from('orders')
    .insert({
      order_number: orderNumber,
      status: INITIAL_STATUS,
      customer_email: input.customer.email,
      customer_name: input.customer.name,
      ship_line1: address.line1,
      ship_line2: address.line2 ?? null,
      ship_suburb: address.suburb,
      ship_state: address.state,
      ship_postcode: address.postcode,
      ship_country: address.country,
      subtotal_cents: subtotalCents,
      shipping_cents: shippingCents,
      total_cents: totalCents,
      currency,
    })
    .select('id, created_at')
    .single();

  if (orderError || !orderRow) {
    log.error('Failed to insert order', orderNumber, orderError);
    return { ok: false, status: 500, error: 'Internal server error' };
  }

  const orderId = orderRow.id as string;

  const { error: itemsError } = await admin.from('order_items').insert(
    items.map((item) => ({
      order_id: orderId,
      sku: item.sku,
      name: item.name,
      colourway: item.colourway,
      unit_price_cents: item.unitPriceCents,
      quantity: item.quantity,
      line_total_cents: item.lineTotalCents,
    })),
  );

  if (itemsError) {
    log.error('Failed to insert order items, rolling back order', orderNumber, itemsError);
    // Best-effort cleanup so we don't leave a headerless order behind.
    await admin.from('orders').delete().eq('id', orderId);
    return { ok: false, status: 500, error: 'Internal server error' };
  }

  log.log('Persisted order', orderNumber, orderId);

  return {
    ok: true,
    order: {
      id: orderId,
      orderNumber,
      status: INITIAL_STATUS,
      customer: input.customer,
      items,
      subtotalCents,
      shippingCents,
      totalCents,
      currency,
      createdAt:
        typeof orderRow.created_at === 'string' ? orderRow.created_at : undefined,
      persisted: true,
    },
  };
}
