"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  RefreshCw,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UpdateOrderStatusDialog } from "./UpdateOrderStatusDialog";
import { formatPrice } from "@/lib/utils";
import { orderConfig } from "@/lib/config";
import { OrderStatus } from "@/app/generated/prisma/enums";
import { updateOrderStatus } from "@/lib/actions/order";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  productName: string;
  variantName: string | null;
  sku: string | null;
  productImage: string | null;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerMobile: string;
  customerAddress: string;
  deliveryZone: string;
  status: OrderStatus;
  paymentMethod: string | null;
  paymentStatus: string;
  subtotal: number;
  deliveryCost: number;
  totalAmount: number;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface OrderViewClientProps {
  order: Order;
}

export default function OrderViewClient({ order }: OrderViewClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusDialog, setStatusDialog] = useState(false);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast.success("Order status updated successfully!");
        setStatusDialog(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update order status");
      }
    });
  };

  const statusInfo = orderConfig.statusDisplay[order.status];
  const statusIcon = getStatusIcon(order.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="hover:bg-slate-100"
          >
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Order Details</h1>
            <p className="text-slate-600 mt-1">
              Order ID: <span className="font-mono text-sm">{order.id}</span>
            </p>
          </div>
        </div>
        <Button
          onClick={() => setStatusDialog(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Update Status
        </Button>
      </div>

      {/* Status Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {statusIcon}
              <div>
                <Badge variant="secondary" className={statusInfo?.color}>
                  {statusInfo?.label || order.status}
                </Badge>
                <p className="text-xs text-slate-500 mt-1">
                  {statusInfo?.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-green-600" />
              <div>
                <Badge
                  variant="secondary"
                  className={
                    order.paymentStatus === "PAID"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {order.paymentStatus}
                </Badge>
                <p className="text-xs text-slate-500 mt-1">
                  {order.paymentMethod || "COD"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatPrice(order.totalAmount)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {order.items.length} item(s)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-slate-600" />
                Order Items
              </CardTitle>
              <CardDescription>Products included in this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={item.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                        {item.productImage ? (
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="h-8 w-8 text-slate-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 truncate">
                          {item.productName}
                        </h4>
                        {item.variantName && (
                          <p className="text-sm text-slate-600 mt-1">
                            Variant: {item.variantName}
                          </p>
                        )}
                        {item.sku && (
                          <p className="text-xs text-slate-500 font-mono mt-1">
                            SKU: {item.sku}
                          </p>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="text-right">
                        <p className="font-medium text-slate-900">
                          {formatPrice(item.price)}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-slate-900 mt-2">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <Separator className="my-6" />
              <div className="space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Cost ({order.deliveryZone})</span>
                  <span className="font-medium">
                    {formatPrice(order.deliveryCost)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer & Delivery Info */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-slate-600" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Name</p>
                <p className="font-medium text-slate-900 mt-1">
                  {order.customerName}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-slate-600">Mobile</p>
                <p className="font-medium text-slate-900 mt-1">
                  {order.customerMobile}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-slate-600">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Delivery Address
                </p>
                <p className="font-medium text-slate-900 mt-1">
                  {order.customerAddress}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-slate-600">Delivery Zone</p>
                <Badge variant="outline" className="mt-1">
                  {order.deliveryZone.replace("_", " ")}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-600" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Created</p>
                <p className="font-medium text-slate-900 mt-1">
                  {new Date(order.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-slate-600">Last Updated</p>
                <p className="font-medium text-slate-900 mt-1">
                  {new Date(order.updatedAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Update Status Dialog */}
      <UpdateOrderStatusDialog
        open={statusDialog}
        onOpenChange={setStatusDialog}
        currentStatus={order.status}
        orderId={order.id}
        onConfirm={handleUpdateStatus}
        isUpdating={isPending}
      />
    </div>
  );
}

function getStatusIcon(status: OrderStatus) {
  const iconClass = "h-8 w-8";
  switch (status) {
    case "PENDING":
      return <Clock className={`${iconClass} text-yellow-600`} />;
    case "PROCESSING":
      return <RefreshCw className={`${iconClass} text-blue-600`} />;
    case "SHIPPED":
      return <Truck className={`${iconClass} text-purple-600`} />;
    case "DELIVERED":
      return <CheckCircle2 className={`${iconClass} text-green-600`} />;
    case "CANCELLED":
      return <XCircle className={`${iconClass} text-red-600`} />;
    default:
      return <Package className={`${iconClass} text-slate-600`} />;
  }
}
