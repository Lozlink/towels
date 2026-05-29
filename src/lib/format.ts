/** Format a whole-dollar AUD amount the way the source did: "$1,149". */
export function formatAud(amount: number): string {
  return `$${amount.toLocaleString("en-AU")}`;
}

/**
 * Money helper for the order pipeline. Server-side totals are computed and
 * stored in integer cents to avoid float drift; this formats those cents back
 * to a display string like "$108.95".
 */
export function formatAudCents(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Convert a whole-dollar catalogue price to integer cents. */
export function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}
