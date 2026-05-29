'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatAudCents } from '@/lib/format';
import type { OrderStatus } from '@/lib/orders/types';

/** Row shape returned by GET /api/admin/orders (subset of the orders table). */
interface AdminOrderRow {
  readonly id: string;
  readonly order_number: string;
  readonly status: OrderStatus;
  readonly customer_email: string;
  readonly customer_name: string;
  readonly total_cents: number;
  readonly currency: string;
  readonly created_at: string;
}

/** Statuses an admin can set (matches the PATCH route's allow-list). */
const SETTABLE_STATUSES: readonly OrderStatus[] = ['paid', 'fulfilled', 'cancelled'];

export function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      if (res.status === 501) {
        setOrders([]);
        setError('Database not configured — no orders to show.');
        return;
      }
      if (!res.ok) {
        setError('Failed to load orders.');
        return;
      }
      const data: unknown = await res.json();
      const rows =
        typeof data === 'object' &&
        data !== null &&
        Array.isArray((data as Record<string, unknown>)['orders'])
          ? ((data as Record<string, unknown>)['orders'] as AdminOrderRow[])
          : [];
      setOrders(rows);
    } catch {
      setError('Network error loading orders.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  async function changeStatus(order: AdminOrderRow, status: OrderStatus) {
    if (status === order.status) return;
    setBusyId(order.id);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      if (!res.ok) {
        setError('Failed to update status.');
        return;
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status } : o)),
      );
    } catch {
      setError('Network error updating status.');
    } finally {
      setBusyId(null);
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => undefined);
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 600 }}>Orders</h1>
          <p style={{ margin: '2px 0 0', color: '#6b6760', fontSize: '0.875rem' }}>
            Most recent 50.
          </p>
        </div>
        <button type="button" onClick={() => void logout()} style={secondaryButton}>
          Log out
        </button>
      </header>

      {error ? (
        <p style={{ color: '#b42318', fontSize: '0.875rem' }}>{error}</p>
      ) : null}

      {loading ? (
        <p style={{ color: '#6b6760' }}>Loading…</p>
      ) : orders.length === 0 ? (
        <p style={{ color: '#6b6760' }}>No orders yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr>
                <th style={th}>Order</th>
                <th style={th}>Customer</th>
                <th style={{ ...th, textAlign: 'right' }}>Total</th>
                <th style={th}>Status</th>
                <th style={th}>Set status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={td}>
                    <span style={{ fontWeight: 600 }}>{order.order_number}</span>
                  </td>
                  <td style={td}>
                    <div>{order.customer_name}</div>
                    <div style={{ color: '#6b6760', fontSize: '0.8125rem' }}>
                      {order.customer_email}
                    </div>
                  </td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    {formatAudCents(order.total_cents)}
                  </td>
                  <td style={td}>
                    <StatusBadge status={order.status} />
                  </td>
                  <td style={td}>
                    <select
                      value={
                        SETTABLE_STATUSES.includes(order.status) ? order.status : ''
                      }
                      disabled={busyId === order.id}
                      onChange={(e) =>
                        void changeStatus(order, e.target.value as OrderStatus)
                      }
                      style={selectStyle}
                    >
                      <option value="" disabled>
                        Change…
                      </option>
                      {SETTABLE_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const palette: Record<OrderStatus, { bg: string; fg: string }> = {
    pending_payment: { bg: '#fef3c7', fg: '#92400e' },
    paid: { bg: '#dbeafe', fg: '#1e40af' },
    fulfilled: { bg: '#dcfce7', fg: '#166534' },
    cancelled: { bg: '#fee2e2', fg: '#991b1b' },
  };
  const c = palette[status];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 999,
        background: c.bg,
        color: c.fg,
        fontSize: '0.75rem',
        fontWeight: 600,
      }}
    >
      {status.replace('_', ' ')}
    </span>
  );
}

const th: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.5rem 0.75rem',
  borderBottom: '1px solid #e6e3dd',
  color: '#6b6760',
  fontWeight: 600,
  whiteSpace: 'nowrap',
};

const td: React.CSSProperties = {
  padding: '0.625rem 0.75rem',
  borderBottom: '1px solid #f0eee9',
  verticalAlign: 'top',
};

const selectStyle: React.CSSProperties = {
  padding: '0.25rem 0.5rem',
  border: '1px solid #d6d2ca',
  borderRadius: 6,
  fontSize: '0.8125rem',
};

const secondaryButton: React.CSSProperties = {
  padding: '0.5rem 0.875rem',
  border: '1px solid #d6d2ca',
  borderRadius: 8,
  background: '#fff',
  fontSize: '0.875rem',
  fontWeight: 500,
  cursor: 'pointer',
};
