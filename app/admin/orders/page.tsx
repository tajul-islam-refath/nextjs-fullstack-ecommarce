import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import OrderListClient from "@/components/admin/orders/OrderListClient";
import { OrdersLoadingSkeleton } from "@/components/admin/orders/OrdersLoadingSkeleton";
import { paginationConfig } from "@/lib/config";
import { OrderService } from "@/lib/service/order.service";
import { prisma } from "@/lib/prisma";
import { getOrdersSchema } from "@/lib/validations/order";
import { TAGS } from "@/lib/constains";

export const metadata = {
  title: "Orders | Admin Dashboard",
  description: "Manage customer orders",
};

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
}

interface OrdersPageProps {
  searchParams: Promise<SearchParams>;
}

export default function OrdersPage({ searchParams }: OrdersPageProps) {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<OrdersLoadingSkeleton />}>
        <OrdersContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function OrdersContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // Set defaults
  const page = params.page || String(paginationConfig.defaultPage);
  const limit = params.limit || String(paginationConfig.defaultLimit);

  const ordersParams = {
    ...params,
    page,
    limit,
  };

  try {
    // Validate parameters
    const validatedParams = getOrdersSchema.parse(ordersParams);

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

    // Fetch orders directly using service
    const ordersResult = await getCachedOrders(validatedParams);

    // Serialize Decimal fields to plain numbers for client component
    const serializedOrders = ordersResult.data.map((order: any) => ({
      ...order,
      totalAmount: Number(order.totalAmount),
      subtotal: Number(order.subtotal),
      deliveryCost: Number(order.deliveryCost),
      items: order.items.map((item: any) => ({
        ...item,
        price: Number(item.price),
      })),
    }));

    return (
      <OrderListClient
        initialOrders={serializedOrders}
        initialPagination={ordersResult.pagination}
      />
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Error Loading Data
          </h2>
          <p className="text-slate-600">
            {error instanceof Error ? error.message : "Failed to load orders"}
          </p>
        </div>
      </div>
    );
  }
}
