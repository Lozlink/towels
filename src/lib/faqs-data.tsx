import { SUBSTANTIATED_CLAIMS } from "./claims";
import type { Faq } from "./faqs";

/**
 * FAQ content for ZYNZYA.
 * `answer` is the richer on-page JSX; `schema` holds the canonical plain-text
 * Q&A used for FAQPage structured data.
 *
 * The flagship trust question — "Is it really 100% bamboo — not viscose?" —
 * stays FIRST. It is the brand's whole point and is answered plainly, grounded
 * in the fibre composition the supplier can document. It deliberately makes NO
 * gated claim (antibacterial, UV, hypoallergenic, absorbency multiples, or any
 * competitor "toxic process" knock) — those are gated behind
 * src/lib/claims.ts and only surface when the owner holds the evidence.
 */
export const FAQS: readonly Faq[] = [
  {
    id: "really-bamboo-not-viscose",
    question: "Is it really 100% bamboo — not viscose?",
    answer: (
      <>
        <p>
          Yes. ZYNZYA towels are{" "}
          <strong>100% bamboo fibre, unblended</strong> — no viscose, no cotton,
          no polyester. That&apos;s the whole reason the brand exists, and
          it&apos;s printed on every label.
        </p>
        <p>
          It&apos;s worth knowing why we keep saying it. A lot of &ldquo;bamboo&rdquo;
          fabric on the market is actually bamboo <em>viscose</em> (rayon): the
          plant is chemically dissolved and regenerated into a different fibre.
          That&apos;s a legitimate textile, but it isn&apos;t the same thing as
          natural bamboo fibre, and we don&apos;t sell it. Our composition is
          verified against the supplier&apos;s fibre documentation, and we&apos;d
          rather earn your trust on this one point than over-claim on a dozen
          others.
        </p>
        {/*
          GATED competitor-process contrast. Renders ONLY when
          SUBSTANTIATED_CLAIMS.competitorProcessContrast is true (it ships false),
          because knocking competitors' "toxic process" needs documented, current
          evidence about those competitors — see CLAIMS.md.
        */}
        {SUBSTANTIATED_CLAIMS.competitorProcessContrast ? (
          <p>
            By contrast, the viscose process many other &ldquo;bamboo&rdquo;
            towels rely on uses a harsher chemical route to dissolve and
            regenerate the fibre. Ours doesn&apos;t.
          </p>
        ) : null}
      </>
    ),
    schema: {
      question: "Is it really 100% bamboo — not viscose?",
      answer:
        "Yes. ZYNZYA towels are 100% bamboo fibre, unblended — no viscose, no cotton, no polyester — and that is printed on every label. Much 'bamboo' fabric on the market is actually bamboo viscose (rayon), where the plant is chemically dissolved and regenerated into a different fibre. That is a legitimate textile but it is not natural bamboo fibre, and we do not sell it. Our composition is verified against the supplier's fibre documentation.",
    },
  },
  {
    id: "why-bamboo",
    question: "Why bamboo instead of cotton?",
    answer: (
      <p>
        Bamboo fibre is soft and breathable in the hand and naturally absorbent,
        which is exactly what you want in a towel. It also comes from a
        fast-growing, renewable plant and is biodegradable at the end of its
        life. We weave it to 650 GSM so the towel is substantial and plush
        without relying on a cotton or synthetic blend to get there.
      </p>
    ),
    schema: {
      question: "Why bamboo instead of cotton?",
      answer:
        "Bamboo fibre is soft, breathable and naturally absorbent — what you want in a towel. It comes from a fast-growing, renewable plant and is biodegradable at end of life. We weave it to 650 GSM so the towel is substantial and plush without a cotton or synthetic blend.",
    },
  },
  {
    id: "what-is-gsm",
    question: "What does 650 GSM actually mean for me?",
    answer: (
      <p>
        GSM is grams per square metre — the weight, and a good proxy for density
        and plushness. Hotel-style towels typically sit around 500–700 GSM. At
        650 GSM ours are firmly in the plush band: substantial and cushioned
        underhand, while the weave keeps them quick to dry rather than sodden and
        heavy.
      </p>
    ),
    schema: {
      question: "What does 650 GSM actually mean for me?",
      answer:
        "GSM is grams per square metre — a proxy for density and plushness. Hotel-style towels sit around 500–700 GSM. At 650 GSM ours are firmly in the plush band: substantial underhand, while the weave keeps them quick to dry.",
    },
  },
  {
    id: "where-made",
    question: "Where are they made?",
    answer: (
      <p>
        Designed in Australia, made in Thailand by a mill we work with directly.
        We state this plainly on the product and the label — we never imply
        Australian manufacture.
      </p>
    ),
    schema: {
      question: "Where are they made?",
      answer:
        "Designed in Australia, made in Thailand by a mill we work with directly. We state this plainly on the product and the label — we never imply Australian manufacture.",
    },
  },
  {
    id: "how-to-wash",
    question: "How should I wash them?",
    answer: (
      <p>
        Machine wash cold on a gentle cycle, tumble dry low or line dry in the
        shade, and skip the fabric softener — it coats the fibres and reduces
        absorbency. Avoid bleach. A first wash before use helps the loops fluff
        up. Full care symbols are on the sewn-in label.
      </p>
    ),
    schema: {
      question: "How should I wash them?",
      answer:
        "Machine wash cold on a gentle cycle, tumble dry low or line dry in the shade, and skip the fabric softener. Avoid bleach. A first wash before use helps the loops fluff up. Full care symbols are on the sewn-in label.",
    },
  },
  {
    id: "shipping-returns",
    question: "What's shipping and returns like?",
    answer: (
      <p>
        Flat-rate AU shipping, and it&apos;s <strong>free on orders over $99</strong>.
        Most metro orders arrive in 2–5 business days. Not the right fit? Return
        unused, unwashed towels in original packaging within 30 days for a refund
        or exchange. Change-of-mind returns are on us for orders over $99.
      </p>
    ),
    schema: {
      question: "What's shipping and returns like?",
      answer:
        "Flat-rate AU shipping, free on orders over $99. Most metro orders arrive in 2–5 business days. Return unused, unwashed towels in original packaging within 30 days for a refund or exchange.",
    },
  },
  {
    id: "which-size",
    question: "Which size should I get?",
    answer: (
      <p>
        The Everyday Bath Towel (70 × 140 cm) suits most people for daily use.
        Prefer to wrap right around? Size up to the Bath Sheet (90 × 170 cm). The
        Complete Bundle is the easiest way to kit out a whole bathroom — and the
        best value.
      </p>
    ),
    schema: {
      question: "Which size should I get?",
      answer:
        "The Everyday Bath Towel (70 x 140 cm) suits most people for daily use. Size up to the Bath Sheet (90 x 170 cm) to wrap right around. The Complete Bundle is the easiest way to kit out a whole bathroom.",
    },
  },
];
