import { Suspense } from "react";
import { ProductManagementClient } from "@/components/products/ProductManagementClient";
import { ProductsLoadingSkeleton } from "@/components/products/ProductsLoadingSkeleton";
import { paginationConfig } from "@/lib/config";

export const metadata = {
  title: "Products | Admin Dashboard",
  description: "Manage your store products",
};

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
  categoryId?: string;
  featuredType?: string;
  minPrice?: string;
  maxPrice?: string;
  hasVariants?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface ProductsPageProps {
  searchParams: Promise<SearchParams>;
}

import { fetchProducts } from "@/lib/api/products";
import { fetchAllCategories } from "@/lib/api/categories";

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<ProductsLoadingSkeleton />}>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ProductsContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // Set defaults
  const page = params.page || String(paginationConfig.defaultPage);
  const limit = params.limit || String(paginationConfig.defaultLimit);

  const productsParams = {
    ...params,
    page,
    limit,
  };

  try {
    const [productsResult, categoriesResult] = await Promise.all([
      fetchProducts(productsParams),
      fetchAllCategories(),
    ]);

    const categories = categoriesResult.data || [];

    return (
      <ProductManagementClient
        initialProducts={productsResult.data}
        initialPagination={productsResult.pagination}
        categories={categories}
      />
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Error Loading Data
          </h2>
          <p className="text-slate-600">
            {error instanceof Error
              ? error.message
              : "Failed to load products or categories"}
          </p>
        </div>
      </div>
    );
  }
}
