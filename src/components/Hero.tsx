import { ArrowRightIcon } from "./icons";

/**
 * Editorial, asymmetric hero.
 * Left: oversized left-aligned Fraunces headline with an optical-size italic
 * moment, a short standfirst, and a single restrained CTA plus a quiet text
 * link. Right: a tall draped terracotta fabric field (CSS-built terry) with the
 * honest-label caption offset low. No centred double-CTA, no stat strip.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      {/* Soft atmospheric wash behind everything. */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="hero-gradient absolute -inset-[10%]" />
        <div className="hero-weave absolute inset-0" />
      </div>

      <div className="wrap-wide relative z-[2]">
        <div className="grid grid-cols-12 items-stretch gap-y-10 pb-20 pt-12 max-[860px]:pb-12 lg:gap-x-10 lg:pb-[120px] lg:pt-20">
          {/* Type column — deliberately left-aligned, spanning 7 of 12. */}
          <div className="col-span-12 flex flex-col justify-center lg:col-span-7">
            <p className="index-tag mb-7 flex items-center gap-3">
              <span className="h-px w-9 bg-ink-40" aria-hidden="true" />
              Bath towels · 650 GSM
            </p>

            <h1
              id="hero-heading"
              className="display-xl font-semibold text-ink"
            >
              Softness,
              <br />
              <span className="fr-italic font-normal text-terracotta">
                settled.
              </span>
            </h1>

            <p className="mt-8 max-w-[44ch] text-[19px] leading-relaxed text-ink-70 max-[680px]:text-[17px]">
              Plush, quick-drying bath towels at 650 GSM — dense and soft
              underhand, fast to dry on the rail. Considered design, labelled
              plainly. For the quiet few minutes that are just yours.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href="#towels"
                className="group inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-terracotta px-8 py-[15px] text-base font-semibold text-white shadow-cta transition-[transform,box-shadow,background] duration-[180ms] ease-brand hover:-translate-y-0.5 hover:bg-terracotta-dk hover:shadow-cta-hover"
              >
                Shop the range
                <ArrowRightIcon className="h-[18px] w-[18px] transition-transform duration-200 ease-brand group-hover:translate-x-0.5" />
              </a>
              <a
                href="#cloth"
                className="group inline-flex items-center gap-2 border-b-[1.5px] border-ink/30 pb-0.5 text-[15px] font-semibold text-ink transition-colors hover:border-terracotta hover:text-terracotta"
              >
                Read about the cloth
              </a>
            </div>
          </div>

          {/* Material column — a tall draped terracotta field, offset low. */}
          <div className="col-span-12 lg:col-span-5">
            <figure className="relative m-0 h-full min-h-[420px] lg:min-h-[560px]">
              {/* Back panel: bone selvedge, sits high-right. */}
              <div
                className="fabric-bone terry-pile absolute right-0 top-0 h-[62%] w-[44%] overflow-hidden rounded-t-[2px] border border-white/40 shadow-brand-md max-[860px]:hidden"
                aria-hidden="true"
              >
                <span className="self-band absolute inset-x-0 top-9 h-3 opacity-70" />
              </div>

              {/* Hero drape: full-height terracotta terry, sharp top, soft base. */}
              <div
                className="fabric-terra terry-pile absolute bottom-0 left-0 h-[88%] w-[72%] overflow-hidden rounded-b-[28px] border border-white/20 shadow-brand-lg max-[860px]:w-[82%]"
                aria-hidden="true"
              >
                <span className="self-band absolute inset-x-0 top-16 h-5 opacity-60" />
                <span className="self-band absolute inset-x-0 bottom-24 h-7 opacity-70" />
                {/* folded selvedge edge down the right */}
                <span className="drape-fold absolute inset-y-0 right-0 w-10" />
              </div>

              {/* Sea-mist sliver tucked behind, lower-right — a colour-story hint. */}
              <div
                className="fabric-mist terry-pile absolute bottom-12 right-2 h-[40%] w-[30%] overflow-hidden rounded-tl-[20px] border border-white/30 shadow-brand-md max-[860px]:hidden"
                aria-hidden="true"
              >
                <span className="self-band absolute inset-x-0 top-6 h-2.5 opacity-70" />
              </div>

              {/* Honest-label caption — quiet, offset low-left, sharp card. */}
              <figcaption className="badge-float absolute bottom-5 left-2 z-[3] max-w-[230px] border-l-2 border-terracotta bg-bone-2/95 py-3 pl-4 pr-5 shadow-brand-md backdrop-blur-sm">
                <b className="block font-display text-[17px] leading-tight">
                  Honestly labelled
                </b>
                <span className="mt-1 block text-[12.5px] leading-snug text-ink-55">
                  70% bamboo viscose, 30% cotton · Made in Thailand
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
