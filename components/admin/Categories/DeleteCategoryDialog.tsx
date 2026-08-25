"use client";

import { useState } from "react";

import api from "@/lib/api";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { Category } from "@/types/category";

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSuccess: () => void;
}

export default function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: DeleteCategoryDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!category) {
      return;
    }

    // ==========================================
    // PREVENT DELETE OF FRONTEND-ONLY CATEGORY
    // ==========================================

    if (
      category._id.startsWith("product-category-")
    ) {
      console.warn(
        "This category comes from products and does not exist in the categories collection."
      );

      alert(
        `"${category.name}" is automatically created from your products. You cannot delete it here.`
      );

      onOpenChange(false);

      return;
    }

    try {
      setLoading(true);

      console.log(
        "Deleting category:",
        category._id
      );

      // IMPORTANT:
      // Use api, NOT axios
      //
      // api automatically adds:
      // Authorization: Bearer <access_token>

      const response = await api.delete(
        `/categories/${category._id}`
      );

      console.log(
        "Category deleted:",
        response.data
      );

      // Close dialog
      onOpenChange(false);

      // Refresh categories
      onSuccess();

    } catch (error: any) {
      console.error(
        "DELETE CATEGORY ERROR:",
        error
      );

      console.error(
        "BACKEND RESPONSE:",
        error?.response?.data
      );

      const message =
        error?.response?.data?.message;

      if (Array.isArray(message)) {
        alert(message.join(", "));
      } else {
        alert(
          message ||
            "Failed to delete category."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>

          <AlertDialogTitle>
            Delete Category
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>
              {category?.name}
            </strong>
            ?

            <br />

            <span className="text-destructive">
              This action cannot be undone.
            </span>
          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel
            disabled={loading}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading
              ? "Deleting..."
              : "Delete"}
          </AlertDialogAction>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}