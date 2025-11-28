"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useDebounce } from "@/hooks/use-debounce";
import { Category } from "@/app/generated/prisma/client";
import { currencyConfig } from "@/lib/config";

interface SearchFiltersProps {
  categories: Category[];
  minPrice?: number;
  maxPrice?: number;
}

export function SearchFilters({
  categories,
  minPrice: initialMinPrice = 0,
  maxPrice: initialMaxPrice = 10000,
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for filters (excluding search - handled by navbar)
  const [categoryId, setCategoryId] = useState(
    searchParams.get("categoryId") || "all"
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "createdAt");
  const [order, setOrder] = useState(searchParams.get("order") || "desc");
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice")) || initialMinPrice,
    Number(searchParams.get("maxPrice")) || initialMaxPrice,
  ]);

  const debouncedPriceRange = useDebounce(priceRange, 500);

  // Update URL when filters change
  const updateFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Keep search param from URL (set by navbar)
    // Category
    if (categoryId && categoryId !== "all") {
      params.set("categoryId", categoryId);
    } else {
      params.delete("categoryId");
    }

    // Sort
    params.set("sort", sort);
    params.set("order", order);

    // Price
    if (debouncedPriceRange[0] > initialMinPrice) {
      params.set("minPrice", debouncedPriceRange[0].toString());
    } else {
      params.delete("minPrice");
    }
    if (debouncedPriceRange[1] < initialMaxPrice) {
      params.set("maxPrice", debouncedPriceRange[1].toString());
    } else {
      params.delete("maxPrice");
    }

    // Reset page
    params.set("page", "1");

    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  }, [
    categoryId,
    sort,
    order,
    debouncedPriceRange,
    initialMinPrice,
    initialMaxPrice,
    router,
    searchParams,
  ]);

  // Trigger update when debounced values or other filters change
  useEffect(() => {
    updateFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, sort, order, debouncedPriceRange]);

  return (
    <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Filters</h3>

        {/* Category */}
        <div className="mb-4 space-y-2">
          <Label>Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-full">
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

        {/* Price Range */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label>Price Range</Label>
            <span className="text-sm text-slate-500">
              {currencyConfig.symbol}
              {priceRange[0]} - {currencyConfig.symbol}
              {priceRange[1]}
            </span>
          </div>
          <Slider
            min={initialMinPrice}
            max={initialMaxPrice}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            className="py-4"
          />
        </div>

        {/* Sort */}
        <div className="mb-4 space-y-2">
          <Label>Sort By</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="basePrice">Price</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Order */}
        <div className="mb-4 space-y-2">
          <Label>Order</Label>
          <Select value={order} onValueChange={setOrder}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setCategoryId("all");
            setSort("createdAt");
            setOrder("desc");
            setPriceRange([initialMinPrice, initialMaxPrice]);
            // Clear all URL params including search
            router.push("/search");
          }}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
