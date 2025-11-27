import { prisma } from "@/lib/prisma";
import { ProductService } from "@/lib/service/product.service";
import { RelatedProductsCarousel } from "./RelatedProductsCarousel";

interface RelatedProductsSectionProps {
  productId: string;
}

export async function RelatedProductsSection({
  productId,
}: RelatedProductsSectionProps) {
  const productService = new ProductService(prisma);
  const relatedProducts = await productService.getRelatedProducts(
    productId,
    10
  );

  if (relatedProducts.length === 0) {
    return null;
  }

  // Format products for carousel
  const formattedProducts = relatedProducts.map((product) => {
    const image = product.images[0]?.url;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      basePrice: Number(product.basePrice),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      image,
      categoryName: product.category.name,
    };
  });

  return (
    <RelatedProductsCarousel
      products={formattedProducts}
      title="You May Also Like"
    />
  );
}
