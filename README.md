`# Saltmist

Storefront for **Saltmist** — plush, quick-drying bath towels made with bamboo
viscose and cotton. Ported from the static prototype to **Next.js 14 (App
Router) + TypeScript (strict) + Tailwind CSS**, ready to deploy on Vercel.

## Stack

- Next.js 14 App Router (`src/app/` directory)
- TypeScript in `strict` mode (`noUncheckedIndexedAccess`, `noUnusedLocals`, …)
- Server-side order API (route handlers) with authoritative, catalogue-derived pricing
- Optional Supabase persistence + optional Stripe payment intents (both degrade gracefully)
- Tailwind CSS with the brand palette encoded as named colours
- `next/font/google` for Fraunces (display) + Inter (body)
- In-memory cart via React Context + `useReducer` (no persistence; no `localStorage`)
- pnpm

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Other scripts:

```bash
pnpm build        # production build
pnpm start        # serve the production build
pnpm typecheck    # tsc --noEmit
pnpm lint         # next lint
```

> No lockfile is committed — `pnpm install` will generate `pnpm-lock.yaml` on
> first run.

## Project structure

```
saltmist-web/
├─ src/
│  ├─ app/
│  │  ├─ globals.css        # base resets, CSS textures/gradients, accordion + drawer + reveal
│  │  ├─ layout.tsx         # fonts, Metadata API, JSON-LD, CartProvider
│  │  ├─ page.tsx           # section composition
│  │  └─ api/
│  │     ├─ products/route.ts             # GET catalogue
│  │     ├─ admin/…                        # JWT-guarded admin auth + order mgmt
│  │     ├─ orders/route.ts               # POST create order (guest checkout)
│  │     ├─ orders/[id]/route.ts          # GET one order by uuid or order_number
│  │     └─ checkout/payment-intent/route.ts  # POST Stripe intent (optional, lazy)
│  ├─ components/
│  │  ├─ CartProvider.tsx   # cart context (useReducer) + free-shipping logic
│  │  ├─ CartDrawer.tsx     # slide-in drawer: cart → checkout form → success
│  │  ├─ Header.tsx         # sticky nav, mobile menu, cart count + bump
│  │  ├─ Hero.tsx … Footer.tsx, Reveal.tsx, icons.tsx
│  └─ lib/
│     ├─ products.ts        # Product type (incl. sku) + data + MATERIAL constant
│     ├─ colourways.ts      # the four colourways
│     ├─ format.ts          # AUD formatters (dollars + integer-cents) + toCents
│     ├─ site.ts            # SITE_URL, name, slogan, free-shipping threshold
│     ├─ jsonLd.ts          # schema.org @graph builder
│     ├─ faqs.ts / faqs-data.tsx
│     ├─ utils/logger.ts    # createLogger(prefix) — dev/test-gated logging
│     ├─ supabase/admin.ts  # getSupabaseAdmin() — null-safe service-role singleton
│     └─ orders/
│        ├─ types.ts        # Order, OrderItem, OrderStatus, CartLineInput, …
│        ├─ pricing.ts      # priceOrder() — authoritative, catalogue-derived totals
│        ├─ validate.ts     # request-body parsing/validation (no `any`)
│        ├─ create.ts       # createOrder() — price + (optional) persist
│        └─ client.ts       # submitOrder() — browser fetch helper
├─ supabase/
│  └─ migrations/0001_orders.sql  # orders + order_items tables, indexes, trigger
├─ tailwind.config.ts    # brand palette, fonts, shadows, keyframes
├─ next.config.mjs
├─ postcss.config.mjs
├─ .env.example
└─ tsconfig.json
```

Server components are kept server-only; only the genuinely interactive pieces
(`Header`, `ProductCard`, `Faq`, `EmailSignup`, `CartDrawer`, `CartProvider`,
`Reveal`) are marked `"use client"`.

## Order API

All routes live under `src/app/api`. JSON in, JSON out, with a consistent
`{ error }` envelope on failure and proper status codes.

| Route | Method | Contract |
| --- | --- | --- |
| `/api/products` | GET | Returns `{ products, material, currency }`. Catalogue is the single source of truth for prices (whole-dollar + derived `priceCents`). |
| `/api/orders` | POST | Guest checkout (unauthenticated). Body `{ lines: [{ sku, colourway, quantity }], customer: { email, name, shippingAddress } }`. Returns `201 { success, order }`. |
| `/api/orders` | GET | **Removed (404).** Listing every order publicly leaked customer data; use the protected `GET /api/admin/orders` instead. |
| `/api/orders/[id]` | GET | `id` is the order UUID **or** the `order_number` (e.g. `SM-…`). `404` if missing or DB not configured. |
| `/api/checkout/payment-intent` | POST | Body `{ lines: [...] }`. Returns `{ clientSecret, amountCents, currency }`, or `503 { error: 'Payments not configured' }` when no Stripe key. |
| `/api/admin/login` | POST | Body `{ username, password }`. Sets the `sm_admin` cookie. `200 { success }` / `401 { error }`. |
| `/api/admin/logout` | POST | Clears the cookie. `200 { success }` (idempotent). |
| `/api/admin/session` | GET | `200 { authenticated: boolean }`. |
| `/api/admin/orders` | GET | **Admin-only.** Up to 50 recent orders. `401` without a session, `501` when DB unconfigured. |
| `/api/admin/orders/[id]` | PATCH | **Admin-only.** Body `{ status: 'paid' \| 'fulfilled' \| 'cancelled' }`. `id` is UUID or order_number. `200 { success, order }`, `401`/`400`/`404`/`501`. |

### Authoritative, server-side pricing

The client may only ever send `{ sku, colourway, quantity }`. **No price or total
is ever read from the client.** `src/lib/orders/pricing.ts#priceOrder()`
re-derives every cent on the server from `src/lib/products.ts`:

