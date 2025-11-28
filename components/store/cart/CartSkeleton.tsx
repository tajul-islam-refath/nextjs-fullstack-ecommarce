import { Skeleton } from "@/components/ui/skeleton";

function CartItemSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex gap-4">
        {/* Product Image Skeleton */}
        <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 shrink-0 rounded-lg" />

        {/* Product Info Skeleton */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-4">
            <div className="flex-1 space-y-2">
              {/* Product Name */}
              <Skeleton className="h-6 w-3/4" />
              {/* Variant Name */}
              <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Delete Button Skeleton */}
            <Skeleton className="h-8 w-8 rounded" />
          </div>

          {/* Price Skeleton */}
          <div className="mt-2 flex items-baseline gap-2">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Quantity Controls and Subtotal */}
          <div className="mt-4 flex items-center gap-4">
            {/* Quantity Controls */}
            <Skeleton className="h-10 w-32 rounded-lg" />

            {/* Subtotal */}
            <div className="ml-auto space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartSummarySkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <Skeleton className="h-6 w-32 mb-6" />

      {/* Summary Items */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>

      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>

      {/* Checkout Button */}
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items Skeleton */}
      <div className="lg:col-span-2 space-y-4">
        <CartItemSkeleton />
        <CartItemSkeleton />
        <CartItemSkeleton />
      </div>

      {/* Cart Summary Skeleton */}
      <div className="lg:col-span-1">
        <CartSummarySkeleton />
      </div>
    </div>
  );
}
