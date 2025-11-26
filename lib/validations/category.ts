import { z } from 'zod';

/**
 * Pagination query parameters validation schema
 * Following Single Responsibility Principle - only validates pagination params
 */
export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive().max(1000)),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive().max(100)),
});

/**
 * Category creation validation schema
 * For future POST endpoint
 */
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase and kebab-case'),
});

/**
 * Category update validation schema
 * For PATCH/PUT endpoint
 */
export const updateCategorySchema = createCategorySchema.partial();

/**
 * Category ID validation schema
 * For get/delete operations
 */
export const categoryIdSchema = z.object({
  id: z.string().min(1, 'Category ID is required'),
});

/**
 * Type inference from schemas
 */
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type CreateCategoryData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryData = z.infer<typeof updateCategorySchema>;
export type CategoryIdData = z.infer<typeof categoryIdSchema>;
