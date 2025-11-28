"use client";

import {
  Plus,
  Trash2,
  Package,
  Image as ImageIcon,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import {
  DataTableWithPagination,
  Column,
  PaginationData,
} from "@/components/common/DataTableWithPagination";
import { useProductManagement } from "@/hooks/useProductManagement";
import { usePagination } from "@/hooks/usePagination";
import { ProductFilters } from "./ProductFilters";
import type { ProductListItem } from "@/types/product";
import { formatPrice } from "@/lib/utils";

interface ProductManagementClientProps {
  initialProducts: ProductListItem[];
  initialPagination: PaginationData;
  categories: { id: string; name: string }[];
}

export function ProductManagementClient({
  initialProducts,
  initialPagination,
  categories,
}: ProductManagementClientProps) {
  const { isPending, handlePageChange, handleLimitChange } = usePagination(
    initialPagination.totalPages,
    initialPagination.limit
  );

  const { deleteDialog, setDeleteDialog, handleDelete } =
    useProductManagement(initialProducts);

  // Define table columns
  const columns: Column<ProductListItem>[] = [
    {
      key: "product",
      header: "Product",
      render: (product) => (
        <div className="flex items-center gap-3">
          {/* Product Image */}
          <div className="shrink-0 w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="h-6 w-6 text-slate-400" />
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-slate-900 truncate">
              {product.name}
            </span>
            {product.sku && (
              <span className="text-xs text-slate-500">SKU: {product.sku}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (product) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
          {product.category.name}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (product) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">
            {formatPrice(product.basePrice)}
          </span>
          {product.salePrice && Number(product.salePrice) > 0 && (
            <span className="text-xs text-green-600">
              Sale: {formatPrice(product.salePrice)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      render: (product) => {
        const totalStock = product.hasVariants
          ? product.variants.reduce((sum: number, v: any) => sum + v.stock, 0)
          : product.stock;

        return (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                totalStock > 10
                  ? "bg-green-100 text-green-700"
                  : totalStock > 0
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {totalStock > 0 ? `${totalStock} in stock` : "Out of stock"}
            </span>
            {product.hasVariants && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Package className="h-3 w-3" />
                {product.variants.length} variants
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "featured",
      header: "Featured",
      render: (product) =>
        product.featuredType ? (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-700">
            {product.featuredType}
          </span>
        ) : (
          <span className="text-slate-400 text-sm">—</span>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (product) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            aria-label={`Edit ${product.name}`}
            className="hover:bg-blue-50 hover:border-blue-200"
          >
            <a href={`/admin/products/${product.id}/edit`}>
              <Pencil className="h-4 w-4 text-blue-600" />
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialog({ open: true, product })}
            aria-label={`Delete ${product.name}`}
            className="hover:bg-red-50 hover:border-red-200"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600 mt-1">
            Manage your product catalog ({initialPagination.total} total)
          </p>
        </div>
        <Button asChild>
          <a href="/admin/products/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </a>
        </Button>
      </div>

      {/* Filters */}
      <ProductFilters categories={categories} />

      {/* Data Table with Pagination */}
      <DataTableWithPagination
        data={initialProducts}
        columns={columns}
        pagination={initialPagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        isPending={isPending}
        emptyMessage="No products found. Create your first product to get started."
        getRowKey={(product) => product.id}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open })}
        onConfirm={handleDelete}
        isDeleting={isPending}
        itemName={deleteDialog.product?.name}
      />
    </div>
  );
}
