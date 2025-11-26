import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { ProductService } from "@/lib/service/product.service";
import { prisma } from "@/lib/prisma";
import { productPaginationQuerySchema } from "@/lib/validations/product";
import { cacheConfig } from "@/lib/config";
import { ZodError } from "zod";

/**
 * Route Segment Config
 * Enable time-based revalidation (1 hour = 3600 seconds)
 */
export const revalidate = cacheConfig.categories.revalidate;

/**
 * GET /api/products
 *
 * Get paginated products with search and filters
 *
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 10, max: 100)
 * - search: string (search in name, description, sku)
 * - categoryId: string (filter by category)
 * - featuredType: LATEST | HOT | POPULAR
 * - minPrice: number
 * - maxPrice: number
 * - hasVariants: boolean
 * - sortBy: createdAt | name | basePrice | updatedAt (default: createdAt)
 * - sortOrder: asc | desc (default: desc)
 */
export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
      search: searchParams.get("search") || undefined,
      categoryId: searchParams.get("categoryId") || undefined,
      featuredType: searchParams.get("featuredType") || undefined,
      minPrice: searchParams.get("minPrice") || undefined,
      maxPrice: searchParams.get("maxPrice") || undefined,
      hasVariants: searchParams.get("hasVariants") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") || undefined,
    };

    const validatedParams = productPaginationQuerySchema.parse(queryParams);

    // Create a cache key based on query params
    const cacheKey = JSON.stringify(validatedParams);

    // Create cached function for fetching products
    const getCachedProducts = unstable_cache(
      async (params: typeof validatedParams) => {
        const productService = new ProductService(prisma);
        return productService.getPaginatedProducts(params);
      },
      ["products", cacheKey],
      {
        tags: ["products"],
      }
    );

    // Fetch products
    const result = await getCachedProducts(validatedParams);

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
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}
