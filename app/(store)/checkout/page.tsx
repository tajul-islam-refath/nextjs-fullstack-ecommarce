import { Suspense } from "react";
import CheckoutPage from "./Checkout";

export default function page() {
  return (
    <Suspense>
      <CheckoutPage />
    </Suspense>
  );
}
