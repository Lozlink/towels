import { createLogger } from '@/lib/utils/logger';

const log = createLogger('auth/credentials');

/**
 * Credential verification against environment variables. No native deps: we use
 * the Web Crypto SubtleCrypto API (available in Node 18+ and the edge runtime),
 * so this builds and runs identically everywhere `next build` does.
 *
 * Two ways to configure the password, in order of preference:
 *   1. ADMIN_PASSWORD_HASH — lowercase hex SHA-256 of the password (recommended;
 *      no plaintext secret in the environment).
 *   2. ADMIN_PASSWORD — plaintext (simplest; fine for a single internal admin).
 *
 * If both are set, the hash wins. The username is always ADMIN_USERNAME.
 *
 * Generate a hash:
 *   node -e "crypto.subtle.digest('SHA-256', new TextEncoder().encode(process.argv[1])).then(b=>console.log(Buffer.from(b).toString('hex')))" 'your-password'
 */

/** Lowercase hex SHA-256 of the input, via Web Crypto. */
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Constant-time-ish string compare. Avoids early-exit timing leaks by always
 * walking the longer length and XOR-accumulating. Length mismatch always fails.
 */
function timingSafeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let mismatch = a.length === b.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Validate a username/password pair against the configured admin credentials.
 * Returns `false` (fail closed, with a logged error) when credentials aren't
 * configured — never throws, never crashes the build.
 */
export async function verifyAdminCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;
  const expectedPlain = process.env.ADMIN_PASSWORD;

  if (!expectedUser || (!expectedHash && !expectedPlain)) {
    log.error(
      'Admin credentials not configured: set ADMIN_USERNAME and one of ADMIN_PASSWORD_HASH / ADMIN_PASSWORD.',
    );
    return false;
  }

  const userOk = timingSafeEqual(username, expectedUser);

  let passOk: boolean;
  if (expectedHash) {
    passOk = timingSafeEqual(
      await sha256Hex(password),
      expectedHash.trim().toLowerCase(),
    );
  } else {
    // expectedPlain is guaranteed defined by the guard above.
    passOk = timingSafeEqual(password, expectedPlain as string);
  }

  // Evaluate both regardless of the user result to avoid short-circuit timing.
  return userOk && passOk;
}
