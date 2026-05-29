"use client";

import { useState } from "react";
import {
  COLOURWAYS,
  COLOURWAY_IDS,
  DEFAULT_COLOURWAY,
  type ColourwayId,
} from "@/lib/colourways";
import { formatAud } from "@/lib/format";
import type { Product } from "@/lib/products";
import { useCart } from "./CartProvider";
import { CheckIcon, PlusIcon } from "./icons";

/**
 * Card variants drive the editorial range layout:
 *  - "feature": tall portrait hero card (the bath towel / bundle)
 *  - "standard": compact supporting item
 *  - "wide": full-width landscape row, image beside copy
 * The cart + colourway logic is identical across all variants.
 */
export type CardVariant = "feature" | "standard" | "wide";

export function ProductCard({
  product,
  variant = "standard",
}: {
  product: Product;
  variant?: CardVariant;
}) {
  const { add } = useCart();
  const [colour, setColour] = useState<ColourwayId>(DEFAULT_COLOURWAY);
  const [justAdded, setJustAdded] = useState(false);

  const active = COLOURWAYS[colour];

  function handleAdd() {
    add(product.id, colour);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1300);
  }

  const isFeature = variant === "feature";
  const isWide = variant === "wide";

  // The CSS-built folded towel that sits in the image field.
  const fold = (
    <div
      className="fold-texture relative aspect-[5/4] overflow-hidden rounded-[10px] border border-white/40 shadow-[0_16px_38px_rgba(46,42,36,0.24)] transition-[background] duration-[400ms] ease-brand"
      style={{ background: active.fold }}
    >
      <span className="absolute inset-x-[8%] top-1/2 h-px bg-[rgba(46,42,36,0.1)]" />
      <span
        className="absolute inset-x-0 bottom-[28px] h-3.5 opacity-90"
        style={{ background: active.stripe }}
      />
      <span
        className="absolute inset-x-0 bottom-3.5 h-[7px] opacity-90"
        style={{ background: active.stripe }}
      />
    </div>
  );

  const tag = product.tag ? (
    <span
      className={`absolute left-4 top-4 z-[2] px-3 py-[5px] text-[11px] font-semibold uppercase tracking-[0.08em] ${
        product.was
          ? "bg-terracotta text-white"
          : "border border-line bg-bone/90 text-ink-70"
      }`}
    >
      {product.tag}
    </span>
  ) : null;

  const swatches = (
    <div className="flex items-center gap-2.5">
      <span className="mr-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-40">
        Colour
      </span>
      {COLOURWAY_IDS.map((id) => {
        const cw = COLOURWAYS[id];
        const isActive = id === colour;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setColour(id)}
            aria-label={cw.name}
            aria-pressed={isActive}
            title={cw.name}
            className={`relative h-[22px] w-[22px] rounded-full border-2 border-white shadow-[0_0_0_1px_var(--line)] transition-[transform,box-shadow] hover:scale-110 ${
              isActive ? "scale-110 shadow-[0_0_0_2px_var(--terracotta)]" : ""
            }`}
            style={{ background: cw.thumb }}
          />
        );
      })}
    </div>
  );

  const priceBlock = (
    <div className="font-display text-2xl font-semibold leading-none">
      {product.was ? (
        <span className="mr-[7px] font-sans text-sm font-medium text-ink-40 line-through">
          {formatAud(product.was)}
        </span>
      ) : null}
      {formatAud(product.price)}
    </div>
  );

  const addButton = (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Add ${product.name} to cart`}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14.5px] font-semibold text-bone transition-[background,transform] active:scale-[0.97] ${
        justAdded ? "bg-mist" : "bg-ink hover:-translate-y-px hover:bg-terracotta"
      }`}
    >
      {justAdded ? (
        <>
          <CheckIcon className="h-4 w-4" />
          Added
        </>
      ) : (
        <>
          <PlusIcon className="h-4 w-4" />
          Add
        </>
      )}
    </button>
  );

  // ---- Wide landscape row: image left, copy right ----
  if (isWide) {
    return (
      <article className="group grid grid-cols-1 items-stretch overflow-hidden rounded-[2px] border border-line-soft bg-bone-2 transition-[border-color,box-shadow] duration-300 ease-brand hover:border-line hover:shadow-brand-md sm:grid-cols-[0.85fr_1.15fr]">
        <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-bone-2 to-sand-soft p-9">
          {tag}
          <div className="w-[58%] max-w-[220px]">{fold}</div>
        </div>
        <div className="flex flex-col justify-center gap-4 p-8 max-[680px]:p-6">
          <div>
            <h3 className="font-display text-[26px] font-semibold leading-tight">
              {product.name}
            </h3>
            <p className="mt-2 max-w-[46ch] text-[15px] text-ink-70">
              {product.desc}
            </p>
          </div>
          {swatches}
          <div className="mt-1 flex items-center justify-between gap-4">
            {priceBlock}
            {addButton}
          </div>
        </div>
      </article>
    );
  }

  // ---- Feature (tall) and standard cards ----
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden border border-line-soft bg-bone-2 transition-[transform,box-shadow,border-color] duration-300 ease-brand hover:-translate-y-[5px] hover:border-line hover:shadow-brand-lg ${
        isFeature ? "rounded-[2px] rounded-bl-[26px]" : "rounded-[2px]"
      }`}
    >
      <div
        className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-bone-2 to-sand-soft"
        style={{ height: isFeature ? 360 : 230 }}
      >
        {tag}
        <div className={isFeature ? "w-[52%] max-w-[260px]" : "w-[56%] max-w-[190px]"}>
          {fold}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 pb-[26px]">
        <h3
          className={`font-display font-semibold leading-tight ${
            isFeature ? "text-[30px]" : "text-[21px]"
          }`}
        >
          {product.name}
        </h3>
        <p className="mb-5 mt-2 flex-1 text-[14.5px] text-ink-70">
          {product.desc}
        </p>

        <div className="mb-5">{swatches}</div>

        <div className="flex items-center justify-between gap-3.5">
          {priceBlock}
          {addButton}
        </div>
      </div>
    </article>
  );
}
