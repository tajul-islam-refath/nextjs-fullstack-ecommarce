import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Extend the built-in session types to include custom properties
   */
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  /**
   * Extend the built-in user types to include custom properties
   */
  interface User {
    role: string;
  }
}

declare module '@auth/core/adapters' {
  /**
   * Extend the AdapterUser type to include custom properties
   * This is required for the PrismaAdapter to work correctly
   */
  interface AdapterUser {
    role: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extend the built-in JWT types to include custom properties
   */
  interface JWT {
    id: string;
    role: string;
  }
}
