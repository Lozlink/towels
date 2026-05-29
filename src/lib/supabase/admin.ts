import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client, mirroring the ANB shape (module-level singleton
 * with auth persistence disabled). Null-safe: if the env vars aren't set the
 * function returns null so callers can degrade gracefully and the app still
 * builds/runs without a database configured.
 */
let _admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null; // DB not configured -> caller degrades gracefully
  if (!_admin) {
    _admin = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _admin;
}
