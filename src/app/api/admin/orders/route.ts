import { type NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { createLogger } from '@/lib/utils/logger';

const log = createLogger('api/admin/orders');

/**
 * GET /api/admin/orders  (admin-only)
 * Lists up to 50 most-recent orders for the admin dashboard. Requires a valid
 * `zy_admin` session (401 otherwise). Returns `501` when Supabase isn't
 * configured, mirroring the rest of the order API's graceful degradation.
 *
 * This is the protected replacement for the previously-public order listing.
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Order listing requires a configured database.' },
        { status: 501 },
      );
    }

    const { data, error } = await admin
      .from('orders')
      .select(
        'id, order_number, status, customer_email, customer_name, subtotal_cents, shipping_cents, total_cents, currency, created_at',
      )
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      log.error('Failed to list orders', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    return NextResponse.json({ orders: data ?? [] });
  } catch (err) {
    log.error('Unhandled error listing orders', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
