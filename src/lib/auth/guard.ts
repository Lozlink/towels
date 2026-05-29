import { type NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/auth/config';
import { type AdminSession, verifyAdminSession } from '@/lib/auth/session';

/**
 * Result of an admin guard check. Discriminated on `ok` so callers narrow
 * without casts: on success you get the session, on failure a ready 401.
 */
export type AdminGuardResult =
  | { readonly ok: true; readonly session: AdminSession }
  | { readonly ok: false; readonly response: NextResponse };

const UNAUTHORIZED = () =>
  NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

/**
 * Route-handler guard. Reads the admin cookie, verifies the JWT, and returns
 * either the session or a 401 response. Usage:
 *
 *   const auth = await requireAdmin(request);
 *   if (!auth.ok) return auth.response;
 *   // auth.session.username is now available
 */
export async function requireAdmin(
  request: NextRequest,
): Promise<AdminGuardResult> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminSession(token);
  if (!session) return { ok: false, response: UNAUTHORIZED() };
  return { ok: true, session };
}