- Each `sku` is looked up in the catalogue (unknown → `unknown_sku` error).
- Each `colourway` is validated against the four shared colourways.
- `quantity` is required to be an integer and clamped to **1–99**.
- Per-line total = catalogue unit price (in cents) × quantity.
- Order subtotal = Σ line totals.
- **Shipping: free at/over AU$99, otherwise a flat AU$9.95.**
- Total = subtotal + shipping.

All money is computed and stored in **integer cents** to avoid float drift, and
formatted for display via `formatAudCents()`.

### Running without a database or Stripe

Everything builds and runs with **no environment variables**:

- **No Supabase** (`getSupabaseAdmin()` returns `null`): `POST /api/orders` still
  prices the order server-side and returns it with `persisted: false`; the cart
  success screen shows a "demo mode — not stored" note. `/api/orders/[id]` and
  the admin `GET /api/admin/orders` respond `404`/`501` respectively.
- **No Stripe** (`STRIPE_SECRET_KEY` unset): the payment-intent route returns
  `503 { error: 'Payments not configured' }`. The `stripe` SDK is `import()`ed
  lazily, so it never enters the build graph unless actually used.

### Persistence schema

`supabase/migrations/0001_orders.sql` creates `orders` and `order_items`
(plain SQL, no ORM): uuid PKs, unique `order_number`, status check constraint,
customer + AU shipping columns, integer-cents money columns, `currency` default
`'AUD'`, `created_at`/`updated_at` (with an updated-at trigger), and a
cascade FK `order_items.order_id → orders.id`. Indexes on `order_number`,
`created_at`, and `order_items.order_id`.

Apply it with the Supabase CLI (`supabase db push`) or by running the SQL in the
Supabase SQL editor.

### Adding keys

Copy `.env.example` to `.env.local` and fill in what you need:

- `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` enable persistence.
- `STRIPE_SECRET_KEY` enables payment intents.

> **No compliance/AML logic is included here, by design.** Unlike the owner's
> ANB project, this storefront has no KYC/KYB, transaction monitoring, sanctions/
> PEP screening, TTR/SMR/IFTI reporting, risk scoring, or EDD — it's a towel
> store. The only "rule" borrowed from that stack is the hard line that
> server-derived catalogue prices, never client-submitted amounts, are
> authoritative.

## Admin auth

A deliberately **simple** JWT layer guards the internal admin area — and only
that. **There is no Clerk, no user table, and guest checkout is never
authenticated.** It mirrors the substance of the owner's `btl` repo (an
env-configured `ADMIN_USERNAME` / `ADMIN_PASSWORD` login behind an `/admin`
page) but upgrades the static client-held token to a proper signed session
cookie and reorganizes the code into a clean module.

### How it works

- **Token:** a `jose` **HS256 JWT** signed with `ADMIN_JWT_SECRET`, subject
  `saltmist-admin`, 8h expiry. `jose` + Web Crypto means it verifies in the edge
  runtime, so `middleware.ts` can check it — no native modules, nothing that
  breaks `next build`.
- **Cookie:** stored in an **httpOnly**, `sameSite=lax`, `path=/` cookie named
  **`sm_admin`** (`secure` in production), `maxAge` 8h.
- **Credentials:** checked against env in `src/lib/auth/credentials.ts` using a
  timing-safe compare. The password may be supplied as a **SHA-256 hash**
  (`ADMIN_PASSWORD_HASH`, recommended) computed via Web Crypto, **or** as
  plaintext (`ADMIN_PASSWORD`, simplest). No bcrypt/argon native dependency.
