import { notFound } from "next/navigation";
import { BannerForm } from "@/components/banners/BannerForm";
import { BannerService } from "@/lib/service/banner.service";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Edit Banner | Admin Dashboard",
  description: "Edit banner details",
};

interface EditBannerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const { id } = await params;
  const bannerService = new BannerService(prisma);

  const banner = await bannerService.getBannerById(id);

  if (!banner) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Edit Banner</h1>
        <p className="text-slate-600 mt-1">Update banner information</p>
      </div>

      <BannerForm initialData={banner} mode="edit" />
    </div>
  );
}
