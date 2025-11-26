"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/lib/actions/category";
import { CreateCategoryData } from "@/lib/validations/category";

interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Custom hook for category management logic
 * 
 * Separates business logic from presentation
 * Handles CRUD operations and dialog state management
 */
export function useCategoryManagement(initialCategories: Category[]) {
  const [categories, setCategories] = useState(initialCategories);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialog, setEditDialog] = useState<{ open: boolean; category?: Category }>({
    open: false,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; category?: Category }>({
    open: false,
  });

  // Create category
  const handleCreate = async (data: CreateCategoryData) => {
    startTransition(async () => {
      const result = await createCategoryAction(data);

      if (result.success) {
        toast.success("Category created successfully!");
        setCreateDialogOpen(false);
        router.refresh(); // Refresh server components without full page reload
      } else {
        toast.error(result.error);
      }
    });
  };

  // Update category
  const handleUpdate = async (data: CreateCategoryData) => {
    if (!editDialog.category) return;

    startTransition(async () => {
      const result = await updateCategoryAction(editDialog.category!.id, data);

      if (result.success) {
        toast.success("Category updated successfully!");
        setEditDialog({ open: false });
        router.refresh(); // Refresh server components without full page reload
      } else {
        toast.error(result.error);
      }
    });
  };

  // Delete category
  const handleDelete = async () => {
    if (!deleteDialog.category) return;

    startTransition(async () => {
      const result = await deleteCategoryAction(deleteDialog.category!.id);

      if (result.success) {
        toast.success("Category deleted successfully!");
        setDeleteDialog({ open: false });
        router.refresh(); // Refresh server components without full page reload
      } else {
        toast.error(result.error);
      }
    });
  };

  // Open edit dialog
  const openEditDialog = (category: Category) => {
    setEditDialog({ open: true, category });
  };

  // Open delete dialog
  const openDeleteDialog = (category: Category) => {
    setDeleteDialog({ open: true, category });
  };

  return {
    // State
    categories,
    isPending,
   
    // Create dialog
    createDialogOpen,
    setCreateDialogOpen,
    
    // Edit dialog
    editDialog,
    setEditDialog,
    
    // Delete dialog
    deleteDialog,
    setDeleteDialog,
    
    // Actions
    handleCreate,
    handleUpdate,
    handleDelete,
    openEditDialog,
    openDeleteDialog,
  };
}
