/**
 * Pagination parameter types
 * Reusable across all paginated endpoints
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Generic paginated response structure
 * Follows consistent API response pattern
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Pagination metadata calculation helper
 */
export function createPaginationMetadata(
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
}
