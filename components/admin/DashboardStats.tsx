"use client";

import {
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { currencyConfig } from "@/lib/config";

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

interface DashboardStatsProps {
  totalProducts: number;
  orderStats: OrderStats;
}

export function DashboardStats({
  totalProducts,
  orderStats,
}: DashboardStatsProps) {
  const formatCurrency = (amount: number) => {
    return `${currencyConfig.symbol}${amount.toLocaleString(
      currencyConfig.locale,
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
    )}`;
  };

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Products */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Products
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {totalProducts}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Orders</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {orderStats.totalOrders}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {formatCurrency(orderStats.totalRevenue)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6">
          Order Status Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pending Orders */}
          <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-800">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">
                {orderStats.pendingOrders}
              </p>
            </div>
          </div>

          {/* Processing Orders */}
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Processing</p>
              <p className="text-2xl font-bold text-blue-900">
                {orderStats.processingOrders}
              </p>
            </div>
          </div>

          {/* Shipped Orders */}
          <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-800">Shipped</p>
              <p className="text-2xl font-bold text-purple-900">
                {orderStats.shippedOrders}
              </p>
            </div>
          </div>

          {/* Delivered Orders */}
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Delivered</p>
              <p className="text-2xl font-bold text-green-900">
                {orderStats.deliveredOrders}
              </p>
            </div>
          </div>
        </div>

        {/* Cancelled Orders - Full Width */}
        {orderStats.cancelledOrders > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="bg-red-100 p-2 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-800">
                  Cancelled Orders
                </p>
                <p className="text-2xl font-bold text-red-900">
                  {orderStats.cancelledOrders}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
