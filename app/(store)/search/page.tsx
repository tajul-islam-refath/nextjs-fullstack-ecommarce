import { Suspense } from "react";
import { Metadata } from "next";
import { SearchProductSkeleton } from "@/components/store/search/SearchProductSkeleton";
import SearchPage from "./SearchPage";

export const metadata: Metadata = {
  title: "Search Products | Store",
  description: "Search and filter products",
};

interface SearchPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    order?: string;
  }>;
}

export default function page({ searchParams }: SearchPageProps) {
  return (
    <Suspense fallback={<SearchProductSkeleton />}>
      <SearchPage searchParams={searchParams} />
    </Suspense>
  );
}
