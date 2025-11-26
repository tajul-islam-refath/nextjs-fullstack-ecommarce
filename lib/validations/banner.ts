import { z } from "zod";

/**
 * Banner Validation Schemas
 */

// Create banner schema
export const createBannerSchema = z.object({
  imageUrl: z.string().min(1, "Banner image is required"),
  linkUrl: z.string().optional(),
  position: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

export type CreateBannerInput = z.infer<typeof createBannerSchema>;

// Update banner schema
export const updateBannerSchema = createBannerSchema.partial();

export type UpdateBannerInput = z.infer<typeof updateBannerSchema>;

// Pagination query schema for banners
export const bannerPaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(["createdAt", "position"]).default("position"),
});

export type BannerPaginationQuery = z.infer<typeof bannerPaginationQuerySchema>;
