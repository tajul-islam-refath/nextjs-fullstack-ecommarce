import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getAnalyticsData } from "@/lib/actions/dashboard.actions";
import AnalyticsClient from "@/components/admin/analytics/AnalyticsClient";
import { cacheLife } from "next/cache";

export const metadata = {
  title: "Analytics | Admin Dashboard",
  description: "View sales analytics and insights",
};

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-600 mt-1">
          Monitor your store's performance and sales trends
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        }
      >
        <AnalyticsContent />
      </Suspense>
    </div>
  );
}

async function AnalyticsContent() {
  "use cache";
  cacheLife("minutes");
  // Initial load with default 7d period
  const result = await getAnalyticsData("7d");

  if (!result.success || !result.data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Failed to load analytics data</p>
      </div>
    );
  }

  return <AnalyticsClient initialData={result.data} />;
}
