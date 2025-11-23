import { z } from 'zod';

/**
 * Sign-in form validation schema
 * Following Single Responsibility Principle - only validates sign-in data
 */
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

/**
 * Type inference from schema
 */
export type SignInFormData = z.infer<typeof signInSchema>;
