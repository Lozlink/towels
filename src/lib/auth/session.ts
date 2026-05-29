import { SignJWT, jwtVerify } from 'jose';
import {
  JWT_ALG,
  JWT_SUBJECT,
  SESSION_TTL_SECONDS,
  getJwtSecret,
} from '@/lib/auth/config';
import { createLogger } from '@/lib/utils/logger';

const log = createLogger('auth/session');

/**
 * Claims we put in the admin session token. Intentionally minimal — there is a
 * single admin identity, so we only carry the username for display/auditing.
 */
export interface AdminSession {
  readonly username: string;
}

/**
 * Sign an admin session as an HS256 JWT (8h expiry). Returns `null` — never
 * throws — when `ADMIN_JWT_SECRET` is unset, so callers fail closed.
 */
export async function createAdminSession(
  session: AdminSession,
): Promise<string | null> {
  const secret = getJwtSecret();
  if (!secret) {
    log.error('Cannot sign admin session: ADMIN_JWT_SECRET is not set.');
    return null;
  }

  return new SignJWT({ username: session.username })
    .setProtectedHeader({ alg: JWT_ALG })
    .setSubject(JWT_SUBJECT)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secret);
}

/**
 * Verify a token and return its session claims, or `null` if the token is
 * missing, malformed, expired, or signed with the wrong key/subject. Safe to
 * call from middleware (edge runtime) — `jose` + Web Crypto only.
 */
export async function verifyAdminSession(
  token: string | undefined | null,
): Promise<AdminSession | null> {
  if (!token) return null;

  const secret = getJwtSecret();
  if (!secret) {
    log.error('Cannot verify admin session: ADMIN_JWT_SECRET is not set.');
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
      subject: JWT_SUBJECT,
    });
    const username = payload['username'];
    if (typeof username !== 'string' || username.length === 0) return null;
    return { username };
  } catch {
    // Expired / bad signature / malformed — all treated as "no session".
    return null;
  }
}
