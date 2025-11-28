import { Suspense } from "react";
import { Metadata } from "next";
import { CategoryService } from "@/lib/service/category.service";
import { prisma } from "@/lib/prisma";
import { SearchFilters } from "@/components/store/search/SearchFilters";
import { SearchProducts } from "@/components/store/search/SearchProducts";
import { SearchProductSkeleton } from "@/components/store/search/SearchProductSkeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const categoryService = new CategoryService(prisma);
  const categories = await categoryService.getAllCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{params.search}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24">
            <SearchFilters categories={categories} />
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <Suspense fallback={<SearchProductSkeleton />}>
            <SearchProducts searchParams={params} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
