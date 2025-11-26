import {
  PrismaClient,
  Prisma,
  FeaturedType,
} from "@/app/generated/prisma/client";
import type { ProductPaginationQuery } from "@/lib/validations/product";

export class ProductService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get paginated products with search and filters
   */
  async getPaginatedProducts(query: ProductPaginationQuery) {
    const {
      page,
      limit,
      search,
      categoryId,
      featuredType,
      minPrice,
      maxPrice,
      hasVariants,
      sortBy,
      sortOrder,
    } = query;

    // Build where clause
    const where: Prisma.ProductWhereInput = {};

    // Search by name or description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter by category
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Filter by featured type
    if (featuredType) {
      where.featuredType = featuredType as FeaturedType;
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {};
      if (minPrice !== undefined) {
        where.basePrice.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.basePrice.lte = maxPrice;
      }
    }

    // Filter by hasVariants
    if (hasVariants !== undefined) {
      where.hasVariants = hasVariants;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build orderBy
    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
            select: {
              id: true,
              url: true,
              alt: true,
            },
          },
          variants: {
            where: { isActive: true },
            select: {
              id: true,
              sku: true,
              name: true,
              price: true,
              salePrice: true,
              stock: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data: products,
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
   * Get product by ID with all relations
   */
  async getProductById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { position: "asc" },
        },
        variantOptions: true,
        variants: {
          where: { isActive: true },
          orderBy: { name: "asc" },
        },
      },
    });
  }

  /**
   * Get product by slug with all relations
   */
  async getProductBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { position: "asc" },
        },
        variantOptions: true,
        variants: {
          where: { isActive: true },
          orderBy: { name: "asc" },
        },
      },
    });
  }

  /**
   * Get featured products by type
   */
  async getFeaturedProducts(featuredType: FeaturedType, limit: number = 10) {
    return this.prisma.product.findMany({
      where: { featuredType },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    });
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 10
  ) {
    return this.getPaginatedProducts({
      page,
      limit,
      categoryId,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }

  /**
   * Search products
   */
  async searchProducts(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ) {
    return this.getPaginatedProducts({
      page,
      limit,
      search: searchTerm,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }

  /**
   * Get total stock for a product (including variants)
   */
  async getTotalStock(productId: string): Promise<number> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: {
          where: { isActive: true },
        },
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }
    if (!product.hasVariants) {
      return product.stock;
    }

    return product.variants.reduce(
      (total: number, variant) => total + variant.stock,
      0
    );
  }

  /**
   * Get price range for a product
   */
  async getPriceRange(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: {
          where: { isActive: true },
        },
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.hasVariants) {
      const price = product.salePrice || product.basePrice;
      return {
        min: Number(price),
        max: Number(price),
      };
    }

    const prices = product.variants.map((v) => Number(v.salePrice || v.price));

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }

  /**
   * Check if product is in stock
   */
  async isInStock(productId: string, variantId?: string): Promise<boolean> {
    if (variantId) {
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: variantId },
      });
      return variant ? variant.stock > 0 && variant.isActive : false;
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) return false;

    if (product.hasVariants) {
      const totalStock = await this.getTotalStock(productId);
      return totalStock > 0;
    }

    return product.stock > 0;
  }

  /**
   * Create a new product
   */
  async createProduct(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({
      data,
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });
  }

  /**
   * Update a product
   */
  async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
