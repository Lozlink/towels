import { type NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import type { OrderStatus } from '@/lib/orders/types';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { createLogger } from '@/lib/utils/logger';

const log = createLogger('api/admin/orders/[id]');

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Statuses an admin may set by hand. `pending_payment` is the system-assigned
 * initial state and is intentionally NOT settable here.
 */
const SETTABLE_STATUSES = ['paid', 'fulfilled', 'cancelled'] as const;
type SettableStatus = (typeof SETTABLE_STATUSES)[number];

function isSettableStatus(value: unknown): value is SettableStatus {
  return (
    typeof value === 'string' &&
    (SETTABLE_STATUSES as readonly string[]).includes(value)
  );
}

/**
 * PATCH /api/admin/orders/[id]  (admin-only)
 * Body: { status: 'paid' | 'fulfilled' | 'cancelled' }
 * `id` may be the order UUID or the human order_number (e.g. SM-XXXX).
 * Updates the order status and returns the updated row. 401 without a session,
 * 400 on a bad status, 404 if the order doesn't exist, 501 if DB unconfigured.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const status = (body as Record<string, unknown> | null)?.['status'];
    if (!isSettableStatus(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${SETTABLE_STATUSES.join(', ')}.` },
        { status: 400 },
      );
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Order updates require a configured database.' },
        { status: 501 },
      );
    }

    const column = UUID_RE.test(id) ? 'id' : 'order_number';
    // Widen to OrderStatus for the write — SettableStatus is a subset.
    const nextStatus: OrderStatus = status;

    const { data, error } = await admin
      .from('orders')
      .update({ status: nextStatus })
      .eq(column, id)
      .select(
        'id, order_number, status, customer_email, customer_name, subtotal_cents, shipping_cents, total_cents, currency, created_at, updated_at',
      )
      .maybeSingle();

    if (error) {
      log.error('Failed to update order status', id, error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    log.log('Order', id, 'status ->', nextStatus, 'by', auth.session.username);
    return NextResponse.json({ success: true, order: data });
  } catch (err) {
    log.error('Unhandled error updating order', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
