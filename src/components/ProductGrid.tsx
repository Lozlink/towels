import { getProduct } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

/**
 * The range, presented editorially rather than as a uniform SKU grid:
 *  - a left-weighted section masthead with a numeric index, not a centred eyebrow
 *  - the bath towel as a tall featured hero beside a stacked pair of supporting
 *    items (asymmetric two-column split)
 *  - the bundle as a full-width landscape row that closes the range
 * Card sizes vary deliberately; the cart + colourway logic is untouched.
 */
const bath = getProduct("bath");
const sheet = getProduct("sheet");
const hand = getProduct("hand");
const face = getProduct("face");
const bundle = getProduct("bundle");

export function ProductGrid() {
  return (
    <section className="section" id="towels">
      <div className="wrap-wide">
        <Reveal className="mb-14 grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 lg:col-span-8">
            <p className="index-tag mb-5 flex items-center gap-3">
              <b>01</b>
              <span className="h-px w-9 bg-ink-40" aria-hidden="true" />
              The range
            </p>
            <h2 className="display-lg max-w-[12ch] font-semibold">
              Towels worth reaching for.
            </h2>
          </div>
          <p className="col-span-12 self-end text-[15px] text-ink-70 lg:col-span-4">
            Five formats, four colourways. Same cloth throughout — 100% bamboo
            fibre, unblended, at 650 GSM. Choose a colourway on any piece.
          </p>
        </Reveal>

        {/* Featured hero + stacked supporting pair. */}
        <Reveal className="grid grid-cols-12 gap-6">
          {bath ? (
            <div className="col-span-12 lg:col-span-7">
              <ProductCard product={bath} variant="feature" />
            </div>
          ) : null}

          <div className="col-span-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {sheet ? <ProductCard product={sheet} variant="standard" /> : null}
            {hand ? <ProductCard product={hand} variant="standard" /> : null}
          </div>
        </Reveal>

        {/* Face cloth offset left; bundle as a wide closing row. */}
        <Reveal className="mt-6 grid grid-cols-12 gap-6">
          {face ? (
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
              <ProductCard product={face} variant="standard" />
            </div>
          ) : null}
          {bundle ? (
            <div className="col-span-12 lg:col-span-8">
              <ProductCard product={bundle} variant="wide" />
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
