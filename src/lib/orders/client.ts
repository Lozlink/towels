import type { CartLineInput, Customer, Order } from './types';

/** Shape of a successful POST /api/orders response. */
interface CreateOrderResponse {
  readonly success: true;
  readonly order: Order;
}

export interface SubmitOrderArgs {
  readonly lines: readonly CartLineInput[];
  readonly customer: Customer;
}

export type SubmitOrderOutcome =
  | { readonly ok: true; readonly order: Order }
  | { readonly ok: false; readonly error: string };

function isCreateOrderResponse(value: unknown): value is CreateOrderResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    (value as { success: unknown }).success === true &&
    'order' in value
  );
}

/**
 * POST the cart lines + customer to the order API. The server re-derives all
 * money; the client never sends prices. Returns the authoritative order on
 * success.
 */
export async function submitOrder(
  args: SubmitOrderArgs,
): Promise<SubmitOrderOutcome> {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });

    const payload: unknown = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        payload &&
        typeof payload === 'object' &&
        'error' in payload &&
        typeof (payload as { error: unknown }).error === 'string'
          ? (payload as { error: string }).error
          : `Order failed (${res.status}).`;
      return { ok: false, error: message };
    }

    if (!isCreateOrderResponse(payload)) {
      return { ok: false, error: 'Unexpected response from the order API.' };
    }

    return { ok: true, order: payload.order };
  } catch {
    return {
      ok: false,
      error: 'Could not reach the order service. Please try again.',
    };
  }
}
