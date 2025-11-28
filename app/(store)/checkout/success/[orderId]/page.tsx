import { Suspense } from "react";
import SuccessPage from "./SuccessPage";

interface SuccessPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function page({ params }: SuccessPageProps) {
  return (
    <Suspense fallback={null}>
      <SuccessPage params={params} />
    </Suspense>
  );
}
