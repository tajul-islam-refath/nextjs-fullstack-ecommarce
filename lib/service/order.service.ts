import {
  PrismaClient,
  Prisma,
  OrderStatus,
} from "@/app/generated/prisma/client";
import type { GetOrdersInput } from "@/lib/validations/order";
import { orderConfig } from "@/lib/config";

export class OrderService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get paginated orders with search and filters
   */
  async getPaginatedOrders(query: GetOrdersInput) {
    const { page, limit, search, status } = query;

    // Build where clause
    const where: Prisma.OrderWhereInput = {};

    // Filter by status
    if (status) {
      where.status = status as OrderStatus;
    }

    // Search by order ID, customer name, or mobile
    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerMobile: { contains: search, mode: "insensitive" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries in parallel
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            select: {
              id: true,
              productName: true,
              variantName: true,
              quantity: true,
              price: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrevious,
      },
    };
  }

  /**
   * Get order by ID with all relations
   */
  async getOrderById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Get order statistics
   */
  async getOrderStatistics() {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({
        where: { status: orderConfig.statuses.PENDING },
      }),
      this.prisma.order.count({
        where: { status: orderConfig.statuses.PROCESSING },
      }),
      this.prisma.order.count({
        where: { status: orderConfig.statuses.SHIPPED },
      }),
      this.prisma.order.count({
        where: { status: orderConfig.statuses.DELIVERED },
      }),
      this.prisma.order.count({
        where: { status: orderConfig.statuses.CANCELLED },
      }),
      this.prisma.order.aggregate({
        where: { status: { not: orderConfig.statuses.CANCELLED } },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
    };
  }
}
