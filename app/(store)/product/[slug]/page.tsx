import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductService } from "@/lib/service/product.service";
import { ProductImageGallery } from "@/components/store/product/ProductImageGallery";
import { ProductInfo } from "@/components/store/product/ProductInfo";
import { ProductTabs } from "@/components/store/product/ProductTabs";
import { ProductProvider } from "@/components/store/product/product-context";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const productService = new ProductService(prisma);
  const product = await productService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Format images for gallery
  const galleryImages = product.images.map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.alt,
  }));

  // If no images, use a placeholder or handle gracefully
  if (galleryImages.length === 0) {
    // You might want to add a default placeholder image here
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb (Optional but recommended) */}
        <nav className="mb-8 flex text-sm text-(--gray-500)">
          <a href="/" className="hover:text-(--primary-600)">
            Home
          </a>
          <span className="mx-2">/</span>
          <a
            href={`/category/${product.category.slug}`}
            className="hover:text-(--primary-600)"
          >
            {product.category.name}
          </a>
          <span className="mx-2">/</span>
          <span className="text-(--gray-900) truncate">{product.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Product Gallery */}
          <div className="mb-8 lg:mb-0">
            <ProductImageGallery images={galleryImages} />
          </div>

          {/* Product Info */}
          <div>
            <ProductProvider
              product={{
                id: product.id,
                name: product.name,
                description: product.description,
                basePrice: Number(product.basePrice),
                salePrice: product.salePrice ? Number(product.salePrice) : null,
                stock: product.stock,
                hasVariants: product.hasVariants,
                variants: product.variants.map((v) => ({
                  id: v.id,
                  name: v.name,
                  sku: v.sku,
                  price: Number(v.price),
                  salePrice: v.salePrice ? Number(v.salePrice) : null,
                  stock: v.stock,
                  options: v.options,
                })),
                variantOptions: product.variantOptions,
              }}
            >
              <ProductInfo />
            </ProductProvider>
          </div>
        </div>

        {/* Product Tabs (Description, Specs, Reviews) */}
        <ProductTabs
          description={product.description}
          // You can pass specifications here if you have them in your data model
          // specifications={product.specifications}
        />
      </div>
    </div>
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
    title: `${product.name} | EcoShop`,
    description:
      product.description?.slice(0, 160) || `Buy ${product.name} at EcoShop`,
    openGraph: {
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}
