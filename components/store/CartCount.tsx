"use client";

import { getCart } from "@/lib/actions/cart";
import { useEffect, useState } from "react";

export function CartCount() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    async function fetchCart() {
      const cart = await getCart();
      const count =
        cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setItemCount(count);
    }
    fetchCart();
  }, []);

  if (itemCount === 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
      {itemCount > 99 ? "99+" : itemCount}
    </span>
  );
}
