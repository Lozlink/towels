/**
 * Substantiation gate for ZYNZYA product claims.
 *
 * Every flag here is a RISKY claim that cannot be made publicly until the owner
 * holds specific evidence for it (see CLAIMS.md at the project root for the
 * legal basis and the exact substantiation each one requires).
 *
 * ALL FLAGS DEFAULT TO `false`. With the shipped defaults, none of the gated
 * copy renders anywhere — not on the page, not in metadata, not in JSON-LD.
 *
 * To enable a claim once the evidence is in hand, flip its flag to `true` here
 * and re-deploy. The gated copy already lives (conditionally rendered) in the
 * components, so flipping a flag turns it on with no further code changes.
 *
 * Do NOT enable a flag without the documented substantiation on file. These are
 * the claims most likely to attract ACCC / greenwashing scrutiny (s18 & s29
 * misleading-conduct provisions, ACL) and the FTC bamboo-textile precedent.
 */
export const SUBSTANTIATED_CLAIMS = {
  /** "Naturally antibacterial" — needs ISO 20743 / AATCC 100 on the finished fabric. */
  antibacterial: false,
  /** "Anti-fungal" — needs AATCC 30 (or equivalent) antifungal test report. */
  antifungal: false,
  /** "UV resistant" — needs an AS/NZS 4399 UPF rating on the finished fabric. */
  uvResistant: false,
  /** "Hypoallergenic" — needs dermatological / patch-test evidence. */
  hypoallergenic: false,
  /** "Antistatic" — needs a standardised antistatic / surface-resistivity test. */
  antistatic: false,
  /** "Anti-scratch / non-pilling" — needs an abrasion / pilling test (e.g. Martindale). */
  antiScratch: false,
  /** Any "Nx more absorbent than cotton" figure — needs a standardised absorbency test vs a cotton control. */
  absorbencyMultiple: false,
  /** "Other bamboo towels use a toxic process" comparison — needs documented, current evidence about competitors. */
  competitorProcessContrast: false,
} as const;

export type SubstantiatedClaimKey = keyof typeof SUBSTANTIATED_CLAIMS;

/** Narrow helper so components read intent clearly: `isClaimEnabled("antibacterial")`. */
export function isClaimEnabled(key: SubstantiatedClaimKey): boolean {
  return SUBSTANTIATED_CLAIMS[key];
}

/**
 * Placeholder the client fills from a REAL standardised test once
 * `absorbencyMultiple` is enabled. Never hard-code a fabricated multiple
 * (e.g. the unsubstantiated "300x") anywhere in the codebase.
 */
export const ABSORBENCY_MULTIPLE_PLACEHOLDER = "[Nx — pending test]" as const;
