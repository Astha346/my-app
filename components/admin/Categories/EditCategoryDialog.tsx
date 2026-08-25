"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import type { Category } from "@/types/category";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  categories?: Category[];
  onSuccess?: () => void;
}

export default function EditCategoryDialog({
  open,
  onOpenChange,
  category,
  categories = [],
  onSuccess,
}: EditCategoryDialogProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    parentId: "none",
    status: "active",
  });

  // =====================================================
  // LOAD CATEGORY INTO FORM
  // =====================================================

  useEffect(() => {
    if (!category) {
      return;
    }

    setForm({
      name: category.name || "",
      description: category.description || "",
      image: category.image || "",
      parentId: category.parentId || "none",
      status: category.status || "active",
    });
  }, [category]);

  // =====================================================
  // UPDATE CATEGORY
  // =====================================================

  const handleSubmit = async () => {
    if (!category) {
      return;
    }

    if (!form.name.trim()) {
      alert("Category name is required.");
      return;
    }

    try {
      setLoading(true);

      console.log(
        "Updating category:",
        category._id
      );

      const response = await api.patch(
        `/categories/${category._id}`,
        {
          name: form.name.trim(),
          description: form.description.trim(),
          image: form.image.trim(),
          parentId:
            form.parentId === "none"
              ? null
              : form.parentId,
          status: form.status,
        }
      );

      console.log(
        "CATEGORY UPDATED:",
        response.data
      );

      // Close dialog
      onOpenChange(false);

      // Tell CategoriesContent to update
      onSuccess?.();

    } catch (error: any) {
      console.error(
        "Failed to update category:",
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
            "Failed to update category."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    if (loading) {
      return;
    }

    onOpenChange(false);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">

        {/* HEADER */}
        <DialogHeader>
          <DialogTitle>
            Edit Category
          </DialogTitle>

          <DialogDescription>
            Update the category information.
          </DialogDescription>
        </DialogHeader>

        {/* FORM */}
        <div className="space-y-5">

          {/* NAME */}
          <div className="space-y-2">
            <Label htmlFor="edit-category-name">
              Category Name
            </Label>

            <Input
              id="edit-category-name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              disabled={loading}
              placeholder="Enter category name"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label htmlFor="edit-category-description">
              Description
            </Label>

            <Textarea
              id="edit-category-description"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              disabled={loading}
              placeholder="Enter category description"
              className="resize-none"
            />
          </div>

          {/* PARENT CATEGORY */}
          <div className="space-y-2">
            <Label>
              Parent Category
            </Label>

            <Select
              value={form.parentId}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  parentId: value,
                })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category" />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="none">
                  No Parent Category
                </SelectItem>

                {Array.isArray(categories) &&
                  categories
                    .filter(
                      (item) =>
                        item._id !== category?._id &&
                        !item.parentId
                    )
                    .map((item) => (
                      <SelectItem
                        key={item._id}
                        value={item._id}
                      >
                        {item.name}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>

          {/* IMAGE */}
          <div className="space-y-2">
            <Label htmlFor="edit-category-image">
              Image URL
            </Label>

            <Input
              id="edit-category-image"
              value={form.image}
              onChange={(e) =>
                setForm({
                  ...form,
                  image: e.target.value,
                })
              }
              disabled={loading}
              placeholder="https://example.com/image.jpg"
            />

            {/* IMAGE PREVIEW */}
            {form.image.trim() && (
              <div className="mt-2 overflow-hidden rounded-lg border">
                <img
                  src={form.image}
                  alt={form.name || "Category"}
                  className="h-32 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <Label>
              Status
            </Label>

            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  status: value,
                })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="active">
                  Active
                </SelectItem>

                <SelectItem value="inactive">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>

        {/* FOOTER */}
        <DialogFooter className="gap-2">

          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Category"}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}