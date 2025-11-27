import { Suspense } from "react";
import { CategoryManagementClient } from "@/components/categories/CategoryManagementClient";
import { paginationConfig } from "@/lib/config";
import { fetchCategories } from "@/lib/api/categories";
import { Loader2 } from "lucide-react";

interface SearchParams {
  page?: string;
  limit?: string;
}

interface CategoriesPageProps {
  searchParams: Promise<SearchParams>;
}

export default function CategoriesPage({ searchParams }: CategoriesPageProps) {
  return (
    <div className="container mx-auto py-6">
      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        }
      >
        <CategoriesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CategoriesContent({ searchParams }: CategoriesPageProps) {
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
