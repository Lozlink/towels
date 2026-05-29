import { type NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminSession } from '@/lib/auth';

/**
 * GET /api/admin/session
 * Lightweight check used by the admin UI to decide whether to render the
 * dashboard or bounce to login. Returns `{ authenticated: boolean }`.
 */
export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminSession(token);
  return NextResponse.json({ authenticated: session !== null });
}
