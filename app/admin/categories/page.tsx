import { CategoryManagementClient } from "@/components/categories/CategoryManagementClient";
import { apiConfig, cacheConfig, paginationConfig } from "@/lib/config";

interface SearchParams {
  page?: string;
  limit?: string;
}

interface CategoriesPageProps {
  searchParams: Promise<SearchParams>;
}

async function fetchCategories(page: string, limit: string) {
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

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const params = await searchParams;
  const page = params.page || String(paginationConfig.defaultPage);
  const limit = params.limit || String(paginationConfig.defaultLimit);

  try {
    const result = await fetchCategories(page, limit);
    return (
      <CategoryManagementClient
        initialCategories={result.data}
        initialPagination={result.pagination}
      />
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Error Loading Categories
          </h2>
          <p className="text-slate-600">
            {error instanceof Error
              ? error.message
              : "Failed to load categories"}
          </p>
        </div>
      </div>
    );
  }
}
