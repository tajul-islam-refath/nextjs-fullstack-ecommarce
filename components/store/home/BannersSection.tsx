import { prisma } from "@/lib/prisma";
import { BannerService } from "@/lib/service/banner.service";
import { BannerCarousel } from "@/components/store/BannerCarousel";

export function BannerSkeleton() {
  return (
    <div className="aspect-21/9 w-full animate-pulse rounded-xl bg-(--gray-200) sm:aspect-16/7 md:aspect-21/6" />
  );
}

export async function BannersSection() {
  const bannerService = new BannerService(prisma);
  const banners = await bannerService.getActiveBanners();

  if (banners.length === 0) {
    return null;
  }

  return <BannerCarousel banners={banners} />;
}
