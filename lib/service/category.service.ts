import { PrismaClient, Category } from "@/app/generated/prisma/client";
import {
  PaginatedResponse,
  createPaginationMetadata,
} from "@/types/pagination.types";

/**
 * CategoryService
 * Following SOLID Principles:
 * - Single Responsibility: Handles only category data operations
 * - Dependency Inversion: Depends on PrismaClient abstraction
 * - Open/Closed: Easy to extend with new methods
 */
export class CategoryService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Get paginated categories
   * Performance optimizations:
   * - Database-level pagination (skip/take)
   * - Parallel execution of count and data queries
   * - Indexed slug field for efficient queries
   *
   * @param page - Page number (1-indexed)
   * @param limit - Number of items per page
   * @returns Paginated category response
   */
  async getPaginatedCategories(
    page: number,
    limit: number
  ): Promise<PaginatedResponse<Category>> {
    // Calculate offset for database query
    const skip = (page - 1) * limit;

    // Execute count and data queries in parallel for better performance
    const [total, categories] = await Promise.all([
      this.prisma.category.count(),
      this.prisma.category.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    // Create pagination metadata
    const pagination = createPaginationMetadata(page, limit, total);

    return {
      data: categories,
      pagination,
    };
  }

  /**
   * Get category by ID
   * @param id - Category ID
   * @returns Category or null if not found
   */
  async getCategoryById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  /**
   * Get category by slug
   * @param slug - Category slug
   * @returns Category or null if not found
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { slug },
    });
  }

  /**
   * Get all categories
   * @returns All categories ordered by creation date
   */
  async getAllCategories(): Promise<Category[]> {
    return this.prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Create a new category
   * @param data - Category creation data
   * @returns Created category
   */
  async createCategory(data: {
    name: string;
    slug: string;
  }): Promise<Category> {
    return this.prisma.category.create({
      data,
    });
  }

  /**
   * Update a category
   * @param id - Category ID
   * @param data - Category update data
   * @returns Updated category
   */
  async updateCategory(
    id: string,
    data: Partial<{ name: string; slug: string }>
  ): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a category
   * @param id - Category ID
   * @returns Deleted category
   */
  async deleteCategory(id: string): Promise<Category> {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
