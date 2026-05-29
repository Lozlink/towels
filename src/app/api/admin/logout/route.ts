import { NextResponse } from 'next/server';
import { clearAdminCookie } from '@/lib/auth';

/**
 * POST /api/admin/logout
 * Clears the `sm_admin` cookie. Always returns `{ success: true }` (idempotent).
 */
export async function POST() {
  return clearAdminCookie(NextResponse.json({ success: true }));
}
