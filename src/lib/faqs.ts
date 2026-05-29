import type { ReactNode } from "react";

export interface Faq {
  /** Stable id, used for accordion aria wiring. */
  readonly id: string;
  /** Question shown on-page (the accordion trigger). */
  readonly question: string;
  /** Rendered answer body for the on-page accordion. */
  readonly answer: ReactNode;
  /**
   * Plain-text question/answer for FAQPage JSON-LD. The on-page question is
   * slightly more conversational; structured data uses the canonical phrasing
   * from the source so search results stay clean.
   */
  readonly schema: {
    readonly question: string;
    readonly answer: string;
  };
}
