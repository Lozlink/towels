import type {
  CartLineInput,
  CreateOrderInput,
  Customer,
  ShippingAddress,
} from './types';

/** Narrow an unknown value to a plain record without using `any`. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/** Loose email shape check — not an AML/identity check, just a sanity gate. */
function looksLikeEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export type ParseResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: string };

function parseShippingAddress(input: unknown): ParseResult<ShippingAddress> {
  if (!isRecord(input)) {
    return { ok: false, error: 'customer.shippingAddress is required.' };
  }
  const { line1, line2, suburb, state, postcode, country } = input;
  if (!isNonEmptyString(line1)) {
    return { ok: false, error: 'shippingAddress.line1 is required.' };
  }
  if (!isNonEmptyString(suburb)) {
    return { ok: false, error: 'shippingAddress.suburb is required.' };
  }
  if (!isNonEmptyString(state)) {
    return { ok: false, error: 'shippingAddress.state is required.' };
  }
  if (!isNonEmptyString(postcode)) {
    return { ok: false, error: 'shippingAddress.postcode is required.' };
  }
  const resolvedCountry = isNonEmptyString(country) ? country : 'AU';

  const address: ShippingAddress = {
    line1,
    ...(isNonEmptyString(line2) ? { line2 } : {}),
    suburb,
    state,
    postcode,
    country: resolvedCountry,
  };
  return { ok: true, value: address };
}

function parseCustomer(input: unknown): ParseResult<Customer> {
  if (!isRecord(input)) {
    return { ok: false, error: 'customer is required.' };
  }
  if (!looksLikeEmail(input.email)) {
    return { ok: false, error: 'A valid customer.email is required.' };
  }
  if (!isNonEmptyString(input.name)) {
    return { ok: false, error: 'customer.name is required.' };
  }
  const address = parseShippingAddress(input.shippingAddress);
  if (!address.ok) return address;

  return {
    ok: true,
    value: {
      email: input.email,
      name: input.name,
      shippingAddress: address.value,
    },
  };
}

function parseLines(input: unknown): ParseResult<CartLineInput[]> {
  if (!Array.isArray(input) || input.length === 0) {
    return { ok: false, error: 'lines must be a non-empty array.' };
  }
  const lines: CartLineInput[] = [];
  for (const raw of input) {
    if (!isRecord(raw)) {
      return { ok: false, error: 'Each line must be an object.' };
    }
    if (!isNonEmptyString(raw.sku)) {
      return { ok: false, error: 'Each line requires a sku.' };
    }
    if (!isNonEmptyString(raw.colourway)) {
      return { ok: false, error: 'Each line requires a colourway.' };
    }
    if (typeof raw.quantity !== 'number') {
      return { ok: false, error: 'Each line requires a numeric quantity.' };
    }
    lines.push({
      sku: raw.sku,
      colourway: raw.colourway,
      quantity: raw.quantity,
    });
  }
  return { ok: true, value: lines };
}

/**
 * Parse + shape-validate a create-order request body. Crucially, this never
 * trusts any client-sent price or total — only `{ sku, colourway, quantity }`
 * per line, plus the customer/shipping fields. Pricing happens server-side.
 */
export function parseCreateOrderInput(
  body: unknown,
): ParseResult<CreateOrderInput> {
  if (!isRecord(body)) {
    return { ok: false, error: 'Request body must be a JSON object.' };
  }
  const lines = parseLines(body.lines);
  if (!lines.ok) return lines;

  const customer = parseCustomer(body.customer);
  if (!customer.ok) return customer;

  return {
    ok: true,
    value: { lines: lines.value, customer: customer.value },
  };
}

/** Parse just the line items (for the payment-intent route, which doesn't need
 *  full customer details to compute an amount). */
export function parseLinesOnly(body: unknown): ParseResult<CartLineInput[]> {
  if (!isRecord(body)) {
    return { ok: false, error: 'Request body must be a JSON object.' };
  }
  return parseLines(body.lines);
}
