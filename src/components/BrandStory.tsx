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
            <b className="text-terracotta">03</b>
            <span className="h-px w-9 bg-bone/30" aria-hidden="true" />
            Our story
          </p>

          <blockquote className="m-0 max-w-[18ch]">
            <p
              id="story-heading"
              className="display-lg font-semibold text-bone"
            >
              We&apos;d rather be{" "}
              <span className="fr-italic font-normal text-terracotta">
                plain about it
              </span>{" "}
              than over-promise.
            </p>
          </blockquote>
        </Reveal>

        <div className="mt-14 grid grid-cols-12 gap-x-16 gap-y-10">
          <Reveal className="col-span-12 lg:col-span-7 lg:col-start-5">
            <p className="max-w-[58ch] text-lg leading-relaxed text-bone/80">
              Saltmist started with a simple test: the towel you actually reach
              for. Not the showroom one — the everyday one that feels plush,
              dries fast, and still looks good a year in.
            </p>
            <p className="max-w-[58ch] text-lg leading-relaxed text-bone/80">
              Our towels are woven from a bamboo-viscose and cotton blend at 650
              GSM, so they&apos;re dense and soft underhand but quick to dry on
              the rail. They&apos;re made in Thailand by a mill we work with
              directly, and we label them plainly: what they&apos;re made of,
              how they wash, nothing dressed up. No miracle claims. Just a
              genuinely good towel — and a calmer few minutes in your day.
            </p>

            <div className="mt-9 flex items-center gap-3.5 border-t border-bone/15 pt-7">
              <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-gradient-to-br from-terracotta to-sand font-display font-bold text-white">
                S
              </span>
              <div>
                <b className="block text-[15px]">The Saltmist team</b>
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
