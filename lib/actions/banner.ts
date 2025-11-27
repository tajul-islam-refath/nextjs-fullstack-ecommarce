"use server";

import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { BannerService } from "@/lib/service/banner.service";
import {
  createBannerSchema,
  updateBannerSchema,
  bannerPaginationQuerySchema,
} from "@/lib/validations/banner";
import { ActionResult, withAdmin } from "@/lib/auth-utils";
import { ZodError } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { TAGS } from "../constains";

/**
 * Create a new banner
 * Protected: Admin only
 */
export const createBannerAction = withAdmin(
  async (data: unknown): Promise<ActionResult<{ id: string }>> => {
    try {
      const validated = createBannerSchema.parse(data);
      const bannerService = new BannerService(prisma);

      const bannerData: Prisma.BannerCreateInput = {
        imageUrl: validated.imageUrl,
        linkUrl: validated.linkUrl || null,
        position: validated.position,
        isActive: validated.isActive,
      };

      const banner = await bannerService.createBanner(bannerData);

      revalidateTag(TAGS.BANNER, "max");
      revalidatePath("/admin/banners");
      revalidatePath(`/api/banners`);

      return {
        success: true,
        data: {
          id: banner.id,
        },
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return { success: false, error: error.issues[0].message };
      }
      console.error("Error creating banner:", error);
      return { success: false, error: "Failed to create banner" };
    }
  }
);

/**
 * Update a banner
 * Protected: Admin only
 */
export const updateBannerAction = withAdmin(
  async (id: string, data: unknown): Promise<ActionResult<{ id: string }>> => {
    try {
      const validated = updateBannerSchema.parse(data);
      const bannerService = new BannerService(prisma);

      const bannerData: Prisma.BannerUpdateInput = {
        imageUrl: validated.imageUrl,
        linkUrl:
          validated.linkUrl !== undefined
            ? validated.linkUrl || null
            : undefined,
        position: validated.position,
        isActive: validated.isActive,
      };

      const banner = await bannerService.updateBanner(id, bannerData);

      revalidateTag(TAGS.BANNER, "max");
      revalidatePath("/admin/banners");
      revalidatePath(`/api/banners`);

      return {
        success: true,
        data: {
          id: banner.id,
        },
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return { success: false, error: error.issues[0].message };
      }
      console.error("Error updating banner:", error);
      return { success: false, error: "Failed to update banner" };
    }
  }
);

/**
 * Delete a banner
 * Protected: Admin only
 */
export const deleteBannerAction = withAdmin(
  async (id: string): Promise<ActionResult<{ message: string }>> => {
    try {
      const bannerService = new BannerService(prisma);
      await bannerService.deleteBanner(id);

      revalidateTag(TAGS.BANNER, "max");
      revalidatePath("/admin/banners");
      revalidatePath(`/api/banners`);

      return {
        success: true,
        data: { message: "Banner deleted successfully" },
      };
    } catch (error) {
      console.error("Error deleting banner:", error);
      return { success: false, error: "Failed to delete banner" };
    }
  }
);

/**
 * Toggle banner status
 * Protected: Admin only
 */
export const toggleBannerStatusAction = withAdmin(
  async (id: string): Promise<ActionResult<{ isActive: boolean }>> => {
    try {
      const bannerService = new BannerService(prisma);
      const banner = await bannerService.toggleBannerStatus(id);

      revalidateTag(TAGS.BANNER, "max");
      revalidatePath("/admin/banners");
      revalidatePath(`/api/banners`);

      return {
        success: true,
        data: { isActive: banner.isActive },
      };
    } catch (error) {
      console.error("Error toggling banner status:", error);
      return { success: false, error: "Failed to toggle banner status" };
    }
  }
);

/**
 * Get paginated banners
 */
export async function getBannersAction(params?: unknown) {
  try {
    const validated = params
      ? bannerPaginationQuerySchema.parse(params)
      : {
          page: 1,
          limit: 10,
          sortBy: "position" as const,
        };
    const bannerService = new BannerService(prisma);
    const result = await bannerService.getPaginatedBanners(validated);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching banners:", error);
    return { success: false, error: "Failed to fetch banners" };
  }
}
