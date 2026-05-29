import { AdminDashboard } from '@/components/admin/AdminDashboard';

/**
 * Protected admin dashboard. The page itself is gated by `src/middleware.ts`
 * (cookie check + redirect to `/admin/login`); the API it calls is
 * independently gated by `requireAdmin`. All interactivity lives in the client
 * `AdminDashboard` component.
 */
export default function AdminPage() {
  return <AdminDashboard />;
}
