import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductService } from "@/lib/service/product.service";
import ProductPage from "./Product";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function page({ params }: ProductPageProps) {
  return (
    <Suspense>
      <ProductPage params={params} />
    </Suspense>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const productService = new ProductService(prisma);
  const product = await productService.getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.metaTitle || product.name}`,
    description:
      product.metaDescription ||
      product.description?.slice(0, 160) ||
      `Buy ${product.name}`,
    openGraph: {
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}
