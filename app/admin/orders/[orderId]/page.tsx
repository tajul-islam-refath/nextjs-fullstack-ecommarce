import { Suspense } from "react";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { OrderService } from "@/lib/service/order.service";
import { TAGS } from "@/lib/constains";
import OrderViewClient from "@/components/admin/orders/OrderViewClient";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderViewPageProps {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: OrderViewPageProps) {
  const { orderId } = await params;
  return {
    title: `Order ${orderId} | Admin Dashboard`,
    description: `View details for order ${orderId}`,
  };
}

export default function OrderViewPage({ params }: OrderViewPageProps) {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<OrderViewSkeleton />}>
        <OrderViewContent params={params} />
      </Suspense>
    </div>
  );
}

async function OrderViewContent({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  // Create cached function for fetching order
  const getCachedOrder = unstable_cache(
    async (id: string) => {
      const orderService = new OrderService(prisma);
      return orderService.getOrderById(id);
    },
    ["order", orderId],
    {
      tags: [TAGS.ORDER, `order-${orderId}`],
    }
  );

  const order = await getCachedOrder(orderId);

  if (!order) {
    notFound();
  }

  // Serialize Decimal fields to plain numbers for client component
  const serializedOrder = {
    ...order,
    totalAmount: Number(order.totalAmount),
    subtotal: Number(order.subtotal),
    deliveryCost: Number(order.deliveryCost),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  };

  return <OrderViewClient order={serializedOrder} />;
}

function OrderViewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-96" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
        </div>
      </div>
    </div>
  );
}
