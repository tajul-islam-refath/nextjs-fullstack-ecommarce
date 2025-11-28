import { Suspense } from "react";
import SignInPage from "./SignInPage";

export default function page() {
  return (
    <Suspense fallback={null}>
      <SignInPage />
    </Suspense>
  );
}
