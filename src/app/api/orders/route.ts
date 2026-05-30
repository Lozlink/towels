import { type NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/orders/create';
import { parseCreateOrderInput } from '@/lib/orders/validate';
import { createLogger } from '@/lib/utils/logger';

const log = createLogger('api/orders');

/**
 * POST /api/orders
 * Body: { lines: [{ sku, colourway, quantity }], customer: { email, name, shippingAddress } }
 * Totals are computed server-side from the catalogue — client-sent prices are
 * ignored. Persists to Supabase when configured; otherwise returns the computed
 * order with persisted:false so the flow still works in dev.
 */
export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const parsed = parseCreateOrderInput(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await createOrder(parsed.value);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, details: result.details },
        { status: result.status },
      );
    }

    return NextResponse.json(
      { success: true, order: result.order },
      { status: 201 },
    );
  } catch (err) {
    log.error('Unhandled error creating order', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/orders
 * Order *listing* is no longer public — it leaked every customer's details.
 * The protected, admin-only listing now lives at `GET /api/admin/orders`
 * (guarded by the `zy_admin` session). This handler returns 404 so the old
 * public surface no longer exists. Guest checkout (POST) is unchanged.
 */
export function GET() {
  return NextResponse.json({ error: 'Not found.' }, { status: 404 });
}
