"use server";

import { getGuestSessionToken } from "@/lib/guest";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Helper function to verify cart ownership
 * Returns the cart if the current user/guest owns it, null otherwise
 */
async function verifyCartOwnership(cartId: string) {
  const guestToken = await getGuestSessionToken();

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { guestSession: true },
  });

  if (!cart) return null;

  // Check guest ownership
  if (guestToken && cart.guestSession?.sessionToken === guestToken) {
    return cart;
  }

  return null;
}

/**
 * Helper function to get or create cart for current user/guest
 */
async function getOrCreateCart() {
  const guestToken = await getGuestSessionToken();

  if (!guestToken) {
    throw new Error("No session found. Please refresh the page.");
  }

  const guestSession = await prisma.guestSession.findUnique({
    where: { sessionToken: guestToken },
  });

  if (!guestSession) {
    throw new Error("Invalid session. Please refresh the page.");
  }

  let cart = await prisma.cart.findUnique({
    where: { guestSessionId: guestSession.id },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { guestSessionId: guestSession.id },
    });
  }

  return cart;
}

/**
 * Get cart for current user or guest
 */
export async function getCart() {
  const guestToken = await getGuestSessionToken();

  if (!guestToken) return null;

  const guestSession = await prisma.guestSession.findUnique({
    where: { sessionToken: guestToken },
  });

  if (!guestSession) return null;

  return await prisma.cart.findUnique({
    where: { guestSessionId: guestSession.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
          variant: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

/**
 * Add item to cart with validation and ownership checks
 */
export async function addToCart(
  productId: string,
  variantId: string | null,
  quantity: number
) {
  // Input validation
  if (!productId || typeof productId !== "string") {
    throw new Error("Invalid product ID");
  }

  if (quantity < 1 || quantity > 99) {
    throw new Error("Quantity must be between 1 and 99");
  }

  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // If variant is specified, verify it exists and belongs to the product
  if (variantId) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) {
      throw new Error("Product variant not found");
    }
    if (!variant.isActive) {
      throw new Error("This product variant is no longer available");
    }
  }

  // Get or create cart
  const cart = await getOrCreateCart();

  // Check for existing item
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      variantId: variantId,
    },
  });

  if (existingItem) {
    // Update quantity, but cap at 99
    const newQuantity = Math.min(existingItem.quantity + quantity, 99);
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    // Create new cart item
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId,
        quantity,
      },
    });
  }

  revalidatePath("/cart");
}

/**
 * Remove item from cart with ownership verification
 */
export async function removeFromCart(itemId: string) {
  // Input validation
  if (!itemId || typeof itemId !== "string") {
    throw new Error("Invalid item ID");
  }

  const guestToken = await getGuestSessionToken();

  if (!guestToken) {
    throw new Error("No session found");
  }

  // Fetch item with cart and session info
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: {
      cart: {
        include: {
          guestSession: true,
        },
      },
    },
  });

  if (!item) {
    throw new Error("Cart item not found");
  }

  // Verify ownership
  const isOwner = item.cart.guestSession?.sessionToken === guestToken;

  if (!isOwner) {
    throw new Error("Unauthorized: You don't own this cart item");
  }

  // Delete the item
  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  revalidatePath("/cart");
}

/**
 * Update cart item quantity with ownership verification
 */
export async function updateCartItemQuantity(itemId: string, quantity: number) {
  // Input validation
  if (!itemId || typeof itemId !== "string") {
    throw new Error("Invalid item ID");
  }

  if (quantity < 1) {
    return removeFromCart(itemId);
  }

  if (quantity > 99) {
    throw new Error("Quantity cannot exceed 99");
  }

  const guestToken = await getGuestSessionToken();

  if (!guestToken) {
    throw new Error("No session found");
  }

  // Fetch item with cart and session info
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: {
      cart: {
        include: {
          guestSession: true,
        },
      },
    },
  });

  if (!item) {
    throw new Error("Cart item not found");
  }

  // Verify ownership
  const isOwner = item.cart.guestSession?.sessionToken === guestToken;

  if (!isOwner) {
    throw new Error("Unauthorized: You don't own this cart item");
  }

  // Update quantity
  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  revalidatePath("/cart");
}

/**
 * Clear entire cart for current user/guest
 */
export async function clearCart() {
  const guestToken = await getGuestSessionToken();

  if (!guestToken) {
    throw new Error("No session found");
  }

  const guestSession = await prisma.guestSession.findUnique({
    where: { sessionToken: guestToken },
  });

  if (!guestSession) {
    throw new Error("Invalid session");
  }

  const cart = await prisma.cart.findUnique({
    where: { guestSessionId: guestSession.id },
  });

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  revalidatePath("/cart");
}
