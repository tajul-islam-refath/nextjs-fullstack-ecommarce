import { OrderStatus } from "@/app/generated/prisma/enums";

export interface OrderItem {
  id: string;
  productName: string;
  variantName: string | null;
  quantity: number;
  price: number; // Serialized from Prisma Decimal
}

export interface OrderListItem {
  id: string;
  customerName: string;
  customerMobile: string;
  customerAddress: string;
  status: OrderStatus;
  totalAmount: number; // Serialized from Prisma Decimal
  createdAt: Date;
  items: OrderItem[];
}

export interface OrderDetail extends OrderListItem {
  deliveryZone: string;
  subtotal: number; // Serialized from Prisma Decimal
  deliveryCost: number; // Serialized from Prisma Decimal
  paymentStatus: string;
  updatedAt: Date;
}
