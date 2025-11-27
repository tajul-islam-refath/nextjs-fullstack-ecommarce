"use client";

import { ProductCard } from "./ProductCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ProductSectionProps {
  title: string;
  products: any[]; // Prisma product type with relations
  viewAllLink?: string;
}

export function ProductSection({
  title,
  products,
  viewAllLink,
}: ProductSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-(--gray-900) sm:text-3xl">
          {title}
        </h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="flex items-center gap-1 text-sm font-semibold text-(--primary-600) transition-colors hover:text-(--primary-700)"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => {
          const primaryImage = product.images.find((img: any) => img.isPrimary);
          const image = primaryImage?.url || product.images[0]?.url;

          return (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              basePrice={Number(product.basePrice)}
              salePrice={product.salePrice ? Number(product.salePrice) : null}
              image={image}
              categoryName={product.category.name}
            />
          );
        })}
      </div>
    </section>
  );
}
