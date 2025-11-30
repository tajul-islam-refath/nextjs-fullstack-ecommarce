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

/**
 * Get analytics data
 */
export async function getAnalyticsData(
  period: "7d" | "30d" | "this_month" | "last_month" = "7d"
) {
  try {
    const orderService = new OrderService(prisma);
    const now = new Date();
    let startDate = new Date();
    let endDate = now;

    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "this_month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "last_month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
    }

    const [salesData, topProducts] = await Promise.all([
      orderService.getSalesAnalytics(startDate, endDate),
      orderService.getTopSellingProducts(5),
    ]);

    return {
      success: true,
      data: {
        salesData,
        topProducts,
        period: {
          start: startDate,
          end: endDate,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return {
      success: false,
      error: "Failed to fetch analytics data",
    };
  }
}
