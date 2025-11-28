"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

// Serialized types (Decimal converted to number)
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
  description: string | null;
  categoryId: string;
  basePrice: number;
  salePrice: number | null;
  costPrice: number | null;
  stock: number;
  sku: string | null;
  featuredType: string | null;
  hasVariants: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  weight: number | null;
  dimensions: string | null;
  createdAt: Date;
  updatedAt: Date;
  images: SerializedProductImage[];
};

type SerializedVariant = {
  id: string;
  productId: string;
  sku: string;
  name: string;
  options: string;
  price: number;
  salePrice: number | null;
  costPrice: number | null;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type SerializedCartItem = {
  id: string;
  cartId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: SerializedProduct;
  variant: SerializedVariant | null;
};

type SerializedCart = {
  id: string;
  userId: string | null;
  guestSessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: SerializedCartItem[];
};

interface CartClientProps {
  cart: SerializedCart | null;
}

export function CartClient({ cart }: CartClientProps) {
  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <ShoppingCart className="h-24 w-24 text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">Add some products to get started!</p>
        <Link href="/">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {cart.items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Cart Summary */}
      <div className="lg:col-span-1">
        <CartSummary items={cart.items} />
      </div>
    </div>
  );
}
