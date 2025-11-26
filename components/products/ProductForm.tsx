"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  createProductSchema,
  updateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from "@/lib/validations/product";
import {
  createProductAction,
  updateProductAction,
} from "@/lib/actions/product";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductImages } from "./ProductImages";
import { ProductPricing } from "./ProductPricing";
import { ProductVariants } from "./ProductVariants";
import { ProductSEO } from "./ProductSEO";
import { ProductOrganization } from "./ProductOrganization";
import { ProductVariantToggle } from "./ProductVariantToggle";
import { ProductShipping } from "./ProductShipping";

interface ProductFormProps {
  categories: { id: string; name: string }[];
  initialData?: any; // Product from database with all relations
  mode?: "create" | "edit";
}

export function ProductForm({
  categories,
  initialData,
  mode = "create",
}: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = mode === "edit";

  // Transform initial data from database format to form format
  const getDefaultValues = (): CreateProductInput | UpdateProductInput => {
    if (isEditMode && initialData) {
      return {
        name: initialData.name || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        categoryId: initialData.categoryId || "",
        basePrice: initialData.basePrice ? Number(initialData.basePrice) : 0,
        salePrice: initialData.salePrice
          ? Number(initialData.salePrice)
          : undefined,
        costPrice: initialData.costPrice
          ? Number(initialData.costPrice)
          : undefined,
        stock: initialData.stock || 0,
        sku: initialData.sku || "",
        hasVariants: initialData.hasVariants || false,
        featuredType: initialData.featuredType || undefined,
        metaTitle: initialData.metaTitle || "",
        metaDescription: initialData.metaDescription || "",
        metaKeywords: initialData.metaKeywords || "",
        weight: initialData.weight ? Number(initialData.weight) : undefined,
        dimensions: initialData.dimensions || "",
        images:
          initialData.images?.map((img: any) => ({
            url: img.url,
            alt: img.alt || "",
            position: img.position,
            isPrimary: img.isPrimary,
          })) || [],
        variantOptions:
          initialData.variantOptions?.map((opt: any) => ({
            name: opt.name,
            values: opt.values,
          })) || [],
        variants:
          initialData.variants?.map((variant: any) => ({
            sku: variant.sku,
            name: variant.name,
            options: variant.options,
            price: Number(variant.price),
            salePrice: variant.salePrice
              ? Number(variant.salePrice)
              : undefined,
            costPrice: variant.costPrice
              ? Number(variant.costPrice)
              : undefined,
            stock: variant.stock,
            imageUrl: variant.imageUrl || "",
            isActive: variant.isActive,
          })) || [],
      };
    }

    return {
      name: "",
      slug: "",
      description: "",
      categoryId: "",
      basePrice: 0,
      salePrice: undefined,
      costPrice: undefined,
      stock: 0,
      sku: "",
      hasVariants: false,
      featuredType: undefined,
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      weight: undefined,
      dimensions: "",
      images: [],
      variantOptions: [],
      variants: [],
    };
  };

  const form = useForm<CreateProductInput | UpdateProductInput>({
    resolver: zodResolver(
      isEditMode ? updateProductSchema : createProductSchema
    ),
    defaultValues: getDefaultValues(),
  });

  const hasVariants = form.watch("hasVariants");

  async function onSubmit(data: CreateProductInput | UpdateProductInput) {
    setIsSubmitting(true);
    try {
      let result;

      if (isEditMode && initialData) {
        result = await updateProductAction(initialData.id, data);
      } else {
        result = await createProductAction(data as CreateProductInput);
      }

      if (result.success) {
        toast.success(
          isEditMode
            ? "Product updated successfully"
            : "Product created successfully"
        );
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(
          result.error ||
            (isEditMode
              ? "Failed to update product"
              : "Failed to create product")
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <ProductBasicInfo />
            <ProductImages />
            <ProductPricing />
            {hasVariants && <ProductVariants />}
            <ProductSEO />
          </div>

          {/* Right Column - Organization & Status */}
          <div className="space-y-8">
            <ProductOrganization categories={categories} />
            <ProductVariantToggle />
            <ProductShipping />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
