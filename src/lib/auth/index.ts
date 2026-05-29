/**
 * Admin auth — public surface. Import from `@/lib/auth` rather than reaching
 * into individual files.
 *
 * This module gates ONLY the internal admin area. Customer/guest checkout is
 * never authenticated. See README "Admin auth".
 */
export { ADMIN_COOKIE_NAME, SESSION_TTL_SECONDS } from '@/lib/auth/config';
export {
  type AdminSession,
  createAdminSession,
  verifyAdminSession,
} from '@/lib/auth/session';
export { setAdminCookie, clearAdminCookie } from '@/lib/auth/cookies';
export { verifyAdminCredentials } from '@/lib/auth/credentials';
export { type AdminGuardResult, requireAdmin } from '@/lib/auth/guard';
