import { prisma } from "@/lib/prisma";
import { CategoryService } from "@/lib/service/category.service";
import { CategoryCarousel } from "@/components/store/CategoryCarousel";
import { cacheTag } from "next/cache";
import { TAGS } from "@/lib/constains";

export function CategorySkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-32 shrink-0 sm:w-40">
          <div className="mb-3 aspect-square w-full animate-pulse rounded-xl bg-(--gray-200)" />
          <div className="mx-auto h-4 w-20 animate-pulse rounded bg-(--gray-200)" />
        </div>
      ))}
    </div>
  );
}

export async function CategoriesSection() {
  "use cache";
  cacheTag(TAGS.CATEGORY);

  const categoryService = new CategoryService(prisma);
  const categories = await categoryService.getAllCategories();

  if (categories.length === 0) {
    return null;
  }

  return <CategoryCarousel categories={categories} />;
}
