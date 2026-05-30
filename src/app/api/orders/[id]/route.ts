import { type NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { createLogger } from '@/lib/utils/logger';

const log = createLogger('api/orders/[id]');

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * GET /api/orders/[id]
 * `id` may be either the order UUID or the human order_number (e.g. ZY-XXXX).
 * 404 when missing or when the DB isn't configured.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    const column = UUID_RE.test(id) ? 'id' : 'order_number';

    const { data: order, error } = await admin
      .from('orders')
      .select(
        'id, order_number, status, customer_email, customer_name, ship_line1, ship_line2, ship_suburb, ship_state, ship_postcode, ship_country, subtotal_cents, shipping_cents, total_cents, currency, created_at, updated_at',
      )
      .eq(column, id)
      .maybeSingle();

    if (error) {
      log.error('Failed to fetch order', id, error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    const { data: items, error: itemsError } = await admin
      .from('order_items')
      .select('sku, name, colourway, unit_price_cents, quantity, line_total_cents')
      .eq('order_id', order.id);

    if (itemsError) {
      log.error('Failed to fetch order items', id, itemsError);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    return NextResponse.json({ order: { ...order, items: items ?? [] } });
  } catch (err) {
    log.error('Unhandled error fetching order', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
