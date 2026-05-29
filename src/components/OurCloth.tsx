import { Reveal } from "./Reveal";

/**
 * "Our cloth", art-directed:
 *  - a large macro-weave fabric field on the left that sticks while the
 *    editorial copy scrolls past it (split ~48/52)
 *  - specs woven into the prose as a running line, not a config widget
 *  - the three cloth notes set type-led, with small numeric markers rather than
 *    icon tiles
 */
const NOTES = [
  {
    n: "i",
    title: "Soft, dense, plush",
    text: "The bamboo-viscose blend gives a fluid, cushioned hand — soft against skin without feeling thin.",
  },
  {
    n: "ii",
    title: "Highly absorbent, quick to dry",
    text: "An open, airy weave drinks water fast, then dries quickly on the rail between uses.",
  },
  {
    n: "iii",
    title: "650 GSM, considered design",
    text: "Weighty and substantial, with a clean self-band detail. Built to look good a year in, not just on day one.",
  },
] as const;

export function OurCloth() {
  return (
    <section
      className="section bg-gradient-to-b from-bone to-sand-soft"
      id="cloth"
    >
      <div className="wrap-wide">
        <div className="grid grid-cols-12 gap-x-16 gap-y-12">
          {/* Sticky material field. */}
          <div className="col-span-12 lg:col-span-5">
            <div className="lg:sticky lg:top-[100px]">
              <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[2px] rounded-tr-[40px] border border-line shadow-brand-lg">
                <div className="weave-base absolute inset-0" aria-hidden="true" />
                <div className="weave-threads absolute inset-0" aria-hidden="true" />
                <div className="weave-loop absolute inset-0" aria-hidden="true" />
                <div
                  className="weave-terra-stripe absolute inset-x-0 bottom-[26%] h-[38px] bg-terracotta opacity-90"
                  aria-hidden="true"
                />
                <div className="absolute bottom-5 left-5 border-l-2 border-terracotta bg-bone/95 py-2 pl-3 pr-4 text-[12.5px] font-semibold shadow-brand-sm">
                  Macro · 650 GSM looped weave
                </div>
              </Reveal>
            </div>
          </div>

          {/* Scrolling editorial column. */}
          <div className="col-span-12 lg:col-span-7">
            <Reveal>
              <p className="index-tag mb-5 flex items-center gap-3">
                <b>02</b>
                <span className="h-px w-9 bg-ink-40" aria-hidden="true" />
                Our cloth
              </p>
              <h2 className="display-lg max-w-[14ch] font-semibold">
                One cloth.{" "}
                <span className="fr-italic font-normal text-terracotta">
                  Made to be felt.
                </span>
              </h2>
              <p className="mt-7 max-w-[52ch] text-[19px] leading-relaxed text-ink-70 max-[680px]:text-[17px]">
                We wove the whole range from a single blend, tuned for the thing
                you actually notice: how it feels in the hand and how fast
                it&apos;s ready to use again.
              </p>

              {/* Specs woven as a running line, not a widget. */}
              <p className="mt-9 border-y border-line py-5 font-display text-[clamp(17px,2vw,22px)] leading-snug text-ink">
                <b className="text-terracotta">70%</b> bamboo viscose
                <span className="px-2.5 text-ink-40">·</span>
                <b className="text-terracotta">30%</b> cotton
                <span className="px-2.5 text-ink-40">·</span>
                <b className="text-terracotta">650</b> GSM
                <span className="px-2.5 text-ink-40">·</span>
                Made in Thailand
              </p>

              <dl className="mt-10 grid gap-8">
                {NOTES.map((note) => (
                  <div
                    key={note.title}
                    className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 border-t border-line-soft pt-5"
                  >
                    <dt className="font-display text-lg italic text-ink-40">
                      {note.n}
                    </dt>
                    <div>
                      <dt className="font-sans text-[17px] font-bold">
                        {note.title}
                      </dt>
                      <dd className="m-0 mt-1 max-w-[52ch] text-[14.5px] text-ink-70">
                        {note.text}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
