import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { OrderService } from "@/lib/service/order.service";
import { prisma } from "@/lib/prisma";
import { getOrdersSchema } from "@/lib/validations/order";
import { cacheConfig } from "@/lib/config";
import { ZodError } from "zod";
import { TAGS } from "@/lib/constains";

/**
 * GET /api/orders
 *
 * Get paginated orders with search and filters
 *
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 10, max: 100)
 * - search: string (search in order ID, customer name, mobile)
 * - status: PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED
 */
export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
    };

    const validatedParams = getOrdersSchema.parse(queryParams);

    // Create a cache key based on query params
    const cacheKey = JSON.stringify(validatedParams);

    // Create cached function for fetching orders
    const getCachedOrders = unstable_cache(
      async (params: typeof validatedParams) => {
        const orderService = new OrderService(prisma);
        return orderService.getPaginatedOrders(params);
      },
      ["orders", cacheKey],
      {
        tags: [TAGS.ORDER],
      }
    );

    // Fetch orders
    const result = await getCachedOrders(validatedParams);

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
    console.error("Error fetching orders:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch orders",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
