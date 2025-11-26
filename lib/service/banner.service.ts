import { PrismaClient, Prisma } from "@/app/generated/prisma/client";
import type { BannerPaginationQuery } from "@/lib/validations/banner";

export class BannerService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get paginated banners
   */
  async getPaginatedBanners(query: BannerPaginationQuery) {
    const { page, limit, isActive, sortBy } = query;

    // Build where clause
    const where: Prisma.BannerWhereInput = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build orderBy
    const orderBy: Prisma.BannerOrderByWithRelationInput = {
      [sortBy]: "asc",
    };

    // Execute queries in parallel
    const [banners, total] = await Promise.all([
      this.prisma.banner.findMany({
        where,
        skip,
        take: limit,
      }),
      this.prisma.banner.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data: banners,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrevious,
      },
    };
  }

  /**
   * Get active banners (for public display)
   */
  async getActiveBanners() {
    return this.prisma.banner.findMany({
      where: {
        isActive: true,
      },
      orderBy: { position: "asc" },
    });
  }

  /**
   * Get banner by ID
   */
  async getBannerById(id: string) {
    return this.prisma.banner.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new banner
   */
  async createBanner(data: Prisma.BannerCreateInput) {
    return this.prisma.banner.create({
      data,
    });
  }

  /**
   * Update a banner
   */
  async updateBanner(id: string, data: Prisma.BannerUpdateInput) {
    return this.prisma.banner.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a banner
   */
  async deleteBanner(id: string) {
    return this.prisma.banner.delete({
      where: { id },
    });
  }

  /**
   * Toggle banner active status
   */
  async toggleBannerStatus(id: string) {
    const banner = await this.getBannerById(id);
    if (!banner) {
      throw new Error("Banner not found");
    }

    return this.updateBanner(id, {
      isActive: !banner.isActive,
    });
  }
}
