"use client";

import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryDialog } from "./CategoryDialog";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import {
  DataTableWithPagination,
  Column,
  PaginationData,
} from "@/components/common/DataTableWithPagination";
import { useCategoryManagement } from "@/hooks/useCategoryManagement";
import { usePagination } from "@/hooks/usePagination";

interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryManagementClientProps {
  initialCategories: Category[];
  initialPagination: PaginationData;
}

export function CategoryManagementClient({
  initialCategories,
  initialPagination,
}: CategoryManagementClientProps) {
  const { isPending, handlePageChange, handleLimitChange } = usePagination(
    initialPagination.totalPages,
    initialPagination.limit
  );

  const {
    isPending: isActionPending,
    createDialogOpen,
    setCreateDialogOpen,
    editDialog,
    setEditDialog,
    deleteDialog,
    setDeleteDialog,
    handleCreate,
    handleUpdate,
    handleDelete,
    openEditDialog,
    openDeleteDialog,
  } = useCategoryManagement(initialCategories);

  // Define table columns
  const columns: Column<Category>[] = [
    {
      key: "name",
      header: "Name",
      render: (category) => (
        <span className="font-medium">{category.name}</span>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (category) => (
        <code className="px-2 py-1 bg-slate-100 rounded text-sm">
          {category.slug}
        </code>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (category) => (
        <span className="text-slate-600">
          {new Date(category.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (category) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditDialog(category)}
            aria-label={`Edit ${category.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDeleteDialog(category)}
            aria-label={`Delete ${category.name}`}
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
          <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-600 mt-1">
            Manage your product categories ({initialPagination.total} total)
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Data Table with Pagination */}
      <DataTableWithPagination
        data={initialCategories}
        columns={columns}
        pagination={initialPagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        isPending={isPending}
        emptyMessage="No categories found. Create your first category to get started."
        getRowKey={(category) => category.id}
      />

      {/* Create Dialog */}
      <CategoryDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreate}
        isSubmitting={isActionPending}
      />

      {/* Edit Dialog */}
      <CategoryDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open })}
        onSubmit={handleUpdate}
        isSubmitting={isActionPending}
        category={editDialog.category}
        title="Edit Category"
        description="Update the category information below."
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open })}
        onConfirm={handleDelete}
        isDeleting={isActionPending}
        itemName={deleteDialog.category?.name}
      />
    </div>
  );
}
