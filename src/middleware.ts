import { type NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminSession } from '@/lib/auth';

/**
 * Edge middleware that protects the admin *pages* (`/admin/*`). It verifies the
 * `sm_admin` JWT and redirects unauthenticated visitors to `/admin/login`.
 *
 * Scope is deliberately tight (see `config.matcher`): it ONLY runs on `/admin`
 * routes and never touches the storefront or the guest checkout under
 * `/api/orders`. The login page is exempted explicitly so users can reach it.
 *
 * API authorization is enforced separately by `requireAdmin` inside the admin
 * route handlers — middleware here is just for the page redirect UX.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow the login page through, else we'd redirect-loop.
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminSession(token);

  if (!session) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match only admin pages. Crucially excludes `/`, the storefront, and all
  // `/api/*` (including guest `/api/orders`) — those are never gated here.
  matcher: ['/admin/:path*'],
};
