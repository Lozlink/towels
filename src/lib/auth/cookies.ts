import type { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, SESSION_TTL_SECONDS } from '@/lib/auth/config';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/** Shared cookie attributes — httpOnly, lax, secure in prod, path-scoped to all. */
const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: 'lax' as const,
  path: '/',
};

/**
 * Write the signed admin session onto a response as an httpOnly cookie. Mutates
 * and returns the same response for fluent use in route handlers.
 */
export function setAdminCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}

/** Clear the admin session cookie (logout). */
export function clearAdminCookie(res: NextResponse): NextResponse {
  res.cookies.set(ADMIN_COOKIE_NAME, '', {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 0,
  });
  return res;
}
