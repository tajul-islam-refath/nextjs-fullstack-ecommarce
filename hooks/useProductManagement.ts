"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/lib/actions/product";
import {
  CreateProductInput,
  UpdateProductInput,
} from "@/lib/validations/product";

interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: any; // Decimal
  stock: number;
  category: { name: string };
  createdAt: Date;
  updatedAt: Date;
}

export function useProductManagement(initialProducts: any[]) {
  const [products, setProducts] = useState(initialProducts);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    product?: any;
  }>({
    open: false,
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    product?: any;
  }>({
    open: false,
  });

  const handleCreate = async (data: CreateProductInput) => {
    startTransition(async () => {
      const result = await createProductAction(data);
      if (result.success) {
        toast.success("Product created successfully!");
        setCreateDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleUpdate = async (data: UpdateProductInput) => {
    if (!editDialog.product) return;
    startTransition(async () => {
      const result = await updateProductAction(editDialog.product.id, data);
      if (result.success) {
        toast.success("Product updated successfully!");
        setEditDialog({ open: false });
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteDialog.product) return;
    startTransition(async () => {
      const result = await deleteProductAction(deleteDialog.product.id);
      if (result.success) {
        toast.success("Product deleted successfully!");
        setDeleteDialog({ open: false });
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return {
    products,
    isPending,
    createDialogOpen,
    setCreateDialogOpen,
    editDialog,
    setEditDialog,
    deleteDialog,
    setDeleteDialog,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
