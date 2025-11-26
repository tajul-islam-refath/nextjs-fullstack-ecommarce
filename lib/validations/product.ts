import { z } from "zod";

/**
 * Product Validation Schemas
 */

// Pagination query schema for products
export const productPaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  featuredType: z.enum(["LATEST", "HOT", "POPULAR"]).optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  hasVariants: z.coerce.boolean().optional(),
  sortBy: z
    .enum(["createdAt", "name", "basePrice", "updatedAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ProductPaginationQuery = z.infer<
  typeof productPaginationQuerySchema
>;

// Product image schema
export const productImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  alt: z.string().optional(),
  position: z.number().int().nonnegative(),
  isPrimary: z.boolean(),
});

export type ProductImageInput = z.infer<typeof productImageSchema>;

// Variant option schema
export const variantOptionSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  values: z.array(z.string()).min(1, "At least one value is required"),
});

export type VariantOptionInput = z.infer<typeof variantOptionSchema>;

// Product variant schema
export const productVariantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Variant name is required"),
  options: z.string(), // JSON string
  price: z.number().positive("Price must be positive"),
  salePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;

// Create product schema
export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  basePrice: z.number().positive("Price must be positive"),
  salePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  stock: z.number().int().nonnegative(),
  sku: z.string().optional(),
  featuredType: z.enum(["LATEST", "HOT", "POPULAR"]).optional(),
  hasVariants: z.boolean(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  weight: z.number().positive().optional(),
  dimensions: z.string().optional(),
  images: z.array(productImageSchema).optional(),
  variantOptions: z.array(variantOptionSchema).optional(),
  variants: z.array(productVariantSchema).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

// Update product schema
export const updateProductSchema = createProductSchema.partial();

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
