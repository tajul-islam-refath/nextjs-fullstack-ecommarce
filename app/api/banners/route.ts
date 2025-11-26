import { NextRequest, NextResponse } from "next/server";
import { BannerService } from "@/lib/service/banner.service";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const bannerService = new BannerService(prisma);
    const banners = await bannerService.getActiveBanners();

    return NextResponse.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error("Error fetching active banners:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch banners",
      },
      { status: 500 }
    );
  }
}
