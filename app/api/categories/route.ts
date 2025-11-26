import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { CategoryService } from "@/lib/service/category.service";
import { prisma } from "@/lib/prisma";
import { paginationQuerySchema } from "@/lib/validations/category";
import { cacheConfig } from "@/lib/config";
import { ZodError } from "zod";

/**
 * Route Segment Config
 * Enable time-based revalidation (1 hour = 3600 seconds)
 * This works alongside on-demand revalidation via revalidateTag
 */
export const revalidate = cacheConfig.categories.revalidate;

/**
 * GET /api/categories
 * Retrieves paginated list of categories with Next.js caching
 *
 * Caching Strategy:
 * - Time-based: Revalidates every 1 hour (3600s)
 * - On-demand: Can be revalidated via revalidateTag('categories')
 * - Tagged with 'categories' for granular cache invalidation
 *
 * Query Parameters:
 * - page: Page number (default: 1, min: 1, max: 1000)
 * - limit: Items per page (default: 10, min: 1, max: 100)
 *
 * Response:
 * - 200: Success with paginated categories
 * - 400: Invalid query parameters
 * - 500: Internal server error
 */
export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
    };

    const validatedParams = paginationQuerySchema.parse(queryParams);

    // Create cached function for fetching categories
    // Cache is tagged with 'categories' and includes page/limit in cache key
    const getCachedCategories = unstable_cache(
      async (page: number, limit: number) => {
        const categoryService = new CategoryService(prisma);
        return categoryService.getPaginatedCategories(page, limit);
      },
      [
        "categories",
        `page-${validatedParams.page}`,
        `limit-${validatedParams.limit}`,
      ],
      {
        tags: cacheConfig.categories.tags,
      }
    );

    // Fetch paginated categories with caching
    const result = await getCachedCategories(
      validatedParams.page,
      validatedParams.limit
    );

    // Return successful response with cache headers
    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": `public, s-maxage=${cacheConfig.categories.revalidate}, stale-while-revalidate=86400`,
      },
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle unexpected errors
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}
