"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  createProductSchema,
  type CreateProductInput,
} from "@/lib/validations/product";
import { createProductAction } from "@/lib/actions/product";
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
}

export function ProductForm({ categories }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
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
    },
  });

  const hasVariants = form.watch("hasVariants");

  async function onSubmit(data: CreateProductInput) {
    setIsSubmitting(true);
    try {
      const result = await createProductAction(data);
      if (result.success) {
        toast.success("Product created successfully");
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create product");
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
            Create Product
          </Button>
        </div>
      </form>
    </Form>
  );
}
