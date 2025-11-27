"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number | null;
  image?: string;
  categoryName?: string;
}

export function ProductCard({
  id,
  name,
  slug,
  basePrice,
  salePrice,
  image,
  categoryName,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const finalPrice = salePrice || basePrice;
  const discount = salePrice
    ? Math.round(((basePrice - salePrice) / basePrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // TODO: Implement add to cart
    console.log("Add to cart:", id);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link href={`/product/${slug}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-white border border-(--gray-200) transition-all hover:shadow-xl hover:border-(--primary-300)">
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-(--gray-100)">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-(--gray-100) to-(--gray-200)">
              <span className="text-4xl font-bold text-(--gray-400)">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute left-3 top-3 rounded-lg bg-(--primary-600) px-2 py-1 text-xs font-bold text-white shadow-md">
              -{discount}%
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-md transition-all hover:bg-white hover:scale-110"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-(--gray-600)"
              }`}
            />
          </button>

          {/* Quick Add to Cart - Shows on Hover */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full transition-transform group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-2 bg-(--primary-600) py-3 text-sm font-semibold text-white transition-colors hover:bg-(--primary-700)"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          {categoryName && (
            <p className="mb-1 text-xs font-medium text-(--primary-600) uppercase tracking-wide">
              {categoryName}
            </p>
          )}

          {/* Product Name */}
          <h3 className="mb-2 text-base font-semibold text-(--gray-900) line-clamp-2 group-hover:text-(--primary-600) transition-colors">
            {name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-(--primary-600)">
              ${finalPrice.toFixed(2)}
            </span>
            {salePrice && (
              <span className="text-sm text-(--gray-500) line-through">
                ${basePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
