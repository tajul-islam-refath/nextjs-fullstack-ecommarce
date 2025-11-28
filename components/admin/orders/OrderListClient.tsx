"use client";

import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DataTableWithPagination,
  Column,
  PaginationData,
} from "@/components/common/DataTableWithPagination";
import { usePagination } from "@/hooks/usePagination";
import { OrderFilters } from "./OrderFilters";
import { formatPrice } from "@/lib/utils";
import { OrderStatus } from "@/app/generated/prisma/enums";
import { OrderListItem } from "@/types/order";
import Link from "next/link";

interface OrderListClientProps {
  initialOrders: OrderListItem[];
  initialPagination: PaginationData;
}

export default function OrderListClient({
  initialOrders,
  initialPagination,
}: OrderListClientProps) {
  const { isPending, handlePageChange, handleLimitChange } = usePagination(
    initialPagination.totalPages,
    initialPagination.limit
  );

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      case "DELIVERED":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Define table columns
  const columns: Column<OrderListItem>[] = [
    {
      key: "orderId",
      header: "Order ID",
      render: (order) => <span className="font-mono text-xs">{order.id}</span>,
    },
    {
      key: "customer",
      header: "Customer",
      render: (order) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">
            {order.customerName}
          </span>
          <span className="text-xs text-slate-500">{order.customerMobile}</span>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (order) => (
        <span className="text-sm text-slate-600">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "items",
      header: "Items",
      render: (order) => (
        <span className="text-sm text-slate-600">{order.items.length}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (order) => (
        <Badge variant="secondary" className={getStatusColor(order.status)}>
          {order.status}
        </Badge>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (order) => (
        <span className="font-medium text-slate-900">
          {formatPrice(order.totalAmount)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (order) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            aria-label={`View order ${order.id}`}
            className="hover:bg-blue-50 hover:border-blue-200"
          >
            <Link href={`/admin/orders/${order.id}`}>
              <Eye className="h-4 w-4 text-blue-600" />
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-600 mt-1">
            Manage customer orders ({initialPagination.total} total)
          </p>
        </div>
      </div>

      {/* Filters */}
      <OrderFilters />

      {/* Data Table with Pagination */}
      <DataTableWithPagination
        data={initialOrders}
        columns={columns}
        pagination={initialPagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        isPending={isPending}
        emptyMessage="No orders found."
        getRowKey={(order) => order.id}
      />
    </div>
  );
}
