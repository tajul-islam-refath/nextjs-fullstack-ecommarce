"use client";

import { Heart, ShoppingCart, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProduct } from "./product-context";
interface Variant {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice: number | null;
  stock: number;
  options: any; // JSON value
}

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    basePrice: number;
    salePrice: number | null;
    stock: number;
    hasVariants: boolean;
    variants: Variant[];
    variantOptions: any[];
  };
}

export function ProductInfo() {
  const {
    product,
    selectedVariant,
    selectedOptions,
    quantity,
    currentPrice,
    originalPrice,
    currentStock,
    isOutOfStock,
    setQuantity,
    handleOptionChange,
    addToCart,
    buyNow,
  } = useProduct();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-(--gray-900)">{product.name}</h1>
        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-(--primary-600)">
              ${currentPrice.toFixed(2)}
            </span>
            {originalPrice > currentPrice && (
              <span className="text-lg text-(--gray-500) line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {originalPrice > currentPrice && (
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800">
              Save{" "}
              {Math.round(
                ((originalPrice - currentPrice) / originalPrice) * 100
              )}
              %
            </span>
          )}
        </div>
      </div>

      {/* Variants Selection */}
      {product.hasVariants &&
        product.variantOptions.map((option: any) => (
          <div key={option.id}>
            <h3 className="mb-3 text-sm font-medium text-(--gray-900)">
              {option.name}:{" "}
              <span className="text-(--gray-500)">
                {selectedOptions[option.name]}
              </span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value: string) => {
                const isSelected = selectedOptions[option.name] === value;
                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(option.name, value)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                      isSelected
                        ? "border-(--primary-600) bg-(--primary-50) text-(--primary-700) ring-1 ring-(--primary-600)"
                        : "border-(--gray-200) bg-white text-(--gray-700) hover:border-(--gray-300) hover:bg-(--gray-50)"
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      {/* Quantity */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-(--gray-900)">Quantity</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-(--gray-200) bg-white">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-(--gray-600) hover:bg-(--gray-50) disabled:opacity-50"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="w-12 text-center text-(--gray-900)">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
              className="px-3 py-2 text-(--gray-600) hover:bg-(--gray-50) disabled:opacity-50"
              disabled={quantity >= currentStock}
            >
              +
            </button>
          </div>
          <span className="text-sm text-(--gray-500)">
            {currentStock} items available
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          className="flex-1 gap-2 bg-(--primary-600) hover:bg-(--primary-700)"
          onClick={addToCart}
          disabled={isOutOfStock || (product.hasVariants && !selectedVariant)}
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="flex-1 gap-2 border-2 border-(--primary-600) bg-white text-(--primary-600) hover:bg-(--primary-50)"
          onClick={buyNow}
          disabled={isOutOfStock || (product.hasVariants && !selectedVariant)}
        >
          Order Now
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="aspect-square p-0"
          aria-label="Add to wishlist"
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-(--gray-200) p-4">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-(--primary-600)" />
          <div>
            <p className="text-sm font-medium text-(--gray-900)">
              Free Delivery
            </p>
            <p className="text-xs text-(--gray-500)">On orders over $50</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-(--primary-600)" />
          <div>
            <p className="text-sm font-medium text-(--gray-900)">
              2 Year Warranty
            </p>
            <p className="text-xs text-(--gray-500)">Full protection</p>
          </div>
        </div>
      </div>
    </div>
  );
}
