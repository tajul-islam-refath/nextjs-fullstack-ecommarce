import { notFound } from "next/navigation";
import { fetchAllCategories } from "@/lib/api/categories";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductService } from "@/lib/service/product.service";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Edit Product | Admin Dashboard",
  description: "Edit product details",
};

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Serialize product data to convert Decimal to number for client component
function serializeProduct(product: any) {
  return {
    ...product,
    basePrice: product.basePrice ? Number(product.basePrice) : 0,
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
    weight: product.weight ? Number(product.weight) : null,
    variants:
      product.variants?.map((variant: any) => ({
        ...variant,
        price: Number(variant.price),
        salePrice: variant.salePrice ? Number(variant.salePrice) : null,
        costPrice: variant.costPrice ? Number(variant.costPrice) : null,
      })) || [],
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  // Await params as it's a Promise in Next.js 15+
  const { id } = await params;
  const productService = new ProductService(prisma);

  // Fetch product and categories in parallel
  const [product, categoriesResult] = await Promise.all([
    productService.getProductById(id),
    fetchAllCategories(),
  ]);

  // If product not found, show 404
  if (!product) {
    notFound();
  }

  const categories = categoriesResult.data || [];

  // Serialize product data to make it compatible with Client Components
  const serializedProduct = serializeProduct(product);

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Edit Product</h1>
        <p className="text-slate-600 mt-1">
          Update product information for{" "}
          <span className="font-semibold">{product.name}</span>
        </p>
      </div>

      <ProductForm
        categories={categories}
        initialData={serializedProduct}
        mode="edit"
      />
    </div>
  );
}
