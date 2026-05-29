import { COLOURWAYS, type ColourwayId } from '@/lib/colourways';
import { toCents } from '@/lib/format';
import { getProductBySku } from '@/lib/products';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/site';
import type { CartLineInput, OrderItem } from './types';

/** Quantity is clamped to this range, regardless of what the client sends. */
export const MIN_QTY = 1;
export const MAX_QTY = 99;

/** Flat AU shipping when under the free-shipping threshold, in cents. */
export const FLAT_SHIPPING_CENTS = 995; // AU$9.95
/** Free-shipping threshold in cents, derived from the shared site constant. */
export const FREE_SHIPPING_THRESHOLD_CENTS = toCents(FREE_SHIPPING_THRESHOLD);

export interface PricingError {
  /** Index of the offending line in the submitted array. */
  readonly index: number;
  readonly sku: string;
  readonly reason:
    | 'unknown_sku'
    | 'unknown_colourway'
    | 'invalid_quantity'
    | 'non_integer_quantity';
  readonly message: string;
}

export interface PricedOrder {
  readonly items: readonly OrderItem[];
  readonly subtotalCents: number;
  readonly shippingCents: number;
  readonly totalCents: number;
  readonly currency: 'AUD';
}

export interface PriceOrderResult {
  readonly ok: boolean;
  readonly order: PricedOrder | null;
  readonly errors: readonly PricingError[];
}

function isColourwayId(value: string): value is ColourwayId {
  return Object.prototype.hasOwnProperty.call(COLOURWAYS, value);
}

/**
 * Re-derive every cent of the order on the server from the product catalogue.
 *
 * The client may only submit `{ sku, colourway, quantity }`. Prices and totals
 * are NEVER taken from the client — this mirrors the owner's hard rule that the
 * locked catalogue price is the single source of truth.
 *
 * Rules:
 *  - sku must exist in the catalogue (else `unknown_sku`)
 *  - colourway must be one of the four shared colourways (else `unknown_colourway`)
 *  - quantity must be an integer clamped to MIN_QTY..MAX_QTY
 *  - per-line subtotal = unit price (cents) × quantity
 *  - order subtotal = Σ line subtotals
 *  - shipping: FREE at/over AU$99, else flat AU$9.95
 *  - total = subtotal + shipping
 */
export function priceOrder(lines: readonly CartLineInput[]): PriceOrderResult {
  const errors: PricingError[] = [];
  const items: OrderItem[] = [];

  lines.forEach((line, index) => {
    const product = getProductBySku(line.sku);
    if (!product) {
      errors.push({
        index,
        sku: line.sku,
        reason: 'unknown_sku',
        message: `Unknown SKU "${line.sku}".`,
      });
      return;
    }

    if (!isColourwayId(line.colourway)) {
      errors.push({
        index,
        sku: line.sku,
        reason: 'unknown_colourway',
        message: `Unknown colourway "${line.colourway}" for SKU "${line.sku}".`,
      });
      return;
    }

    if (!Number.isFinite(line.quantity) || !Number.isInteger(line.quantity)) {
      errors.push({
        index,
        sku: line.sku,
        reason: 'non_integer_quantity',
        message: `Quantity for SKU "${line.sku}" must be a whole number.`,
      });
      return;
    }

    if (line.quantity < MIN_QTY || line.quantity > MAX_QTY) {
      errors.push({
        index,
        sku: line.sku,
        reason: 'invalid_quantity',
        message: `Quantity for SKU "${line.sku}" must be between ${MIN_QTY} and ${MAX_QTY}.`,
      });
      return;
    }

    const unitPriceCents = toCents(product.price);
    const quantity = line.quantity;
    const lineTotalCents = unitPriceCents * quantity;

    items.push({
      sku: product.sku,
      name: product.name,
      colourway: line.colourway,
      unitPriceCents,
      quantity,
      lineTotalCents,
    });
  });

  if (errors.length > 0) {
    return { ok: false, order: null, errors };
  }

  const subtotalCents = items.reduce(
    (sum, item) => sum + item.lineTotalCents,
    0,
  );
  const shippingCents =
    subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_CENTS;
  const totalCents = subtotalCents + shippingCents;

  return {
    ok: true,
    order: {
      items,
      subtotalCents,
      shippingCents,
      totalCents,
      currency: 'AUD',
    },
    errors: [],
  };
}
