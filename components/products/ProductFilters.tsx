"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import {
  Search,
  X,
  Filter,
  SlidersHorizontal,
  Tag,
  TrendingUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";

interface Category {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for inputs
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 500);

  // Create a new URLSearchParams object to manage queries
  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      // Reset page to 1 when filters change
      newSearchParams.set("page", "1");

      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Update URL when debounced search changes
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (debouncedSearch !== currentSearch) {
      router.push(
        `${pathname}?${createQueryString({ search: debouncedSearch })}`
      );
    }
  }, [debouncedSearch, router, pathname, createQueryString, searchParams]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    router.push(`${pathname}?${createQueryString({ [key]: value })}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    router.push(pathname);
  };

  // Get active filter count
  const getActiveFilters = () => {
    const filters = [];
    if (searchParams.get("search"))
      filters.push({
        key: "search",
        label: `Search: ${searchParams.get("search")}`,
      });
    if (searchParams.get("categoryId")) {
      const category = categories.find(
        (c) => c.id === searchParams.get("categoryId")
      );
      if (category)
        filters.push({
          key: "categoryId",
          label: `Category: ${category.name}`,
        });
    }
    if (searchParams.get("featuredType"))
      filters.push({
        key: "featuredType",
        label: `Status: ${searchParams.get("featuredType")}`,
      });
    return filters;
  };

  const activeFilters = getActiveFilters();
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="space-y-4">
      {/* Main Filters Card */}
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Filter className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Filters
                </h3>
                <p className="text-xs text-slate-500">
                  {hasActiveFilters
                    ? `${activeFilters.length} active`
                    : "No filters applied"}
                </p>
              </div>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <X className="mr-2 h-3.5 w-3.5" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5" />
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Product name, SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-10 bg-white border-slate-200 focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                Category
              </label>
              <Select
                value={searchParams.get("categoryId") || "all"}
                onValueChange={(value) =>
                  handleFilterChange("categoryId", value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="h-10 bg-white border-slate-200 focus:border-primary focus:ring-primary/20">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Featured Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" />
                Featured Status
              </label>
              <Select
                value={searchParams.get("featuredType") || "all"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "featuredType",
                    value === "all" ? "" : value
                  )
                }
              >
                <SelectTrigger className="h-10 bg-white border-slate-200 focus:border-primary focus:ring-primary/20">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="LATEST">Latest</SelectItem>
                  <SelectItem value="HOT">Hot</SelectItem>
                  <SelectItem value="POPULAR">Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Sort By
              </label>
              <Select
                value={searchParams.get("sortBy") || "createdAt"}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger className="h-10 bg-white border-slate-200 focus:border-primary focus:ring-primary/20">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Newest First</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="basePrice">Price (Low to High)</SelectItem>
                  <SelectItem value="updatedAt">Recently Updated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Badges */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-600">
            Active filters:
          </span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter.key}
              variant="secondary"
              className="pl-2 pr-1 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
            >
              <span className="text-xs">{filter.label}</span>
              <button
                onClick={() => {
                  if (filter.key === "search") {
                    setSearch("");
                  }
                  handleFilterChange(filter.key, "");
                }}
                className="ml-1.5 p-0.5 hover:bg-primary/30 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
