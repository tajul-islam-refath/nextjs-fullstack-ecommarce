import { OrderStatus } from "@/app/generated/prisma/enums";

export interface OrderItem {
  id: string;
  productName: string;
  variantName: string | null;
  quantity: number;
  price: any; // Decimal from Prisma
}

export interface OrderListItem {
  id: string;
  customerName: string;
  customerMobile: string;
  customerAddress: string;
  status: OrderStatus;
  totalAmount: any; // Decimal from Prisma
  createdAt: Date;
  items: OrderItem[];
}

export interface OrderDetail extends OrderListItem {
  deliveryZone: string;
  subtotal: any; // Decimal from Prisma
  deliveryCost: any; // Decimal from Prisma
  paymentStatus: string;
  updatedAt: Date;
}
