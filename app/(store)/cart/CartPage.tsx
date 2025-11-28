import { getCart } from "@/lib/actions/cart";
import { CartClient } from "@/components/store/cart/CartClient";

export default async function CartPage() {
  const cart = await getCart();

  // Transform Decimal values to numbers for client component
  const serializedCart = cart
    ? {
        ...cart,
        items: cart.items.map((item) => ({
          ...item,
          product: {
            ...item.product,
            basePrice: Number(item.product.basePrice),
            salePrice: item.product.salePrice
              ? Number(item.product.salePrice)
              : null,
            costPrice: item.product.costPrice
              ? Number(item.product.costPrice)
              : null,
            weight: item.product.weight ? Number(item.product.weight) : null,
          },
          variant: item.variant
            ? {
                ...item.variant,
                price: Number(item.variant.price),
                salePrice: item.variant.salePrice
                  ? Number(item.variant.salePrice)
                  : null,
                costPrice: item.variant.costPrice
                  ? Number(item.variant.costPrice)
                  : null,
              }
            : null,
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <CartClient cart={serializedCart} />
      </div>
    </div>
  );
}
