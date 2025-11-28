import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SuccessPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function SuccessPage({ params }: SuccessPageProps) {
  const { orderId } = await params;
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center bg-white p-10 rounded-xl shadow-sm">
        <div className="flex justify-center">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Order Placed Successfully!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Thank you for your purchase. Your order ID is{" "}
          <span className="font-mono font-bold text-gray-900">{orderId}</span>
        </p>
        <p className="text-sm text-gray-500">
          We will contact you shortly to confirm your order details.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button className="w-full" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
