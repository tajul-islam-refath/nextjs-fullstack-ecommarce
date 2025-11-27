import { Suspense } from "react";
import { FeaturedType } from "@/app/generated/prisma/client";
import {
  BannersSection,
  BannerSkeleton,
} from "@/components/store/home/BannersSection";
import {
  CategoriesSection,
  CategorySkeleton,
} from "@/components/store/home/CategoriesSection";
import {
  FeaturedProductsSection,
  ProductSkeleton,
} from "@/components/store/home/FeaturedProductsSection";

export default async function HomePage() {
  return (
    <>
      {/* Banner Carousel */}
      <section className="mb-8">
        <BannersSection />
      </section>

      {/* Categories */}
      <section className="mb-12">
        <Suspense fallback={<CategorySkeleton />}>
          <CategoriesSection />
        </Suspense>
      </section>

      {/* Latest Products */}
      <Suspense fallback={<ProductSkeleton />}>
        <FeaturedProductsSection
          featuredType={FeaturedType.LATEST}
          title="Latest Products"
        />
      </Suspense>

      {/* Hot Products */}
      <Suspense fallback={<ProductSkeleton />}>
        <FeaturedProductsSection
          featuredType={FeaturedType.HOT}
          title="🔥 Hot Deals"
        />
      </Suspense>

      {/* Popular Products */}
      <Suspense fallback={<ProductSkeleton />}>
        <FeaturedProductsSection
          featuredType={FeaturedType.POPULAR}
          title="⭐ Popular Products"
        />
      </Suspense>
    </>
  );
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 60; // Revalidate every 60 seconds
