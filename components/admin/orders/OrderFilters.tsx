"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search, X, Filter, Package } from "lucide-react";
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

export function OrderFilters() {
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
    if (searchParams.get("status"))
      filters.push({
        key: "status",
        label: `Status: ${searchParams.get("status")}`,
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5" />
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Order ID, Customer Name, Mobile..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-10 bg-white border-slate-200 focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" />
                Order Status
              </label>
              <Select
                value={searchParams.get("status") || "all"}
                onValueChange={(value) =>
                  handleFilterChange("status", value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="h-10 bg-white border-slate-200 focus:border-primary focus:ring-primary/20">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
