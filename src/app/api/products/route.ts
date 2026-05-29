import { NextResponse } from 'next/server';
import { MATERIAL, PRODUCTS } from '@/lib/products';
import { toCents } from '@/lib/format';
import { createLogger } from '@/lib/utils/logger';

const log = createLogger('api/products');

/**
 * GET /api/products
 * Returns the catalogue (the single source of truth for prices). Includes the
 * derived integer-cents price so clients can render exact figures without
 * re-deriving money themselves.
 */
export function GET() {
  try {
    const products = PRODUCTS.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      desc: p.desc,
      price: p.price,
      priceCents: toCents(p.price),
      was: p.was ?? null,
      feature: p.feature,
      tag: p.tag ?? null,
    }));
    return NextResponse.json({ products, material: MATERIAL, currency: 'AUD' });
  } catch (err) {
    log.error('Failed to serialise catalogue', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
