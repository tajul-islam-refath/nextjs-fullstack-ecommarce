import { auth as getAuth } from '@/auth';
import { redirect } from 'next/navigation';

/**
 * Get the current session in server components
 */
export const getServerSession = async () => {
  return await getAuth();
};

/**
 * Require authentication or redirect to signin
 * Use this in server components that require authentication
 */
export const requireAuth = async () => {
  const session = await getAuth();
  
  if (!session?.user) {
    redirect('/signin');
  }
  
  return session;
};

// Re-export auth functions for convenience
export { signIn, signOut } from 'next-auth/react';
export { auth } from '@/auth';
