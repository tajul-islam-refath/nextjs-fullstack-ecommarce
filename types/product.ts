/**
 * Product-related TypeScript types
 * Aligned with Prisma schema and API responses
 */

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  position: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  options: string; // JSON string
  price: any;
  salePrice: any | null;
  costPrice: any | null;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
}

export interface VariantOption {
  id: string;
  name: string;
  values: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: string;
  basePrice: any;
  salePrice: any | null;
  costPrice: any | null;
  stock: number;
  sku: string | null;
  featuredType: "LATEST" | "HOT" | "POPULAR" | null;
  hasVariants: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  weight: any | null;
  dimensions: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  category: ProductCategory;
  images: ProductImage[];
  variants: ProductVariant[];
  variantOptions: VariantOption[];
}

/**
 * Simplified product type for list views
 */
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  basePrice: any;
  salePrice: any | null;
  stock: number;
  sku: string | null;
  featuredType: "LATEST" | "HOT" | "POPULAR" | null;
  hasVariants: boolean;
  categoryId: string;
  category: ProductCategory;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Product form data types
 */
export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  basePrice: number;
  salePrice?: number;
  costPrice?: number;
  stock: number;
  sku: string;
  featuredType?: "LATEST" | "HOT" | "POPULAR";
  hasVariants: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  weight?: number;
  dimensions?: string;
}
