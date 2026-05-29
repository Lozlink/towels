/**
 * Single source of truth for admin-auth configuration. Everything env-derived
 * lives here so the rest of the module reads cleanly and there are no magic
 * strings scattered across files.
 *
 * Deliberately simple: this gates ONLY the internal admin area. Customer/guest
 * checkout under `/api/orders` is never touched.
 */

/** Cookie that carries the signed admin session JWT. */
export const ADMIN_COOKIE_NAME = 'sm_admin';

/** Session lifetime. Mirrors the JWT `exp` and the cookie `maxAge`. */
export const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours

/** JWT signing algorithm — HS256 is symmetric and edge-compatible (middleware). */
export const JWT_ALG = 'HS256';

/** Stable subject/audience so tokens minted for other purposes can't be reused. */
export const JWT_SUBJECT = 'saltmist-admin';

/**
 * The HS256 signing secret as raw bytes, or `null` when `ADMIN_JWT_SECRET` is
 * unset. Returning null (rather than throwing) lets login fail *closed* with a
 * logged error instead of crashing the build/boot.
 */
export function getJwtSecret(): Uint8Array | null {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}
