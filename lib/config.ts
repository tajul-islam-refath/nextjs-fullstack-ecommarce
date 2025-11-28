/**
 * Application Configuration
 *
 * Centralized configuration for the application
 * Environment variables and constants
 */

/**
 * Get the base URL for the application
 * Uses NEXT_PUBLIC_APP_URL in production, falls back to localhost in development
 */
export const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Development fallback
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

/**
 * API Configuration
 */
export const apiConfig = {
  baseUrl: getBaseUrl(),
  endpoints: {
    categories: "/api/categories",
    categoriesRevalidate: "/api/categories/revalidate",
    products: "/api/products",
  },
} as const;

/**
 * Cache Configuration
 */
export const cacheConfig = {
  categories: {
    revalidate: 3600, // 1 hour in seconds
    tags: ["categories"],
  },
  products: {
    revalidate: 3600, // 1 hour in seconds
    tags: ["products"],
  },
};

/**
 * Pagination Configuration
 */
export const paginationConfig = {
  defaultPage: 1,
  defaultLimit: 10,
  maxLimit: 100,
};

/**
 * Currency Configuration
 */
export const currencyConfig = {
  symbol: "৳",
  code: "BDT",
  locale: "en-BD",
};
