"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag, Tag } from "lucide-react";
import { useMemo } from "react";
import { formatPrice } from "@/lib/utils";

// Serialized types matching CartClient
type SerializedProduct = {
  basePrice: number;
  salePrice: number | null;
};

type SerializedVariant = {
  price: number;
  salePrice: number | null;
};

type SerializedCartItem = {
  quantity: number;
  product: SerializedProduct;
  variant: SerializedVariant | null;
};

interface CartSummaryProps {
  items: SerializedCartItem[];
}

export function CartSummary({ items }: CartSummaryProps) {
  const { subtotal, savings, total } = useMemo(() => {
    let subtotal = 0;
    let savings = 0;

    items.forEach((item) => {
      const currentPrice = item.variant
        ? Number(item.variant.salePrice || item.variant.price)
        : Number(item.product.salePrice || item.product.basePrice);

      const originalPrice = item.variant
        ? Number(item.variant.price)
        : Number(item.product.basePrice);

      subtotal += currentPrice * item.quantity;
      savings += (originalPrice - currentPrice) * item.quantity;
    });

    return {
      subtotal,
      savings,
      total: subtotal,
    };
  }, [items]);

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const finalTotal = total + shipping;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({items.length} items)</span>
          <span className="font-medium text-gray-900">
            {formatPrice(subtotal)}
          </span>
        </div>

        {savings > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600 flex items-center gap-1">
              <Tag className="h-4 w-4" />
              Savings
            </span>
            <span className="font-medium text-green-600">
              -{formatPrice(savings)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-gray-900">
            {shipping === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        {subtotal < 50 && subtotal > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              Add{" "}
              <span className="font-semibold">
                {formatPrice(50 - subtotal)}
              </span>{" "}
              more to get FREE shipping!
            </p>
          </div>
        )}

        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(finalTotal)}
            </span>
          </div>
        </div>
      </div>

      <Button size="lg" className="w-full bg-primary-600 hover:bg-primary-700">
        <ShoppingBag className="h-5 w-5 mr-2" />
        Proceed to Checkout
      </Button>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Secure checkout
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          30-day money-back guarantee
        </div>
      </div>
    </div>
  );
}
