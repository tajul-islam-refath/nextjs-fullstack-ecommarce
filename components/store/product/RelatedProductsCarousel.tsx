"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "../ProductCard";

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice: number | null;
  image?: string;
  categoryName?: string;
}

interface RelatedProductsCarouselProps {
  products: RelatedProduct[];
  title?: string;
}

export function RelatedProductsCarousel({
  products,
  title = "Related Products",
}: RelatedProductsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-(--gray-900) sm:text-3xl">
          {title}
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Scroll Buttons */}
        {products.length > 4 && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-4 rounded-full bg-white p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-(--gray-50)"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-(--gray-700)" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-4 rounded-full bg-white p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-(--gray-50)"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-(--gray-700)" />
            </button>
          </>
        )}

        {/* Products Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {products.map((product) => (
            <div key={product.id} className="w-64 shrink-0">
              <ProductCard
                id={product.id}
                name={product.name}
                slug={product.slug}
                basePrice={product.basePrice}
                salePrice={product.salePrice}
                image={product.image}
                categoryName={product.categoryName}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
