import { Suspense } from "react";
import CartPage from "./CartPage";
import { CartSkeleton } from "@/components/store/cart/CartSkeleton";

export const metadata = {
  title: "Shopping Cart - EcoShop",
  description: "Review your shopping cart",
};

export default async function page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <Suspense fallback={<CartSkeleton />}>
          <CartPage />
        </Suspense>
      </div>
    </div>
  );
}
