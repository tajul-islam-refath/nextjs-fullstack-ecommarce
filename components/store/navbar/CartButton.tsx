import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { CartCount } from "../CartCount";

export function CartButton() {
  return (
    <Link
      href="/cart"
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-(--gray-700) transition-colors hover:bg-(--primary-50) hover:text-(--primary-600)"
    >
      <ShoppingCart className="h-6 w-6" />
      {/* Cart Badge */}
      {/* <CartCount /> */}
    </Link>
  );
}
