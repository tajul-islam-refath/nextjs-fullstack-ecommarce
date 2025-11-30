"use server";

import { prisma } from "@/lib/prisma";
import { createOrderSchema, CreateOrderInput } from "@/lib/validations/order";
import { getCart, clearCart } from "@/lib/actions/cart";
import { getDeliveryCostByZoneAction } from "@/lib/actions/delivery";
import { revalidatePath, revalidateTag } from "next/cache";
import { ActionResult } from "@/lib/auth-utils";
import { TAGS } from "../constains";
import { getOrderStatuses, orderConfig } from "@/lib/config";

export async function placeOrder(
  data: CreateOrderInput
): Promise<ActionResult<{ orderId: string }>> {
  try {
    // 1. Validate Input
    const validatedData = createOrderSchema.parse(data);

    // 2. Get Cart
    const cart = await getCart();
    if (!cart || cart.items.length === 0) {
      return { success: false, error: "Your cart is empty" };
    }

    // 3. Calculate Totals
    // Calculate subtotal from cart items
    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.variant
        ? Number(item.variant.price)
        : Number(item.product.salePrice || item.product.basePrice);
      return sum + price * item.quantity;
    }, 0);

    // Get delivery cost
    const deliveryCostResult = await getDeliveryCostByZoneAction(
      validatedData.deliveryZone
    );
    if (!deliveryCostResult.success || !deliveryCostResult.data) {
      return { success: false, error: "Invalid delivery zone" };
    }
    const deliveryCost = deliveryCostResult.data.cost;

    const totalAmount = subtotal + deliveryCost;

    // 4. Create Order Transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          customerName: validatedData.customerName,
          customerMobile: validatedData.customerMobile,
          customerAddress: validatedData.customerAddress,
          deliveryZone: validatedData.deliveryZone,
          subtotal: subtotal,
          deliveryCost: deliveryCost,
          totalAmount: totalAmount,
          userId: cart.userId, // Link to user if logged in
          status: orderConfig.statuses.PENDING,
          paymentStatus: orderConfig.paymentStatuses.PENDING,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.product.name,
              variantName: item.variant?.name,
              sku: item.variant?.sku || item.product.sku,
              productImage:
                item.variant?.imageUrl || item.product.images[0]?.url,
              price: item.variant
                ? item.variant.price
                : item.product.salePrice || item.product.basePrice,
              quantity: item.quantity,
            })),
          },
        },
      });

      // Update Stock (Optional - can be done here or in a separate process)
      // For now, let's decrement stock
      for (const item of cart.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      return newOrder;
    });

    // 5. Clear Cart
    await clearCart();

    revalidatePath("/admin/orders");
    revalidatePath("/admin/products");
    revalidatePath("/api/products");
    revalidatePath("/api/orders");
    revalidateTag(TAGS.PRODUCT, "max");

    return { success: true, data: { orderId: order.id } };
  } catch (error) {
    console.error("Order placement error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to place order" };
  }
}

/**
 * Update order status
 * Automatically updates payment status to PAID when order is marked as DELIVERED
 */
export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<ActionResult<void>> {
  try {
    // Validate status using centralized config
    const validStatuses = getOrderStatuses();
    if (!validStatuses.includes(status)) {
      return { success: false, error: "Invalid order status" };
    }

    // Prepare update data
    const updateData: any = { status: status as any };

    // If order is marked as DELIVERED, automatically set payment status to PAID
    if (status === orderConfig.statuses.DELIVERED) {
      updateData.paymentStatus = orderConfig.paymentStatuses.PAID;
    }

    // Update order
    await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    // Revalidate caches
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidateTag(TAGS.ORDER, "max");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}
