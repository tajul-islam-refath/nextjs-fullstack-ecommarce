import { prisma } from "@/lib/prisma";
import { ProductService } from "@/lib/service/product.service";
import { ProductSection } from "@/components/store/ProductSection";
import { FeaturedType } from "@/app/generated/prisma/client";

export function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-(--gray-200)"
        >
          <div className="aspect-square w-full animate-pulse bg-(--gray-200)" />
          <div className="p-4 space-y-2">
            <div className="h-3 w-16 animate-pulse rounded bg-(--gray-200)" />
            <div className="h-4 w-full animate-pulse rounded bg-(--gray-200)" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-(--gray-200)" />
            <div className="h-5 w-20 animate-pulse rounded bg-(--gray-200)" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface FeaturedProductsSectionProps {
  featuredType: FeaturedType;
  title: string;
}

export async function FeaturedProductsSection({
  featuredType,
  title,
}: FeaturedProductsSectionProps) {
  const productService = new ProductService(prisma);
  const products = await productService.getFeaturedProducts(featuredType, 10);

  // Serialize products to plain objects and select only needed fields
  const serializedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    basePrice: Number(product.basePrice),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    images: product.images,
    category: product.category,
  }));

  return (
    <ProductSection
      title={title}
      products={serializedProducts}
      viewAllLink={`/products?featured=${featuredType.toLowerCase()}`}
    />
  );
}
