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
    orders: "/api/orders",
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

/**
 * Order Configuration
 */
export const orderConfig = {
  /**
   * Valid order statuses
   */
  statuses: {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
  } as const,

  /**
   * Valid payment statuses
   */
  paymentStatuses: {
    PENDING: "PENDING",
    PAID: "PAID",
    FAILED: "FAILED",
    REFUNDED: "REFUNDED",
  } as const,

  /**
   * Order status display information
   */
  statusDisplay: {
    PENDING: {
      label: "Pending",
      description: "Order is pending confirmation",
      color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
    },
    PROCESSING: {
      label: "Processing",
      description: "Order is being processed",
      color: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
    },
    SHIPPED: {
      label: "Shipped",
      description: "Order has been shipped",
      color: "bg-purple-100 text-purple-800 hover:bg-purple-100/80",
    },
    DELIVERED: {
      label: "Delivered",
      description: "Order has been delivered",
      color: "bg-green-100 text-green-800 hover:bg-green-100/80",
    },
    CANCELLED: {
      label: "Cancelled",
      description: "Order has been cancelled",
      color: "bg-red-100 text-red-800 hover:bg-red-100/80",
    },
  } as const,
} as const;

/**
 * Helper to get all valid order status values as an array
 */
export const getOrderStatuses = () =>
  Object.values(orderConfig.statuses) as string[];

/**
 * Helper to get all valid payment status values as an array
 */
export const getPaymentStatuses = () =>
  Object.values(orderConfig.paymentStatuses) as string[];
