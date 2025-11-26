import { Suspense } from "react";
import { BannerManagementClient } from "@/components/banners/BannerManagementClient";
import { getBannersAction } from "@/lib/actions/banner";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Banners | Admin Dashboard",
  description: "Manage your promotional banners",
};

export default async function BannersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;

  const { data: result } = await getBannersAction({
    page,
    limit,
    sortBy: "position",
    sortOrder: "asc",
  });

  const banners = result?.data || [];
  const pagination = result?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        }
      >
        <BannerManagementClient
          initialBanners={banners}
          initialPagination={pagination}
        />
      </Suspense>
    </div>
  );
}
