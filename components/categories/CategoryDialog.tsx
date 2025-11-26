"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";
import { CreateCategoryData } from "@/lib/validations/category";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateCategoryData) => Promise<void>;
  isSubmitting?: boolean;
  category?: {
    name: string;
    slug: string;
  };
  title?: string;
  description?: string;
}

/**
 * Reusable Category Dialog Component
 * 
 * Can be used for both create and edit operations
 * Customizable title and description
 */
export function CategoryDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  category,
  title = "Create New Category",
  description = "Add a new category to organize your products.",
}: CategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <CategoryForm
          defaultValues={category}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
