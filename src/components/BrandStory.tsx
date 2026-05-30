import { Reveal } from "./Reveal";

/**
 * Brand story as an editorial spread on Kelp:
 *  - an oversized Fraunces pull-quote runs wide across the top, left-aligned,
 *    with an optical-size italic accent
 *  - the narrative sits below in a narrow, offset measure beside the attribution
 * No symmetric two-card split.
 */
export function BrandStory() {
  return (
    <section className="section bg-kelp text-bone" aria-labelledby="story-heading">
      <div className="wrap-wide">
        <Reveal>
          <p className="index-tag mb-8 flex items-center gap-3 text-sand">
            <b className="text-marigold">03</b>
            <span className="h-px w-9 bg-bone/30" aria-hidden="true" />
            Our story
          </p>

          <blockquote className="m-0 max-w-[18ch]">
            <p
              id="story-heading"
              className="display-lg font-extrabold text-bone"
            >
              One fibre, and{" "}
              <span className="fr-italic font-normal text-marigold">
                plain about it
              </span>
              .
            </p>
          </blockquote>
        </Reveal>

        <div className="mt-14 grid grid-cols-12 gap-x-16 gap-y-10">
          <Reveal className="col-span-12 lg:col-span-7 lg:col-start-5">
            <p className="max-w-[58ch] text-lg leading-relaxed text-bone/80">
              ZYNZYA started with one decision: make a bamboo towel that is
              actually bamboo. Not a viscose blend dressed up in &ldquo;bamboo&rdquo;
              marketing — the real fibre, unblended, from a fast-growing plant.
            </p>
            <p className="max-w-[58ch] text-lg leading-relaxed text-bone/80">
              Our towels are woven from 100% bamboo fibre at 650 GSM — soft and
              breathable, naturally absorbent, and biodegradable at the end of
              their life. They&apos;re made in Thailand by a mill we work with
              directly, and we label them plainly: what they&apos;re made of and
              how they wash, nothing dressed up. We only put a claim on the page
              once we can stand behind it.
            </p>

            <div className="mt-9 flex items-center gap-3.5 border-t border-bone/15 pt-7">
              <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-gradient-to-br from-mist to-marigold font-display font-extrabold text-forest">
                Z
              </span>
              <div>
                <b className="block text-[15px]">The ZYNZYA team</b>
                <span className="text-[13px] text-bone/60">
                  Designed in Australia · Made in Thailand
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
