"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { removeFromCart, updateCartItemQuantity } from "@/lib/actions/cart";
import { toast } from "sonner";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

// Serialized types matching CartClient
type SerializedProductImage = {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
};

type SerializedProduct = {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice: number | null;
  images: SerializedProductImage[];
};

type SerializedVariant = {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  imageUrl: string | null;
};

type SerializedCartItem = {
  id: string;
  quantity: number;
  product: SerializedProduct;
  variant: SerializedVariant | null;
};

interface CartItemProps {
  item: SerializedCartItem;
}

export function CartItem({ item }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const price = item.variant
    ? Number(item.variant.salePrice || item.variant.price)
    : Number(item.product.salePrice || item.product.basePrice);

  const originalPrice = item.variant
    ? Number(item.variant.price)
    : Number(item.product.basePrice);

  const hasDiscount = price < originalPrice;

  // Get image URL: variant image > primary product image > placeholder
  const imageUrl =
    item.variant?.imageUrl ||
    item.product.images.find((img) => img.isPrimary)?.url ||
    "/placeholder.png";

  const handleUpdateQuantity = async (newQuantity: number) => {
    setIsUpdating(true);
    try {
      await updateCartItemQuantity(item.id, newQuantity);
      toast.success("Cart updated");
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      toast.error("Failed to update cart");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeFromCart(item.id);
      toast.success("Item removed from cart");
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative h-24 w-24 sm:h-32 sm:w-32 shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-primary-600">
                <Link href={`/product/${item.product.slug}`}>
                  {item.product.name}
                </Link>
              </h3>
              {item.variant && (
                <p className="text-sm text-gray-500 mt-1">
                  {item.variant.name}
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={isUpdating}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-gray-200 bg-white">
              <button
                onClick={() => handleUpdateQuantity(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
                className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-gray-900 font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() => handleUpdateQuantity(item.quantity + 1)}
                disabled={isUpdating}
                className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Subtotal */}
            <div className="ml-auto">
              <p className="text-sm text-gray-500">Subtotal</p>
              <p className="text-lg font-bold text-gray-900">
                {formatPrice(price * item.quantity)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
