import { apiConfig, cacheConfig } from "@/lib/config";

export async function fetchCategories(
  page: string | number,
  limit: string | number
) {
  const apiUrl = `${apiConfig.baseUrl}${apiConfig.endpoints.categories}?page=${page}&limit=${limit}`;

  const response = await fetch(apiUrl, {
    next: {
      tags: cacheConfig.categories.tags,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchAllCategories() {
  // Fetch a large number of categories for dropdowns
  // Using limit=100 as per validation schema max
  return fetchCategories(1, 100);
}
