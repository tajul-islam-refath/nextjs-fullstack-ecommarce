"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

interface CategoryCarouselProps {
  categories: Category[];
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
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

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-(--gray-900)">
          Shop by Category
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Scroll Buttons */}
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

        {/* Categories Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth p-4"
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group/card shrink-0"
            >
              <div className="w-32 sm:w-40">
                {/* Category Image */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-(--gray-100) mb-3 ring-2 ring-transparent transition-all group-hover/card:ring-(--primary-500) group-hover/card:shadow-lg">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform group-hover/card:scale-110"
                      sizes="(max-width: 640px) 128px, 160px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-gradient-to-br from-(--primary-100) to-(--primary-200)">
                      <span className="text-3xl font-bold text-(--primary-700)">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Category Name */}
                <h3 className="text-center text-sm font-semibold text-(--gray-800) group-hover/card:text-(--primary-600) transition-colors line-clamp-2">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
