"use server";

import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { CategoryService } from "@/lib/service/category.service";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
  paginationQuerySchema,
} from "@/lib/validations/category";
import { ActionResult, withAdmin } from "@/lib/auth-utils";
import { ZodError } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Create a new category
 * Protected: Admin only
 */
export const createCategoryAction = withAdmin(
  async (data: unknown): Promise<ActionResult<{ id: string; name: string; slug: string }>> => {
    try {
      // Validate input
      const validated = createCategorySchema.parse(data);

      // Create service instance
      const categoryService = new CategoryService(prisma);

      // Create category
      const category = await categoryService.createCategory(validated);

      // Revalidate category cache
      revalidateTag("categories", "default");
      revalidatePath("/admin/categories");
      revalidatePath("/api/categories", "layout");

      return {
        success: true,
        data: {
          id: category.id,
          name: category.name,
          slug: category.slug,
        },
      };
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        return {
          success: false,
          error: error.issues[0].message,
        };
      }

      // Handle Prisma unique constraint violation
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return {
            success: false,
            error: "A category with this slug already exists",
          };
        }
      }

      // Handle unexpected errors
      console.error("Error creating category:", error);
      return {
        success: false,
        error: "Failed to create category. Please try again.",
      };
    }
  }
);

/**
 * Update an existing category
 * Protected: Admin only
 */
export const updateCategoryAction = withAdmin(
  async (
    id: string,
    data: unknown
  ): Promise<ActionResult<{ id: string; name: string; slug: string }>> => {
    try {
      // Validate ID
      categoryIdSchema.parse({ id });

      // Validate update data
      const validated = updateCategorySchema.parse(data);

      // Create service instance
      const categoryService = new CategoryService(prisma);

      // Check if category exists
      const existing = await categoryService.getCategoryById(id);
      if (!existing) {
        return {
          success: false,
          error: "Category not found",
        };
      }

      // Update category
      const category = await categoryService.updateCategory(id, validated);

      // Revalidate category cache
      revalidateTag("categories", "default");
      revalidatePath("/admin/categories");
      revalidatePath("/api/categories", "layout");

      return {
        success: true,
        data: {
          id: category.id,
          name: category.name,
          slug: category.slug,
        },
      };
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        return {
          success: false,
          error: error.issues[0].message,
        };
      }

      // Handle Prisma unique constraint violation
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return {
            success: false,
            error: "A category with this slug already exists",
          };
        }
        if (error.code === "P2025") {
          return {
            success: false,
            error: "Category not found",
          };
        }
      }

      // Handle unexpected errors
      console.error("Error updating category:", error);
      return {
        success: false,
        error: "Failed to update category. Please try again.",
      };
    }
  }
);

/**
 * Delete a category
 * Protected: Admin only
 */
export const deleteCategoryAction = withAdmin(
  async (id: string): Promise<ActionResult<{ message: string }>> => {
    try {
      // Validate ID
      categoryIdSchema.parse({ id });

      // Create service instance
      const categoryService = new CategoryService(prisma);

      // Check if category exists
      const existing = await categoryService.getCategoryById(id);
      if (!existing) {
        return {
          success: false,
          error: "Category not found",
        };
      }

      // Delete category
      await categoryService.deleteCategory(id);

      // Revalidate category cache
      revalidateTag("categories", "default");
      revalidatePath("/admin/categories");
      revalidatePath("/api/categories", "layout");

      return {
        success: true,
        data: { message: "Category deleted successfully" },
      };
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        return {
          success: false,
          error:       error.issues[0].message,
        };
      }

      // Handle Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return {
            success: false,
            error: "Category not found",
          };
        }
        // Handle foreign key constraint (if category is used elsewhere)
        if (error.code === "P2003") {
          return {
            success: false,
            error: "Cannot delete category. It is being used by products.",
          };
        }
      }

      // Handle unexpected errors
      console.error("Error deleting category:", error);
      return {
        success: false,
        error: "Failed to delete category. Please try again.",
      };
    }
  }
);

/**
 * Get paginated categories
 * Public access
 */
export async function getCategoriesAction(
  params?: unknown
): Promise<
  ActionResult<{
    categories: Array<{ id: string; name: string; slug: string; createdAt: Date; updatedAt: Date }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  }>
> {
  try {
    // Validate and set defaults for pagination
    const validated = params
      ? paginationQuerySchema.parse(params)
      : { page: 1, limit: 10 };

    // Create service instance
    const categoryService = new CategoryService(prisma);

    // Get paginated categories
    const result = await categoryService.getPaginatedCategories(
      validated.page,
      validated.limit
    );

    return {
      success: true,
      data: {
        categories: result.data,
        pagination: result.pagination,
      },
    };
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return {
        success: false,
        error:       error.issues[0].message,
      };
    }

    // Handle unexpected errors
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: "Failed to fetch categories. Please try again.",
    };
  }
}

/**
 * Get a single category by ID
 * Public access
 */
export async function getCategoryByIdAction(
  id: string
): Promise<ActionResult<{ id: string; name: string; slug: string } | null>> {
  try {
      // Validate ID
      categoryIdSchema.parse({ id });

      // Create service instance
      const categoryService = new CategoryService(prisma);

      // Get category
      const category = await categoryService.getCategoryById(id);

    if (!category) {
      return {
        success: true,
        data: null,
      };
    }

    return {
      success: true,
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
      },
    };
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return {
        success: false,
        error:       error.issues[0].message,
      };
    }

    // Handle unexpected errors
    console.error("Error fetching category:", error);
    return {
      success: false,
      error: "Failed to fetch category. Please try again.",
    };
  }
}
