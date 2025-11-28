import { Suspense } from "react";
import OrderListClient from "@/components/admin/orders/OrderListClient";
import { OrdersLoadingSkeleton } from "@/components/admin/orders/OrdersLoadingSkeleton";
import { paginationConfig } from "@/lib/config";
import { fetchOrders } from "@/lib/api/orders";

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
    const ordersResult = await fetchOrders(ordersParams);

    return (
      <OrderListClient
        initialOrders={ordersResult.data}
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
