import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { SignInFormData } from '@/lib/validations/auth';

/**
 * Custom hook for sign-in logic
 * Following Single Responsibility Principle - handles only sign-in business logic
 * Separates concerns from UI presentation
 */
export function useSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const urlError = searchParams.get('error');

  const handleSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
        return { success: false };
      }

      // Get callback URL or default to admin
      const callbackUrl = searchParams.get('callbackUrl') || '/admin';
      router.push(callbackUrl);
      router.refresh();
      
      return { success: true };
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
      return { success: false };
    }
  };

  return {
    handleSignIn,
    isLoading,
    error: error || urlError,
  };
}
