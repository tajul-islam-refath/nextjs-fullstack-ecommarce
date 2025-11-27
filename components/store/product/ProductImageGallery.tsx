"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!images.length) return null;

  const selectedImage = images[selectedIndex];

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  }, [images.length, isTransitioning]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  }, [images.length, isTransitioning]);

  const goToIndex = (index: number) => {
    if (isTransitioning || index === selectedIndex) return;
    setIsTransitioning(true);
    setSelectedIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto md:w-24 md:flex-col md:overflow-y-auto md:overflow-x-hidden scrollbar-hide">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => goToIndex(index)}
            className={cn(
              "relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-all",
              selectedIndex === index
                ? "border-(--primary-600) ring-2 ring-(--primary-200)"
                : "border-transparent hover:border-(--gray-300)"
            )}
          >
            <Image
              src={image.url}
              alt={image.alt || "Product thumbnail"}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main Image with Carousel */}
      <div className="relative aspect-square w-full flex-1 overflow-hidden rounded-xl bg-white border border-(--gray-200) group">
        {/* Image Container */}
        <div className="relative h-full w-full">
          <Image
            key={selectedImage.id}
            src={selectedImage.url}
            alt={selectedImage.alt || "Product image"}
            fill
            className={cn(
              "object-contain p-4 transition-opacity duration-300",
              isTransitioning ? "opacity-0" : "opacity-100"
            )}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Navigation Arrows - Only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              disabled={isTransitioning}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-(--gray-800)" />
            </button>
            <button
              onClick={goToNext}
              disabled={isTransitioning}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-(--gray-800)" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  disabled={isTransitioning}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === selectedIndex
                      ? "w-8 bg-(--primary-600)"
                      : "w-2 bg-(--gray-400) hover:bg-(--gray-600)"
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
