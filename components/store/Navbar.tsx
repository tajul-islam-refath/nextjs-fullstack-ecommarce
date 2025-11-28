import { Logo } from "./navbar/Logo";
import { SearchBar } from "./navbar/SearchBar";
import { CartButton } from "./navbar/CartButton";
import { Suspense } from "react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Logo />

          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>

          {/* Cart Icon */}
          <CartButton />
        </div>
      </div>
    </nav>
  );
}
