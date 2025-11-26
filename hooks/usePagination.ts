"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

/**
 * Custom hook for URL-based pagination
 *
 * Handles page changes and items per page changes by updating URL search params
 * Works with Next.js server components for automatic re-fetching
 *
 * @param totalPages - Total number of pages available
 * @param currentLimit - Current items per page
 * @returns Object containing isPending state, handlePageChange, and handleLimitChange functions
 *
 * @example
 * ```tsx
 * const { isPending, handlePageChange, handleLimitChange } = usePagination(
 *   pagination.totalPages,
 *   pagination.limit
 * );
 * ```
 */
export function usePagination(totalPages: number, currentLimit: number) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > totalPages) return;

      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        params.set("limit", currentLimit.toString());
        router.push(`?${params.toString()}`);
      });
    },
    [router, searchParams, totalPages, currentLimit]
  );

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        // Reset to page 1 when changing limit
        params.set("page", "1");
        params.set("limit", newLimit.toString());
        router.push(`?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  return {
    isPending,
    handlePageChange,
    handleLimitChange,
  };
}
