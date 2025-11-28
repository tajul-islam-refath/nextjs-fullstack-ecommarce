import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import { StorePagination } from "@/components/common/StorePagination";
import { ProductService } from "@/lib/service/product.service";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { TAGS } from "@/lib/constains";
import { CategoryService } from "@/lib/service/category.service";
import { notFound } from "next/navigation";

interface CategoryProductProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function CategoryProduct({
  params,
  searchParams,
}: CategoryProductProps) {
  const limit = 24;
  const { slug } = await params;
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;

  const categoryService = new CategoryService(prisma);
  const category = await categoryService.getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const getCachedProducts = unstable_cache(
    async (catId: string, p: number) => {
      const productService = new ProductService(prisma);
      return productService.getProductsByCategory(catId, p, limit);
    },
    [`category-products-${category.id}-${page}`],
    {
      tags: [TAGS.PRODUCT, `category-${category.id}`],
      revalidate: 3600,
    }
  );

  const { data: products, pagination } = await getCachedProducts(
    category.id,
    currentPage
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-slate-900">{category.name}</h1>
      </div>
      <div className="mb-8">
        <p className="mt-2 text-slate-600">Found {pagination.total} products</p>
      </div>

      {products.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
          <div className="text-center">
            <h3 className="text-lg font-medium text-slate-900">
              No products found
            </h3>
            <p className="mt-1 text-slate-500">
              Check back later for new products in this category.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
                  categoryName={category.name}
                />
              );
            })}
          </div>

          <div className="mt-12">
            <StorePagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              createPageUrl={(p) => `/category/${slug}?page=${p}`}
            />
          </div>
        </>
      )}
    </div>
  );
}
