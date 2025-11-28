"use server";

import { prisma } from "@/lib/prisma";
import { createOrderSchema, CreateOrderInput } from "@/lib/validations/order";
import { getCart, clearCart } from "@/lib/actions/cart";
import { getDeliveryCostByZoneAction } from "@/lib/actions/delivery";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ActionResult } from "@/lib/auth-utils";

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
          status: "PENDING",
          paymentStatus: "PENDING",
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

    return { success: true, data: { orderId: order.id } };
  } catch (error) {
    console.error("Order placement error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to place order" };
  }
}
