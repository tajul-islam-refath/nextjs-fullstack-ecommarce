"use client";

import React from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { orderConfig } from "@/lib/config";
import { OrderStatus } from "@/app/generated/prisma/enums";

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

interface InvoiceTemplateProps {
  order: Order;
}

export const InvoiceTemplate = React.forwardRef<
  HTMLDivElement,
  InvoiceTemplateProps
>(({ order }, ref) => {
  const statusInfo = orderConfig.statusDisplay[order.status];

  return (
    <div ref={ref} className="bg-white p-12 max-w-4xl mx-auto">
      {/* Invoice Header */}
      <div className="border-b-4 border-slate-900 pb-8 mb-8">
        <div className="flex justify-between items-start">
          {/* Company Logo & Info */}
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">INVOICE</h1>
            <div className="text-slate-600">
              <p className="font-semibold text-lg">Your Company Name</p>
              <p className="text-sm">123 Business Street</p>
              <p className="text-sm">Dhaka, Bangladesh</p>
              <p className="text-sm">Phone: +880 1234-567890</p>
              <p className="text-sm">Email: info@yourcompany.com</p>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="text-right">
            <div className="bg-slate-900 text-white px-6 py-3 rounded-lg mb-4">
              <p className="text-sm font-medium">Invoice Number</p>
              <p className="text-lg font-bold font-mono">
                #{order.id.slice(0, 12).toUpperCase()}
              </p>
            </div>
            <div className="text-sm text-slate-600 space-y-1">
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    statusInfo?.color || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {statusInfo?.label || order.status}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To Section */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 border-b-2 border-slate-300 pb-2">
            Bill To
          </h2>
          <div className="text-slate-700">
            <p className="font-semibold text-lg mb-1">{order.customerName}</p>
            <p className="text-sm mb-1">
              <span className="font-medium">Mobile:</span>{" "}
              {order.customerMobile}
            </p>
            <p className="text-sm">
              <span className="font-medium">Address:</span>
            </p>
            <p className="text-sm text-slate-600">{order.customerAddress}</p>
            <p className="text-sm mt-2">
              <span className="font-medium">Delivery Zone:</span>{" "}
              <span className="inline-block px-2 py-1 bg-slate-100 rounded text-xs font-medium mt-1">
                {order.deliveryZone.replace("_", " ")}
              </span>
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 border-b-2 border-slate-300 pb-2">
            Payment Information
          </h2>
          <div className="text-slate-700 text-sm space-y-2">
            <p>
              <span className="font-medium">Payment Method:</span>{" "}
              {order.paymentMethod || "Cash on Delivery"}
            </p>
            <p>
              <span className="font-medium">Payment Status:</span>{" "}
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                  order.paymentStatus === "PAID"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.paymentStatus}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="text-left py-3 px-4 font-semibold text-sm uppercase tracking-wide">
                Item
              </th>
              <th className="text-center py-3 px-4 font-semibold text-sm uppercase tracking-wide">
                SKU
              </th>
              <th className="text-right py-3 px-4 font-semibold text-sm uppercase tracking-wide">
                Price
              </th>
              <th className="text-center py-3 px-4 font-semibold text-sm uppercase tracking-wide">
                Qty
              </th>
              <th className="text-right py-3 px-4 font-semibold text-sm uppercase tracking-wide">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-slate-50" : "bg-white"
                }`}
              >
                <td className="py-4 px-4">
                  <p className="font-medium text-slate-900">
                    {item.productName}
                  </p>
                  {item.variantName && (
                    <p className="text-xs text-slate-600 mt-1">
                      Variant: {item.variantName}
                    </p>
                  )}
                </td>
                <td className="py-4 px-4 text-center text-sm font-mono text-slate-600">
                  {item.sku || "N/A"}
                </td>
                <td className="py-4 px-4 text-right font-medium text-slate-900">
                  {formatPrice(item.price)}
                </td>
                <td className="py-4 px-4 text-center font-medium text-slate-900">
                  {item.quantity}
                </td>
                <td className="py-4 px-4 text-right font-semibold text-slate-900">
                  {formatPrice(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-700 font-medium">Subtotal:</span>
              <span className="text-slate-900 font-semibold">
                {formatPrice(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-700 font-medium">
                Delivery Cost ({order.deliveryZone.replace("_", " ")}):
              </span>
              <span className="text-slate-900 font-semibold">
                {formatPrice(order.deliveryCost)}
              </span>
            </div>
            <div className="flex justify-between py-3 bg-slate-900 text-white px-4 rounded-lg">
              <span className="font-bold text-lg">TOTAL:</span>
              <span className="font-bold text-xl">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = "InvoiceTemplate";
