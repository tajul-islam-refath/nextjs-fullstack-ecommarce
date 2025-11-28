import { getCart } from "@/lib/actions/cart";
import { getDeliveryCostsAction } from "@/lib/actions/delivery";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const deliveryCostsResult = await getDeliveryCostsAction();
  const deliveryCosts =
    deliveryCostsResult.success && deliveryCostsResult.data
      ? deliveryCostsResult.data
      : [];

  const cartItems = cart.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    product: {
      name: item.product.name,
      price: Number(item.product.basePrice),
      salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
      basePrice: Number(item.product.basePrice),
      images: item.product.images,
    },
    variant: item.variant
      ? {
          name: item.variant.name,
          price: Number(item.variant.price),
        }
      : null,
  }));

  return <CheckoutClient cartItems={cartItems} deliveryCosts={deliveryCosts} />;
}
