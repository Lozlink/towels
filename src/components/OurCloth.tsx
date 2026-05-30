import {
  ABSORBENCY_MULTIPLE_PLACEHOLDER,
  SUBSTANTIATED_CLAIMS,
  type SubstantiatedClaimKey,
} from "@/lib/claims";
import { Reveal } from "./Reveal";

/**
 * "Our cloth", art-directed:
 *  - a large macro-weave fabric field on the left that sticks while the
 *    editorial copy scrolls past it (split ~48/52)
 *  - specs woven into the prose as a running line, not a config widget
 *  - the three cloth notes set type-led, with small numeric markers rather than
 *    icon tiles
 *  - a GATED "tested properties" rail: each entry is bound to a flag in
 *    src/lib/claims.ts and renders ONLY when that flag is true. With the shipped
 *    all-false defaults, the entire rail collapses to nothing — no antibacterial,
 *    UV, hypoallergenic, antistatic, anti-scratch, anti-fungal, absorbency
 *    multiple, or competitor "toxic process" copy reaches the page, metadata, or
 *    JSON-LD. The copy lives here, conditionally, so flipping a verified flag
 *    turns it on with no re-authoring.
 */
interface GatedClaim {
  readonly key: Exclude<
    SubstantiatedClaimKey,
    "absorbencyMultiple" | "competitorProcessContrast"
  >;
  readonly label: string;
}

const GATED_CLAIMS: readonly GatedClaim[] = [
  { key: "antibacterial", label: "Naturally antibacterial" },
  { key: "antifungal", label: "Anti-fungal" },
  { key: "uvResistant", label: "UV resistant" },
  { key: "hypoallergenic", label: "Hypoallergenic" },
  { key: "antistatic", label: "Antistatic" },
  { key: "antiScratch", label: "Anti-scratch (low pilling)" },
];

const NOTES = [
  {
    n: "i",
    title: "100% bamboo fibre, unblended",
    text: "One fibre, start to finish — no viscose, no cotton, no polyester quietly blended in. Soft against skin and breathable.",
  },
  {
    n: "ii",
    title: "Naturally absorbent, quick to dry",
    text: "Bamboo fibre is naturally absorbent. An open, airy weave drinks water fast, then dries on the rail between uses.",
  },
  {
    n: "iii",
    title: "Biodegradable, renewable",
    text: "Made from a fast-growing, renewable plant, and biodegradable at end of life — so the cloth returns to where it came from.",
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
              <h2 className="display-lg max-w-[14ch] font-extrabold">
                One plant.{" "}
                <span className="fr-italic font-normal text-terracotta">
                  One cloth.
                </span>
              </h2>
              <p className="mt-7 max-w-[52ch] text-[19px] leading-relaxed text-ink-70 max-[680px]:text-[17px]">
                We wove the whole range from a single fibre — 100% bamboo,
                unblended. No viscose, no cotton, no polyester. What you feel in
                the hand is bamboo, and nothing else.
              </p>

              {/* Specs woven as a running line, not a widget. */}
              <p className="mt-9 border-y border-line py-5 font-display text-[clamp(17px,2vw,22px)] leading-snug text-ink">
                <b className="text-terracotta">100%</b> bamboo fibre
                <span className="px-2.5 text-ink-40">·</span>
                <b className="text-terracotta">0%</b> blend
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

              {/*
                GATED tested-properties rail. Every chip is bound to a flag in
                src/lib/claims.ts; nothing renders until the owner enables a flag
                against documented evidence (see CLAIMS.md). All-false by default
                → this block produces no output.
              */}
              {(() => {
                const enabled = GATED_CLAIMS.filter(
                  (c) => SUBSTANTIATED_CLAIMS[c.key],
                );
                const showAbsorbency = SUBSTANTIATED_CLAIMS.absorbencyMultiple;
                if (enabled.length === 0 && !showAbsorbency) return null;
                return (
                  <div className="mt-10 border-t border-line pt-7">
                    <p className="index-tag mb-4">Independently tested</p>
                    <ul className="flex flex-wrap gap-2.5">
                      {enabled.map((c) => (
                        <li
                          key={c.key}
                          className="rounded-full border border-mist/40 bg-mist/10 px-3.5 py-1.5 text-[13px] font-semibold text-terracotta"
                        >
                          {c.label}
                        </li>
                      ))}
                      {showAbsorbency ? (
                        <li className="rounded-full border border-mist/40 bg-mist/10 px-3.5 py-1.5 text-[13px] font-semibold text-terracotta">
                          {ABSORBENCY_MULTIPLE_PLACEHOLDER} more absorbent than
                          cotton
                        </li>
                      ) : null}
                    </ul>
                    <p className="mt-3 text-[12.5px] text-ink-55">
                      Each property above is backed by an independent test report
                      on file.
                    </p>
                  </div>
                );
              })()}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
