import { getCart } from "@/lib/actions/cart";
import { CartClient } from "@/components/store/cart/CartClient";
import { toNumber, toOptionalNumber } from "@/lib/utils";

export default async function CartPage() {
  const cart = await getCart();

  if (!cart) {
    return <CartClient cart={null} />;
  }

  // Transform Decimal values to numbers for client component
  const serializedCart = {
    id: cart.id,
    userId: cart.userId,
    guestSessionId: cart.guestSessionId,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
    items: cart.items.map((item) => ({
      id: item.id,
      cartId: item.cartId,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        description: item.product.description,
        categoryId: item.product.categoryId,
        basePrice: toNumber(item.product.basePrice),
        salePrice: toOptionalNumber(item.product.salePrice),
        costPrice: toOptionalNumber(item.product.costPrice),
        stock: item.product.stock,
        sku: item.product.sku,
        featuredType: item.product.featuredType,
        hasVariants: item.product.hasVariants,
        metaTitle: item.product.metaTitle,
        metaDescription: item.product.metaDescription,
        metaKeywords: item.product.metaKeywords,
        weight: toOptionalNumber(item.product.weight),
        dimensions: item.product.dimensions,
        createdAt: item.product.createdAt,
        updatedAt: item.product.updatedAt,
        images: item.product.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          isPrimary: img.isPrimary,
        })),
      },
      variant: item.variant
        ? {
            id: item.variant.id,
            productId: item.variant.productId,
            sku: item.variant.sku,
            name: item.variant.name,
            options: item.variant.options,
            price: toNumber(item.variant.price),
            salePrice: toOptionalNumber(item.variant.salePrice),
            costPrice: toOptionalNumber(item.variant.costPrice),
            stock: item.variant.stock,
            imageUrl: item.variant.imageUrl,
            isActive: item.variant.isActive,
            createdAt: item.variant.createdAt,
            updatedAt: item.variant.updatedAt,
          }
        : null,
    })),
  };

  return <CartClient cart={serializedCart} />;
}
