import { auth } from "@/auth";

/**
 * Standard action result type for consistent error handling
 * 
 * Usage:
 * ```typescript
 * const result = await someAction();
 * if (result.success) {
 *   // Handle success: result.data
 * } else {
 *   // Handle error: result.error
 * }
 * ```
 */
export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Higher-order function to protect server actions with admin authentication
 * 
 * @param actionFn - The server action to protect
 * @returns Protected action that checks for admin role
 * 
 * @example
 * ```typescript
 * export const deleteUser = withAdmin(async (id: string) => {
 *   // This code only runs if user is authenticated as admin
 *   await prisma.user.delete({ where: { id } });
 *   return { success: true, data: { message: 'User deleted' } };
 * });
 * ```
 */
export function withAdmin<TArgs extends any[], TResult>(
  actionFn: (...args: TArgs) => Promise<TResult>
) {
  return async function (...args: TArgs): Promise<TResult> {
    const session = await auth();

    if (!session?.user || (session.user as any).role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    return actionFn(...args);
  };
}
