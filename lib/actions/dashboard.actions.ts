"use server";

import { prisma } from "@/lib/prisma";
import { OrderService } from "@/lib/service/order.service";

/**
 * Get dashboard statistics
 * Includes order stats, revenue, and product count
 */
export async function getDashboardStats() {
  try {
    const orderService = new OrderService(prisma);

    // Fetch order statistics and product count in parallel
    const [orderStats, productCount] = await Promise.all([
      orderService.getOrderStatistics(),
      prisma.product.count(),
    ]);

    return {
      success: true,
      data: {
        ...orderStats,
        totalProducts: productCount,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      error: "Failed to fetch dashboard statistics",
    };
  }
}
