import type { ColourwayId } from '@/lib/colourways';

/** Lifecycle of an order. No fulfilment automation here — these are set by hand
 *  / by the (optional) payment webhook in a real deployment. */
export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'fulfilled'
  | 'cancelled';

/** Australian shipping address. Kept deliberately minimal — this is a towel
 *  store, not a KYC surface. */
export interface ShippingAddress {
  readonly line1: string;
  readonly line2?: string;
  readonly suburb: string;
  readonly state: string;
  readonly postcode: string;
  readonly country: string;
}

export interface Customer {
  readonly email: string;
  readonly name: string;
  readonly shippingAddress: ShippingAddress;
}

/** A priced, server-authoritative line. All money is integer cents. */
export interface OrderItem {
  readonly sku: string;
  readonly name: string;
  readonly colourway: ColourwayId;
  readonly unitPriceCents: number;
  readonly quantity: number;
  readonly lineTotalCents: number;
}

export interface Order {
  readonly id?: string;
  readonly orderNumber: string;
  readonly status: OrderStatus;
  readonly customer: Customer;
  readonly items: readonly OrderItem[];
  readonly subtotalCents: number;
  readonly shippingCents: number;
  readonly totalCents: number;
  readonly currency: 'AUD';
  readonly createdAt?: string;
  /** True when the order was written to Supabase; false when the DB isn't
   *  configured and the order was only computed in-memory. */
  readonly persisted: boolean;
}

/** What the client may submit for a single line. Note: NO price. The server
 *  re-derives every cent from the catalogue. */
export interface CartLineInput {
  readonly sku: string;
  readonly colourway: string;
  readonly quantity: number;
}

/** Full create-order payload from the client. */
export interface CreateOrderInput {
  readonly lines: readonly CartLineInput[];
  readonly customer: Customer;
}
