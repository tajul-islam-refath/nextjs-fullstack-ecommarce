"use client";

import { getCartCount } from "@/lib/actions/cart";
import { useEffect, useState } from "react";

export function CartCount() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    async function fetchCart() {
      try {
        const count = await getCartCount();
        setItemCount(count);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    }

    fetchCart();

    // Listen for cart updates
    const handleCartUpdate = () => fetchCart();
    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  if (itemCount === 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-(--primary-600) text-xs font-semibold text-white">
      {itemCount > 99 ? "99+" : itemCount}
    </span>
  );
}
