"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  imageUrl: string;
  linkUrl?: string | null;
}

interface BannerCarouselProps {
  banners: Banner[];
  autoPlayInterval?: number;
}

export function BannerCarousel({
  banners,
  autoPlayInterval = 5000,
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 700);
  }, [banners.length, isTransitioning]);

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isHovered && banners.length > 1) {
      const interval = setInterval(goToNext, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [isHovered, banners.length, autoPlayInterval, goToNext]);

  if (banners.length === 0) {
    return null;
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-(--gray-100)"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Banner Images Container */}
      <div className="relative aspect-21/9 w-full sm:aspect-video md:aspect-21/6">
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          const isPrev =
            index === (currentIndex - 1 + banners.length) % banners.length;
          const isNext = index === (currentIndex + 1) % banners.length;

          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 translate-x-0 z-10 scale-100"
                  : isPrev
                  ? "opacity-0 -translate-x-full z-0 scale-95"
                  : isNext
                  ? "opacity-0 translate-x-full z-0 scale-95"
                  : "opacity-0 translate-x-full z-0 scale-95"
              }`}
            >
              {banner.linkUrl ? (
                <Link href={banner.linkUrl} className="block h-full w-full">
                  <div className="relative h-full w-full">
                    <Image
                      src={banner.imageUrl}
                      alt="Banner"
                      fill
                      className={`object-cover transition-transform duration-700 ${
                        isActive ? "scale-100" : "scale-105"
                      }`}
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                    />
                    {/* Overlay gradient for better text readability */}
                    <div className="absolute inset-0 bg-linear-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                </Link>
              ) : (
                <div className="relative h-full w-full">
                  <Image
                    src={banner.imageUrl}
                    alt="Banner"
                    fill
                    className={`object-cover transition-transform duration-700 ${
                      isActive ? "scale-100" : "scale-105"
                    }`}
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                  />
                  {/* Overlay gradient for better text readability */}
                  <div className="absolute inset-0 bg-linear-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-2 text-(--gray-800) shadow-lg transition-all hover:bg-white hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-2 text-(--gray-800) shadow-lg transition-all hover:bg-white hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
            aria-label="Next banner"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? "w-8 bg-(--primary-600) shadow-lg"
                  : "w-2 bg-white/60 hover:bg-white/80 hover:scale-125"
              } disabled:cursor-not-allowed`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar (optional - shows auto-play progress) */}
      {!isHovered && banners.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
          <div
            className="h-full bg-(--primary-600) transition-all"
            style={{
              width: "100%",
              animation: `progress ${autoPlayInterval}ms linear`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
