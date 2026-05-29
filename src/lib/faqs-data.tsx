import type { Faq } from "./faqs";

/**
 * FAQ content ported verbatim from the static storefront.
 * `answer` is the richer on-page JSX; `schema` holds the canonical plain-text
 * Q&A used for FAQPage structured data. The honest rayon answer stays first.
 */
export const FAQS: readonly Faq[] = [
  {
    id: "bamboo-or-rayon",
    question: "Is this bamboo or rayon? Tell me straight.",
    answer: (
      <>
        <p>
          Straight answer: it&apos;s bamboo <strong>viscose</strong> — a
          regenerated fibre made from bamboo, blended with cotton. Our exact
          composition is <strong>70% bamboo viscose, 30% cotton</strong>, and
          it&apos;s printed on every label.
        </p>
        <p>
          You&apos;ll see some brands call this &ldquo;bamboo fabric&rdquo; or
          imply it stays naturally antibacterial. We don&apos;t, because the
          manufacturing process changes the fibre and those claims aren&apos;t
          ones we can substantiate. What we can stand behind is how it feels:
          soft, plush, highly absorbent and quick-drying. That&apos;s what
          you&apos;re buying, and that&apos;s what we&apos;ll tell you.
        </p>
      </>
    ),
    schema: {
      question: "Is this bamboo or rayon?",
      answer:
        "It is bamboo viscose — a regenerated fibre made from bamboo, blended with cotton. Our exact composition is 70% bamboo viscose, 30% cotton, printed on every label. We don't claim it is naturally antibacterial, because the manufacturing process changes the fibre and those claims aren't ones we can substantiate. What we stand behind is how it feels: soft, plush, highly absorbent and quick-drying.",
    },
  },
  {
    id: "why-bamboo-viscose",
    question: "Why bamboo viscose instead of plain cotton?",
    answer: (
      <p>
        It&apos;s a feel and performance choice, not an eco claim. The
        bamboo-viscose blend has a fluid, cushioned softness in the hand and an
        open weave that dries quickly on the rail. The 30% cotton adds body and
        absorbency. Together they hit the 650 GSM plushness we were after
        without feeling heavy or slow to dry.
      </p>
    ),
    schema: {
      question: "Why bamboo viscose instead of plain cotton?",
      answer:
        "It's a feel and performance choice, not an eco claim. The bamboo-viscose blend has a fluid, cushioned softness and an open weave that dries quickly. The 30% cotton adds body and absorbency, hitting 650 GSM plushness without feeling heavy or slow to dry.",
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
