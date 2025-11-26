import { fetchAllCategories } from "@/lib/api/categories";
import { ProductForm } from "@/components/products/ProductForm";

export const metadata = {
  title: "Create Product | Admin Dashboard",
  description: "Add a new product to your catalog",
};

export default async function CreateProductPage() {
  const categoriesResult = await fetchAllCategories();

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create Product</h1>
        <p className="text-slate-600 mt-1">
          Add a new product to your store catalog.
        </p>
      </div>

      <ProductForm categories={categoriesResult.data} />
    </div>
  );
}
