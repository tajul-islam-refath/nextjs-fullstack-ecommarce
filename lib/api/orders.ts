import { apiConfig } from "@/lib/config";
import { TAGS } from "../constains";

/**
 * Fetch orders with given query parameters.
 * Params can include pagination, filters, etc.
 */
export async function fetchOrders(params: Record<string, string | number>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }
  const apiUrl = `${apiConfig.baseUrl}${
    apiConfig.endpoints.orders
  }?${query.toString()}`;

  const response = await fetch(apiUrl, {
    cache: "force-cache",
    next: {
      tags: [TAGS.ORDER],
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }

  return response.json();
}
