/**
 * A single quiet running line in place of the old stat trust-strip.
 * Pure editorial cadence — sensory and spec phrases only, all compliance-safe.
 * The track is duplicated for a seamless loop; the duplicate is aria-hidden and
 * the marquee pauses on hover. prefers-reduced-motion halts it via globals.css,
 * leaving a static, readable line.
 */
const PHRASES = [
  "100% bamboo fibre",
  "Unblended — no viscose, no cotton, no polyester",
  "Soft, breathable, naturally absorbent",
  "Biodegradable at end of life",
  "From a fast-growing, renewable plant",
  "Designed in Australia · Made in Thailand",
] as const;

function Run({ hidden = false }: { hidden?: boolean }) {
  return (
    <span
      className="inline-flex shrink-0 items-center"
      aria-hidden={hidden || undefined}
    >
      {PHRASES.map((phrase, i) => (
        <span key={`${phrase}-${i}`} className="inline-flex items-center">
          <span className="px-7 font-display text-[clamp(18px,2.4vw,26px)] font-medium text-bone max-[680px]:px-5">
            {phrase}
          </span>
          <span
            className="h-1.5 w-1.5 flex-none rounded-full bg-marigold"
            aria-hidden="true"
          />
        </span>
      ))}
    </span>
  );
}

export function TrustStrip() {
  return (
    <section className="bg-kelp py-6 text-bone" aria-label="What ZYNZYA towels are">
      <div className="marquee">
        <div className="marquee__track">
          <Run />
          <Run hidden />
        </div>
      </div>
    </section>
  );
}
