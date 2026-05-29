import type { ComponentType, SVGProps } from "react";
import {
  NoBleachIcon,
  NoSoftenerIcon,
  TumbleIcon,
  WashColdIcon,
} from "./icons";
import { Reveal } from "./Reveal";

interface CareItem {
  readonly Icon: ComponentType<SVGProps<SVGSVGElement>>;
  readonly title: string;
  readonly text: string;
}

const ITEMS: readonly CareItem[] = [
  {
    Icon: WashColdIcon,
    title: "Wash cold",
    text: "Machine wash cold (≤30°C) on a gentle cycle with like colours.",
  },
  {
    Icon: TumbleIcon,
    title: "Tumble low",
    text: "Tumble dry low to fluff the loops, or line dry in the shade.",
  },
  {
    Icon: NoSoftenerIcon,
    title: "Skip the softener",
    text: "No fabric softener — it coats the fibres and reduces absorbency.",
  },
  {
    Icon: NoBleachIcon,
    title: "No bleach",
    text: "Avoid bleach and warm iron only if needed. Wash separately first time.",
  },
];

/**
 * Care, de-centred and set as a numbered editorial register rather than a tidy
 * card grid: a narrow masthead column on the left, then the four habits running
 * as a left-aligned numbered list under one shared heavy rule. Each line carries
 * a hand-numbered marker (01–04) and the matching care symbol as a small, quiet
 * mark beside the title — not a row of identical shadowed icon-cards. The rows
 * are deliberately uneven (a wider measure on the first), so it reads like a
 * care card laid out by a designer, not a 2×2 template.
 */
export function Care() {
  return (
    <section className="section" id="care">
      <div className="wrap-wide">
        <div className="grid grid-cols-12 gap-x-16 gap-y-12">
          <Reveal className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-[100px]">
              <p className="index-tag mb-5 flex items-center gap-3">
                <b>04</b>
                <span className="h-px w-9 bg-ink-40" aria-hidden="true" />
                Care
              </p>
              <h2 className="display-lg max-w-[7ch] font-semibold">
                Keep them plush.
              </h2>
              <p className="mt-6 max-w-[34ch] text-[15px] text-ink-70">
                A few simple habits keep the loops soft and the absorbency high.
                It&apos;s all on the care label, too.
              </p>
            </div>
          </Reveal>

          <Reveal className="col-span-12 lg:col-span-8">
            <ol className="m-0 list-none border-t-2 border-ink/80 p-0">
              {ITEMS.map(({ Icon, title, text }, i) => (
                <li
                  key={title}
                  className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 border-b border-line py-7 sm:gap-x-10"
                >
                  <span
                    className="font-display text-[clamp(28px,4vw,40px)] font-normal italic leading-none text-ink/20"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={i === 0 ? "max-w-[52ch]" : "max-w-[44ch]"}>
                    <h3 className="flex items-center gap-2.5 font-sans text-[19px] font-bold">
                      {title}
                      <Icon
                        className="h-[18px] w-[18px] flex-none text-terracotta opacity-80"
                        aria-hidden="true"
                      />
                    </h3>
                    <p className="m-0 mt-1.5 text-[14.5px] leading-relaxed text-ink-70">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-9 max-w-[60ch] text-[13.5px] text-ink-55">
              Full care symbols and fibre content are printed on every sewn-in
              label, in line with Australian care-labelling requirements.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
