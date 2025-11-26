import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard';

/**
 * Admin Layout
 * 
 * Wraps all admin pages with authentication check and dashboard layout.
 * Uses composition pattern with DashboardLayout component.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect to sign in if not authenticated
  if (!session?.user) {
    redirect('/signin');
  }

  // Extract user data for dashboard
  const user = {
    email: session.user.email || '',
    role: (session.user as any).role || 'admin',
    image: session.user.image,
  };

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
