import Link from "next/link";
import { ArrowLeft, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderNotFound() {
  return (
    <div className="container mx-auto py-16">
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="rounded-full bg-slate-100 p-6 mb-6">
          <PackageX className="h-16 w-16 text-slate-400" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Order Not Found
        </h1>
        <p className="text-slate-600 mb-8 max-w-md">
          The order you're looking for doesn't exist or may have been removed.
        </p>
        <Button
          asChild
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
      </div>
    </div>
  );
}
