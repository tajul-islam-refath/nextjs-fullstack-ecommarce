"use server";

import { auth } from "@/lib/auth";

export function withAdmin<TArgs extends any[], TResult>(
  actionFn: (...args: TArgs) => Promise<TResult>
) {
  return async function (...args: TArgs): Promise<TResult> {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Forbidden");
    }

    return actionFn(...args);
  };
}
