"use client";

import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { CartCount } from "./CartCount";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Search:", searchQuery);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-(--primary-500) to-(--primary-700)">
                <span className="text-xl font-bold text-white">E</span>
              </div>
              <span className="hidden text-xl font-bold text-(--gray-900) sm:block">
                EcoShop
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex flex-1 max-w-2xl items-center"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="h-10 w-full rounded-lg border border-(--gray-300) bg-(--gray-50) px-4 pr-10 text-sm text-(--gray-900) placeholder-(--gray-500) transition-colors focus:border-(--primary-500) focus:bg-white focus:outline-none focus:ring-2 focus:ring-(--primary-500)/20"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-(--gray-500) transition-colors hover:bg-(--primary-50) hover:text-(--primary-600)"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-(--gray-700) transition-colors hover:bg-(--primary-50) hover:text-(--primary-600)"
          >
            <ShoppingCart className="h-6 w-6" />
            {/* Cart Badge */}
            <CartCount />
          </Link>
        </div>
      </div>
    </nav>
  );
}
