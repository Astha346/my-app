"use client";

import { useState } from "react";
import axios from "axios";

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
    if (!category) return;

    try {
      setLoading(true);

      await axios.delete(
        `http://localhost:3001/categories/${category._id}`
      );

      onSuccess();
    } catch (error) {
      console.error("Failed to delete category:", error);
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
            <strong>{category?.name}</strong>?
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}