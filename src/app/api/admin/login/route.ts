import { type NextRequest, NextResponse } from 'next/server';
import {
  createAdminSession,
  setAdminCookie,
  verifyAdminCredentials,
} from '@/lib/auth';
import { createLogger } from '@/lib/utils/logger';

const log = createLogger('api/admin/login');

/**
 * POST /api/admin/login
 * Body: { username: string, password: string }
 * On valid credentials, signs an admin JWT and sets it as the `zy_admin`
 * httpOnly cookie. Returns `{ success: true }`, or `401 { error }` on bad creds.
 * Fails closed (401, not 500) when auth env vars are missing.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { username, password } = parseLoginBody(body);
  if (username === null || password === null) {
    return NextResponse.json(
      { error: 'username and password are required.' },
      { status: 400 },
    );
  }

  try {
    const valid = await verifyAdminCredentials(username, password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const token = await createAdminSession({ username });
    if (!token) {
      // Secret not configured — fail closed but don't leak why to the client.
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    log.log('Admin login succeeded for', username);
    return setAdminCookie(NextResponse.json({ success: true }), token);
  } catch (err) {
    log.error('Unhandled error during admin login', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/** Narrow the JSON body to two trimmed non-empty strings, or nulls. */
function parseLoginBody(body: unknown): {
  username: string | null;
  password: string | null;
} {
  if (typeof body !== 'object' || body === null) {
    return { username: null, password: null };
  }
  const record = body as Record<string, unknown>;
  const username =
    typeof record['username'] === 'string' && record['username'].trim().length > 0
      ? record['username'].trim()
      : null;
  const password =
    typeof record['password'] === 'string' && record['password'].length > 0
      ? record['password']
      : null;
  return { username, password };
}
