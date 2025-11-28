import { Suspense } from "react";
import { CategoryService } from "@/lib/service/category.service";
import { prisma } from "@/lib/prisma";
import { CategoryProduct } from "@/components/store/category/CategoryProduct";
import { CategoryProductSkeleton } from "@/components/store/category/CategoryProductSkeleton";
import { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryService = new CategoryService(prisma);
  const category = await categoryService.getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} | Store`,
    description: `Browse products in ${category.name}`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  return (
    <Suspense fallback={<CategoryProductSkeleton />}>
      <CategoryProduct params={params} searchParams={searchParams} />
    </Suspense>
  );
}
