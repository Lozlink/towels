-- 0001_orders.sql
-- ZYNZYA order persistence. Plain SQL migration (no ORM), matching the ANB
-- migration style. All money is stored in integer cents.

create extension if not exists "pgcrypto";

create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_number    text not null unique,
  status          text not null default 'pending_payment'
                    check (status in ('pending_payment', 'paid', 'fulfilled', 'cancelled')),

  customer_email  text not null,
  customer_name   text not null,

  -- Shipping address (AU). Flat columns rather than jsonb for easy querying.
  ship_line1      text not null,
  ship_line2      text,
  ship_suburb     text not null,
  ship_state      text not null,
  ship_postcode   text not null,
  ship_country    text not null default 'AU',

  subtotal_cents  integer not null check (subtotal_cents >= 0),
  shipping_cents  integer not null default 0 check (shipping_cents >= 0),
  total_cents     integer not null check (total_cents >= 0),
  currency        text not null default 'AUD',

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders(id) on delete cascade,

  sku              text not null,
  name             text not null,
  colourway        text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity         integer not null check (quantity >= 1 and quantity <= 99),
  line_total_cents integer not null check (line_total_cents >= 0),

  created_at       timestamptz not null default now()
);

-- Indexes for the common lookups: by order number, by recency, by parent order.
create unique index if not exists orders_order_number_idx
  on public.orders (order_number);
create index if not exists orders_created_at_idx
  on public.orders (created_at desc);
create index if not exists order_items_order_id_idx
  on public.order_items (order_id);

-- Keep updated_at fresh on row changes.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();
