import { ProductCard } from "@/components/store/ProductCard";
import { StorePagination } from "@/components/common/StorePagination";
import { ProductService } from "@/lib/service/product.service";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { TAGS } from "@/lib/constains";

interface SearchProductsProps {
  searchParams: {
    page?: string;
    search?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    order?: string;
  };
}

export async function SearchProducts({ searchParams }: SearchProductsProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 12;
  const search = params.search;
  const categoryId = params.categoryId;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const sortBy = (params.sort as any) || "createdAt";
  const sortOrder = (params.order as any) || "desc";

  // Create a unique cache key based on all filter parameters
  const cacheKey = JSON.stringify({
    page,
    limit,
    search,
    categoryId,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  });

  const getCachedProducts = unstable_cache(
    async () => {
      const productService = new ProductService(prisma);
      return productService.getPaginatedProducts({
        page,
        limit,
        search,
        categoryId: categoryId === "all" ? undefined : categoryId,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
      });
    },
    [`search-products-${cacheKey}`],
    {
      tags: [TAGS.PRODUCT],
      revalidate: 3600,
    }
  );

  const { data: products, pagination } = await getCachedProducts();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          {search ? `Results for "${search}"` : "All Products"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Found {pagination.total} products
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
          <div className="text-center">
            <h3 className="text-lg font-medium text-slate-900">
              No products found
            </h3>
            <p className="mt-1 text-slate-500">
              Try adjusting your filters or search terms.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => {
              const primaryImage = product.images.find(
                (img: any) => img.isPrimary
              );
              const image = primaryImage?.url || product.images[0]?.url;

              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  basePrice={Number(product.basePrice)}
                  salePrice={
                    product.salePrice ? Number(product.salePrice) : null
                  }
                  image={image}
                  categoryName={product.category.name}
                />
              );
            })}
          </div>

          <div className="mt-12">
            <StorePagination
              currentPage={page}
              totalPages={pagination.totalPages}
              createPageUrl={(p) => {
                const newParams = new URLSearchParams();
                if (search) newParams.set("search", search);
                if (categoryId) newParams.set("categoryId", categoryId);
                if (minPrice) newParams.set("minPrice", minPrice.toString());
                if (maxPrice) newParams.set("maxPrice", maxPrice.toString());
                if (sortBy) newParams.set("sort", sortBy);
                if (sortOrder) newParams.set("order", sortOrder);
                newParams.set("page", p.toString());
                return `/search?${newParams.toString()}`;
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
