import { Suspense } from "react";
import CartPage from "./CartPage";

export const metadata = {
  title: "Shopping Cart - EcoShop",
  description: "Review your shopping cart",
};

export default async function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CartPage />
    </Suspense>
  );
}
