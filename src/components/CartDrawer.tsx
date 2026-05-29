"use client";

import { useEffect, useRef, useState } from "react";
import { COLOURWAYS, DEFAULT_COLOURWAY } from "@/lib/colourways";
import { formatAud, formatAudCents } from "@/lib/format";
import { submitOrder } from "@/lib/orders/client";
import type { CartLineInput, Customer, Order } from "@/lib/orders/types";
import { getProduct } from "@/lib/products";
import { useCart } from "./CartProvider";
import { CheckIcon, CloseIcon, EmptyCartIcon } from "./icons";

/** The drawer moves through three phases without leaving the slide-in panel. */
type Phase = "cart" | "checkout" | "success";

const EMPTY_FORM = {
  name: "",
  email: "",
  line1: "",
  line2: "",
  suburb: "",
  state: "",
  postcode: "",
} as const;

type FormState = { -readonly [K in keyof typeof EMPTY_FORM]: string };

export function CartDrawer() {
  const {
    lines,
    count,
    subtotal,
    isOpen,
    hasFreeShipping,
    remainingForFreeShipping,
    freeShippingThreshold,
    changeQty,
    remove,
    closeCart,
  } = useCart();

  const closeRef = useRef<HTMLButtonElement | null>(null);

  const [phase, setPhase] = useState<Phase>("cart");
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Lock body scroll, move focus into the drawer, and wire Escape to close.
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  // Reset back to the cart view a moment after the drawer closes.
  useEffect(() => {
    if (isOpen) return;
    const t = window.setTimeout(() => {
      setPhase("cart");
      setError(null);
    }, 250);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  function setField(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (count === 0 || submitting) return;

    // Build the line items the server will trust — sku/colourway/quantity only.
    const orderLines: CartLineInput[] = [];
    for (const line of lines) {
      const product = getProduct(line.productId);
      if (!product) continue;
      orderLines.push({
        sku: product.sku,
        colourway: line.colour ?? DEFAULT_COLOURWAY,
        quantity: line.qty,
      });
    }
    if (orderLines.length === 0) return;

    const customer: Customer = {
      email: form.email.trim(),
      name: form.name.trim(),
      shippingAddress: {
        line1: form.line1.trim(),
        ...(form.line2.trim() ? { line2: form.line2.trim() } : {}),
        suburb: form.suburb.trim(),
        state: form.state.trim(),
        postcode: form.postcode.trim(),
        country: "AU",
      },
    };

    setSubmitting(true);
    setError(null);
    const outcome = await submitOrder({ lines: orderLines, customer });
    setSubmitting(false);

    if (!outcome.ok) {
      setError(outcome.error);
      return;
    }
    setPlacedOrder(outcome.order);
    setPhase("success");
  }

  let shipNote: React.ReactNode;
  if (subtotal === 0) {
    shipNote = (
      <>
        Add <b className="text-terracotta">{formatAud(freeShippingThreshold)}</b>{" "}
        to unlock free AU shipping.
      </>
    );
  } else if (hasFreeShipping) {
    shipNote = (
      <>
        <b className="text-terracotta">Free AU shipping</b> unlocked — nice.
      </>
    );
  } else {
    shipNote = (
      <>
        Add{" "}
        <b className="text-terracotta">
          {formatAud(remainingForFreeShipping)}
        </b>{" "}
        more for free AU shipping.
      </>
    );
  }

  const heading =
    phase === "checkout"
      ? "Checkout"
      : phase === "success"
        ? "Order placed"
        : "Your cart";

  return (
    <>
      <div
        className="overlay fixed inset-0 z-[90] bg-ink/45 backdrop-blur-[2px]"
        data-open={isOpen}
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        className="drawer fixed inset-y-0 right-0 z-[100] flex w-[420px] max-w-[92vw] flex-col bg-bone shadow-brand-lg"
        data-open={isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-line px-[26px] py-6">
          <h3 className="text-[23px]">{heading}</h3>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-line transition-colors hover:bg-sand-soft"
            aria-label="Close cart"
          >
            <CloseIcon className="h-[18px] w-[18px]" />
          </button>
        </div>

        {phase === "success" && placedOrder ? (
          <SuccessPanel order={placedOrder} onClose={closeCart} />
        ) : phase === "checkout" ? (
          <CheckoutPanel
            form={form}
            setField={setField}
            onBack={() => setPhase("cart")}
            onSubmit={handlePlaceOrder}
            submitting={submitting}
            error={error}
            subtotal={subtotal}
            shipNote={shipNote}
          />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-[26px] py-2">
              {lines.length === 0 ? (
                <div className="px-5 py-[60px] text-center text-ink-55">
                  <EmptyCartIcon className="mx-auto mb-[18px] h-[54px] w-[54px] text-ink-40" />
                  <b className="mb-1.5 block font-display text-[21px] text-ink">
                    Your cart is empty
                  </b>
                  <span>Add a towel to get started.</span>
                </div>
              ) : (
                lines.map((line) => {
                  const product = getProduct(line.productId);
                  if (!product) return null;
                  const cw = COLOURWAYS[line.colour];
                  return (
                    <div
                      key={line.key}
                      className="flex gap-3.5 border-b border-line-soft py-5"
                    >
                      <div
                        className="thumb-texture relative h-[62px] w-[62px] flex-none overflow-hidden rounded-[11px] shadow-brand-sm"
                        style={{ background: cw.thumb }}
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="m-0 font-sans text-[15px] font-semibold">
                          {product.name}
                        </h4>
                        <p className="mt-0.5 text-[12.5px] text-ink-55">
                          {cw.name}
                        </p>
                        <p className="mt-1.5 text-sm font-semibold text-ink-70">
                          {formatAud(product.price)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <div className="flex items-center overflow-hidden rounded-full border border-line">
                          <button
                            type="button"
                            onClick={() => changeQty(line.key, -1)}
                            className="h-[30px] w-[30px] text-[17px] text-ink-70 transition-colors hover:bg-sand-soft"
                            aria-label={`Decrease quantity of ${product.name}`}
                          >
                            −
                          </button>
                          <span className="min-w-[26px] text-center text-sm font-semibold">
                            {line.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => changeQty(line.key, 1)}
                            className="h-[30px] w-[30px] text-[17px] text-ink-70 transition-colors hover:bg-sand-soft"
                            aria-label={`Increase quantity of ${product.name}`}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(line.key)}
                          className="text-xs text-ink-40 underline transition-colors hover:text-terracotta"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-line bg-bone-2 px-[26px] py-[22px]">
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-[15px] font-semibold">Subtotal</span>
                <b className="font-display text-[26px] font-semibold">
                  {formatAud(subtotal)}
                </b>
              </div>
              <p className="mb-[18px] text-[13px] text-ink-55">{shipNote}</p>
              <button
                type="button"
                onClick={() => {
                  if (count === 0) return;
                  setError(null);
                  setPhase("checkout");
                }}
                disabled={count === 0}
                className="w-full rounded-full bg-terracotta p-[17px] text-base font-semibold text-white shadow-cta transition-[background,transform] hover:-translate-y-px hover:bg-terracotta-dk disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-sand disabled:text-ink-40 disabled:shadow-none"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

const FIELD_CLASS =
  "w-full rounded-[10px] border border-line bg-bone px-3.5 py-2.5 text-[14.5px] text-ink outline-none transition-colors focus:border-terracotta";
const LABEL_CLASS =
  "mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-40";

function CheckoutPanel({
  form,
  setField,
  onBack,
  onSubmit,
  submitting,
  error,
  subtotal,
  shipNote,
}: {
  form: FormState;
  setField: (key: keyof FormState, value: string) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  error: string | null;
  subtotal: number;
  shipNote: React.ReactNode;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-[26px] py-5">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 text-[13px] text-ink-55 underline transition-colors hover:text-terracotta"
        >
          ← Back to cart
        </button>

        <p className="mb-5 text-[13px] text-ink-55">
          Demo checkout — your details are sent to the order API, which prices
          everything server-side. No card is charged.
        </p>

        <div className="space-y-3.5">
          <div>
            <label htmlFor="co-name" className={LABEL_CLASS}>
              Full name
            </label>
            <input
              id="co-name"
              className={FIELD_CLASS}
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="co-email" className={LABEL_CLASS}>
              Email
            </label>
            <input
              id="co-email"
              type="email"
              className={FIELD_CLASS}
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="co-line1" className={LABEL_CLASS}>
              Address
            </label>
            <input
              id="co-line1"
              className={FIELD_CLASS}
              value={form.line1}
              onChange={(e) => setField("line1", e.target.value)}
              required
              autoComplete="address-line1"
            />
          </div>
          <div>
            <label htmlFor="co-line2" className={LABEL_CLASS}>
              Address line 2 (optional)
            </label>
            <input
              id="co-line2"
              className={FIELD_CLASS}
              value={form.line2}
              onChange={(e) => setField("line2", e.target.value)}
              autoComplete="address-line2"
            />
          </div>
          <div>
            <label htmlFor="co-suburb" className={LABEL_CLASS}>
              Suburb
            </label>
            <input
              id="co-suburb"
              className={FIELD_CLASS}
              value={form.suburb}
              onChange={(e) => setField("suburb", e.target.value)}
              required
              autoComplete="address-level2"
            />
          </div>
          <div className="flex gap-3.5">
            <div className="flex-1">
              <label htmlFor="co-state" className={LABEL_CLASS}>
                State
              </label>
              <input
                id="co-state"
                className={FIELD_CLASS}
                value={form.state}
                onChange={(e) => setField("state", e.target.value)}
                required
                autoComplete="address-level1"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="co-postcode" className={LABEL_CLASS}>
                Postcode
              </label>
              <input
                id="co-postcode"
                className={FIELD_CLASS}
                value={form.postcode}
                onChange={(e) => setField("postcode", e.target.value)}
                required
                inputMode="numeric"
                autoComplete="postal-code"
              />
            </div>
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-[10px] bg-terracotta/10 px-3.5 py-2.5 text-[13px] text-terracotta-dk">
            {error}
          </p>
        ) : null}
      </div>

      <div className="border-t border-line bg-bone-2 px-[26px] py-[22px]">
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-[15px] font-semibold">Subtotal</span>
          <b className="font-display text-[26px] font-semibold">
            {formatAud(subtotal)}
          </b>
        </div>
        <p className="mb-[18px] text-[13px] text-ink-55">{shipNote}</p>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-terracotta p-[17px] text-base font-semibold text-white shadow-cta transition-[background,transform] hover:-translate-y-px hover:bg-terracotta-dk disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-sand disabled:text-ink-40 disabled:shadow-none"
        >
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </div>
    </form>
  );
}

function SuccessPanel({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-[26px] py-8">
      <div className="mb-5 flex flex-col items-center text-center">
        <span className="mb-4 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-mist/20 text-mist">
          <CheckIcon className="h-7 w-7" />
        </span>
        <b className="mb-1 block font-display text-[24px] text-ink">
          Thanks, {order.customer.name.split(" ")[0] || "friend"}.
        </b>
        <p className="text-[14px] text-ink-55">
          Your order is in. A confirmation would normally land in your inbox.
        </p>
      </div>

      <div className="rounded-[14px] border border-line bg-bone-2 p-5">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-40">
            Order number
          </span>
          <b className="font-display text-[18px]">{order.orderNumber}</b>
        </div>

        <ul className="mb-3 space-y-2 border-t border-line-soft pt-3">
          {order.items.map((item) => (
            <li
              key={`${item.sku}-${item.colourway}`}
              className="flex items-baseline justify-between text-[13.5px] text-ink-70"
            >
              <span>
                {item.name}{" "}
                <span className="text-ink-40">× {item.quantity}</span>
              </span>
              <span className="font-semibold">
                {formatAudCents(item.lineTotalCents)}
              </span>
            </li>
          ))}
        </ul>

        <div className="space-y-1 border-t border-line-soft pt-3 text-[13.5px]">
          <div className="flex justify-between text-ink-55">
            <span>Subtotal</span>
            <span>{formatAudCents(order.subtotalCents)}</span>
          </div>
          <div className="flex justify-between text-ink-55">
            <span>Shipping</span>
            <span>
              {order.shippingCents === 0
                ? "Free"
                : formatAudCents(order.shippingCents)}
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1.5">
            <span className="text-[15px] font-semibold">Total</span>
            <b className="font-display text-[22px] font-semibold">
              {formatAudCents(order.totalCents)}
            </b>
          </div>
        </div>
      </div>

      {!order.persisted ? (
        <p className="mt-4 text-center text-[12px] text-ink-40">
          Demo mode — no database is configured, so this order was computed but
          not stored.
        </p>
      ) : null}

      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full rounded-full border border-line p-[15px] text-[15px] font-semibold text-ink transition-colors hover:bg-sand-soft"
      >
        Done
      </button>
    </div>
  );
}