- **Guarding:**
  - **Pages** — `src/middleware.ts` (matcher `'/admin/:path*'`) verifies the
    cookie and redirects unauthenticated visitors to `/admin/login`. The login
    page is exempt. The matcher never touches the storefront or `/api/*`, so
    guest checkout is untouched.
  - **APIs** — each admin route handler calls `requireAdmin(req)` from
    `@/lib/auth`, which returns the session or a ready `401`. Defence in depth:
    the API is protected independently of the page middleware.
- **Fail closed:** if `ADMIN_JWT_SECRET` (or credentials) are missing, login
  returns `401` with a logged error — it never throws, so the build and the
  public storefront are unaffected.

### Module layout

```
src/lib/auth/
├─ index.ts        # public barrel — import from '@/lib/auth'
├─ config.ts       # cookie name, TTL, alg, secret loader (null-safe)
├─ session.ts      # createAdminSession() / verifyAdminSession() (jose)
├─ cookies.ts      # setAdminCookie() / clearAdminCookie()
├─ credentials.ts  # verifyAdminCredentials() — SHA-256 or plaintext, timing-safe
└─ guard.ts        # requireAdmin(req) -> session | 401

src/app/api/admin/
├─ login/route.ts          # POST  set cookie
├─ logout/route.ts         # POST  clear cookie
├─ session/route.ts        # GET   { authenticated }
├─ orders/route.ts         # GET   list (requireAdmin)
└─ orders/[id]/route.ts    # PATCH status (requireAdmin)

src/app/admin/
├─ login/page.tsx          # login form
└─ page.tsx                # dashboard (renders AdminDashboard)
src/components/admin/AdminDashboard.tsx   # client: list + status change + logout
src/middleware.ts                          # page redirect guard
```

### Setting credentials

Add to `.env.local` (see `.env.example`):

```bash
ADMIN_JWT_SECRET=$(openssl rand -base64 48)
ADMIN_USERNAME=admin
# recommended: store a hash, not the plaintext password
ADMIN_PASSWORD_HASH=$(node -e "crypto.subtle.digest('SHA-256', new TextEncoder().encode(process.argv[1])).then(b=>console.log(Buffer.from(b).toString('hex')))" 'your-password')
# or, simplest:
# ADMIN_PASSWORD=your-password
```

Then visit `/admin/login`. On success you land on `/admin`, where you can change
each order's status (`paid` / `fulfilled` / `cancelled`) and log out.

## SEO & structured data

- Metadata is implemented via the App Router Metadata API in `app/layout.tsx`
  (title template, description, canonical via `metadataBase` + `alternates`,
  Open Graph, Twitter, robots; `themeColor` lives in the `viewport` export per
  Next 14).
- JSON-LD (`@graph`: Organization, WebSite, ItemList of the 5 products with AUD
  offers, FAQPage) is built as a typed object in `lib/jsonLd.ts` and injected
  via `<script type="application/ld+json">`.

## Compliance copy

All claims-safe copy is preserved verbatim from the source:

- Fibre stated only as **"70% bamboo viscose, 30% cotton"** / "made with bamboo viscose".
- Origin only **"Designed in Australia, made in Thailand"** / "Made in Thailand".
- No "100% bamboo", "naturally antibacterial", "antimicrobial", "hypoallergenic",
  unqualified "eco/sustainable/biodegradable/chemical-free", or "UV protection".
- The honest rayon FAQ ("Is this bamboo or rayon?") stays, first in the list.

Treat this copy as load-bearing — edit it through marketing/compliance, not casually.

## Deploying to Vercel

1. Push the repo to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel — it auto-detects Next.js; framework preset and
   build command (`next build`) need no changes. Set the install command to
   `pnpm install` if it isn't picked up.
3. Deploy. No environment variables are required for the build; add the optional
   Supabase/Stripe keys (see `.env.example`) to enable persistence and payments.

## Placeholders to resolve before launch

- **`SITE_URL`** in `lib/site.ts` is set to the placeholder
  `https://www.saltmist.com.au`. It feeds `metadataBase`, the canonical URL, Open
  Graph/Twitter URLs, and the JSON-LD `@id`s. Update it to the real domain.
- **`/og-image.jpg`** is referenced for Open Graph/Twitter (1200×630) but not
  included. Add a `public/og-image.jpg` (and update the alt text if needed).
- **Social links** in `Footer.tsx` and **Stockists** point to `#` — wire to real
  URLs when available.
- **Checkout** posts the cart to `/api/orders`, which prices server-side and
  (when Supabase is configured) persists. No card is charged in the UI — wire the
  optional `/api/checkout/payment-intent` route to a real Stripe Elements flow to
  take payment. The cart is in-memory only and resets on reload.
