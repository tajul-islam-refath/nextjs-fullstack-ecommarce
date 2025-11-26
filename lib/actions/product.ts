"use server";

import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductService } from "@/lib/service/product.service";
import {
  createProductSchema,
  updateProductSchema,
  productPaginationQuerySchema,
} from "@/lib/validations/product";
import { ActionResult, withAdmin } from "@/lib/auth-utils";
import { ZodError } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Create a new product
 * Protected: Admin only
 */
export const createProductAction = withAdmin(
  async (
    data: unknown
  ): Promise<ActionResult<{ id: string; name: string; slug: string }>> => {
    try {
      const validated = createProductSchema.parse(data);
      const productService = new ProductService(prisma);

      // Convert validated data to Prisma input
      // We need to handle Decimal conversions and other type mismatches if any
      const productData: Prisma.ProductCreateInput = {
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        basePrice: new Prisma.Decimal(validated.basePrice),
        salePrice: validated.salePrice
          ? new Prisma.Decimal(validated.salePrice)
          : null,
        costPrice: validated.costPrice
          ? new Prisma.Decimal(validated.costPrice)
          : null,
        stock: validated.stock,
        sku: validated.sku,
        featuredType: validated.featuredType,
        hasVariants: validated.hasVariants,
        metaTitle: validated.metaTitle,
        metaDescription: validated.metaDescription,
        metaKeywords: validated.metaKeywords,
        weight: validated.weight ? new Prisma.Decimal(validated.weight) : null,
        dimensions: validated.dimensions,
        category: {
          connect: { id: validated.categoryId },
        },
        ...(validated.images && validated.images.length > 0
          ? {
              images: {
                create: validated.images.map((img) => ({
                  url: img.url,
                  alt: img.alt,
                  position: img.position,
                  isPrimary: img.isPrimary,
                })),
              },
            }
          : {}),
        ...(validated.variantOptions && validated.variantOptions.length > 0
          ? {
              variantOptions: {
                create: validated.variantOptions.map((opt) => ({
                  name: opt.name,
                  values: opt.values,
                })),
              },
            }
          : {}),
        ...(validated.variants && validated.variants.length > 0
          ? {
              variants: {
                create: validated.variants.map((variant) => ({
                  sku: variant.sku,
                  name: variant.name,
                  options: variant.options,
                  price: new Prisma.Decimal(variant.price),
                  salePrice: variant.salePrice
                    ? new Prisma.Decimal(variant.salePrice)
                    : null,
                  costPrice: variant.costPrice
                    ? new Prisma.Decimal(variant.costPrice)
                    : null,
                  stock: variant.stock,
                  imageUrl: variant.imageUrl,
                  isActive: variant.isActive,
                })),
              },
            }
          : {}),
      };

      const product = await productService.createProduct(productData);

      revalidateTag("products", "max");
      revalidatePath("/admin/products");
      revalidatePath("/api/products");

      return {
        success: true,
        data: {
          id: product.id,
          name: product.name,
          slug: product.slug,
        },
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return { success: false, error: error.issues[0].message };
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return {
            success: false,
            error: "A product with this slug or SKU already exists",
          };
        }
      }
      console.error("Error creating product:", error);
      return { success: false, error: "Failed to create product" };
    }
  }
);

/**
 * Update a product
 * Protected: Admin only
 */
export const updateProductAction = withAdmin(
  async (
    id: string,
    data: unknown
  ): Promise<ActionResult<{ id: string; name: string }>> => {
    try {
      const validated = updateProductSchema.parse(data);
      const productService = new ProductService(prisma);

      const productData: Prisma.ProductUpdateInput = {
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        basePrice: validated.basePrice
          ? new Prisma.Decimal(validated.basePrice)
          : undefined,
        salePrice:
          validated.salePrice !== undefined
            ? validated.salePrice
              ? new Prisma.Decimal(validated.salePrice)
              : null
            : undefined,
        costPrice:
          validated.costPrice !== undefined
            ? validated.costPrice
              ? new Prisma.Decimal(validated.costPrice)
              : null
            : undefined,
        stock: validated.stock,
        sku: validated.sku,
        featuredType: validated.featuredType,
        hasVariants: validated.hasVariants,
        metaTitle: validated.metaTitle,
        metaDescription: validated.metaDescription,
        metaKeywords: validated.metaKeywords,
        weight:
          validated.weight !== undefined
            ? validated.weight
              ? new Prisma.Decimal(validated.weight)
              : null
            : undefined,
        dimensions: validated.dimensions,
        category: validated.categoryId
          ? { connect: { id: validated.categoryId } }
          : undefined,
      };

      const product = await productService.updateProduct(id, productData);

      revalidateTag("products", "max");
      revalidatePath("/admin/products");
      revalidatePath("/api/products");

      return {
        success: true,
        data: {
          id: product.id,
          name: product.name,
        },
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return { success: false, error: error.issues[0].message };
      }
      console.error("Error updating product:", error);
      return { success: false, error: "Failed to update product" };
    }
  }
);

/**
 * Delete a product
 * Protected: Admin only
 */
export const deleteProductAction = withAdmin(
  async (id: string): Promise<ActionResult<{ message: string }>> => {
    try {
      const productService = new ProductService(prisma);
      await productService.deleteProduct(id);

      revalidateTag("products", "max");
      revalidatePath("/admin/products");
      revalidatePath("/api/products");

      return {
        success: true,
        data: { message: "Product deleted successfully" },
      };
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false, error: "Failed to delete product" };
    }
  }
);

/**
 * Get paginated products
 * Public access (but used in admin)
 */
export async function getProductsAction(params?: unknown) {
  try {
    const validated = params
      ? productPaginationQuerySchema.parse(params)
      : {
          page: 1,
          limit: 10,
          sortBy: "createdAt" as const,
          sortOrder: "desc" as const,
        };
    const productService = new ProductService(prisma);
    const result = await productService.getPaginatedProducts(validated);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}
