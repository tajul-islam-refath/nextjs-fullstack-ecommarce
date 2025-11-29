import { apiConfig } from "@/lib/config";
import { TAGS } from "../constains";
import { cookies } from "next/headers";

/**
 * Fetch products with given query parameters.
 * Params can include pagination, filters, sorting, etc.
 */
export async function fetchProducts(params: Record<string, string | number>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }
  const apiUrl = `${apiConfig.baseUrl}${
    apiConfig.endpoints.products
  }?${query.toString()}`;

  const cookieStore = await cookies();

  const response = await fetch(apiUrl, {
    cache: "force-cache",
    credentials: "include",
    headers: {
      Cookie: cookieStore.toString(),
    },
    next: {
      tags: [TAGS.PRODUCT],
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
}
