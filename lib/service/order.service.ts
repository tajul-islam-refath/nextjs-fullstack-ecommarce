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
  /**
   * Get sales analytics grouped by date
   */
  async getSalesAnalytics(startDate: Date, endDate: Date) {
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          not: orderConfig.statuses.CANCELLED,
        },
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group by date
    const salesByDate = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { date, sales: 0, orders: 0 };
      }
      acc[date].sales += Number(order.totalAmount);
      acc[date].orders += 1;
      return acc;
    }, {} as Record<string, { date: string; sales: number; orders: number }>);

    return Object.values(salesByDate).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }

  /**
   * Get top selling products
   */
  async getTopSellingProducts(limit: number = 5) {
    const topProducts = await this.prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    });

    return topProducts.map((item) => ({
      id: item.productId,
      name: item.productName,
      quantity: item._sum.quantity || 0,
    }));
  }
}
