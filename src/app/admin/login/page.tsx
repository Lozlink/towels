'use client';

import { type FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Admin login page. Posts credentials to `/api/admin/login`, which sets the
 * httpOnly `sm_admin` cookie on success, then routes to the dashboard. This
 * page is exempt from the middleware redirect (see `src/middleware.ts`).
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        // Full navigation so middleware re-evaluates the fresh cookie.
        router.replace('/admin');
        router.refresh();
        return;
      }
      const data: unknown = await res.json().catch(() => null);
      const message =
        typeof data === 'object' &&
        data !== null &&
        typeof (data as Record<string, unknown>)['error'] === 'string'
          ? ((data as Record<string, unknown>)['error'] as string)
          : 'Login failed.';
      setError(message);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: '#f7f6f3',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 360,
          background: '#fff',
          border: '1px solid #e6e3dd',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
          Saltmist admin
        </h1>
        <p style={{ marginTop: 4, marginBottom: '1.5rem', color: '#6b6760', fontSize: '0.875rem' }}>
          Sign in to manage orders.
        </p>

        <label style={labelStyle} htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />

        <label style={{ ...labelStyle, marginTop: '1rem' }} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {error ? (
          <p style={{ color: '#b42318', fontSize: '0.8125rem', marginTop: '0.75rem' }}>
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={submitting} style={buttonStyle}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: '#3a372f',
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.5rem 0.625rem',
  border: '1px solid #d6d2ca',
  borderRadius: 8,
  fontSize: '0.9375rem',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  marginTop: '1.5rem',
  padding: '0.625rem',
  border: 'none',
  borderRadius: 8,
  background: '#2b6cb0',
  color: '#fff',
  fontSize: '0.9375rem',
  fontWeight: 600,
  cursor: 'pointer',
};
