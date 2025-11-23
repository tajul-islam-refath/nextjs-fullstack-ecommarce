import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { authConfig } from './auth.config';
import prisma from '@/lib/prisma';

/**
 * Full auth instance with Prisma adapter
 * Use this in API routes and server components (Node.js runtime)
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
});
