"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  // Sync with URL params after mount (client-side only)
  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
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
  );
}
