"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Category } from "@/types/category";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories?: Category[];
  onSuccess?: () => void;
}

export default function AddCategoryDialog({
  open,
  onOpenChange,
  categories = [],
  onSuccess,
}: AddCategoryDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("none");
  const [status, setStatus] =
    useState<"active" | "inactive">("active");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // =====================================================
  // RESET FORM
  // =====================================================

  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
      setParentId("none");
      setStatus("active");
      setErrorMessage("");
    }
  }, [open]);

  // =====================================================
  // SAFE CATEGORIES
  // =====================================================

  const safeCategories = Array.isArray(categories)
    ? categories
    : [];

  // Only main categories can become parent
  const mainCategories = safeCategories.filter(
    (category) => !category.parentId
  );

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setErrorMessage("");

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!name.trim()) {
      setErrorMessage(
        "Category name is required."
      );
      return;
    }

    try {
      setLoading(true);

      const categoryData = {
        name: name.trim(),
        description: description.trim(),

        parentId:
          parentId === "none"
            ? null
            : parentId,

        status,
      };

      console.log(
        "CREATING CATEGORY:",
        categoryData
      );

      // IMPORTANT:
      // Use api, NOT axios directly.
      // api automatically adds:
      //
      // Authorization: Bearer <access_token>

      const response = await api.post(
        "/categories",
        categoryData
      );

      console.log(
        "CATEGORY CREATED:",
        response.data
      );

      // Reset
      setName("");
      setDescription("");
      setParentId("none");
      setStatus("active");

      // Close
      onOpenChange(false);

      // Refresh category list
      onSuccess?.();

    } catch (error: any) {
      console.error(
        "CREATE CATEGORY ERROR:",
        error
      );

      console.error(
        "BACKEND RESPONSE:",
        error?.response?.data
      );

      const backendMessage =
        error?.response?.data?.message;

      if (Array.isArray(backendMessage)) {
        setErrorMessage(
          backendMessage.join(", ")
        );
      } else {
        setErrorMessage(
          backendMessage ||
            "Failed to create category."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!loading) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">

        {/* HEADER */}

        <DialogHeader>

          <DialogTitle>
            Add Category
          </DialogTitle>

          <DialogDescription>
            Create a new category or subcategory.
          </DialogDescription>

        </DialogHeader>

        {/* ERROR */}

        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* CATEGORY NAME */}

          <div className="space-y-2">

            <Label htmlFor="category-name">
              Category Name
              <span className="ml-1 text-red-500">
                *
              </span>
            </Label>

            <Input
              id="category-name"
              placeholder="e.g. Beauty"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              disabled={loading}
            />

          </div>

          {/* DESCRIPTION */}

          <div className="space-y-2">

            <Label htmlFor="category-description">
              Description
            </Label>

            <Textarea
              id="category-description"
              placeholder="Enter category description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              disabled={loading}
              className="min-h-[100px] resize-none"
            />

          </div>

          {/* PARENT CATEGORY */}

          <div className="space-y-2">

            <Label>
              Parent Category
            </Label>

            <Select
              value={parentId}
              onValueChange={setParentId}
              disabled={loading}
            >

              <SelectTrigger>
                <SelectValue placeholder="Select parent category" />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="none">
                  No Parent Category
                </SelectItem>

                {mainCategories.map(
                  (category) => (
                    <SelectItem
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </SelectItem>
                  )
                )}

              </SelectContent>

            </Select>

            <p className="text-xs text-muted-foreground">
              Leave this as "No Parent Category"
              to create a main category.
            </p>

          </div>

          {/* STATUS */}

          <div className="space-y-2">

            <Label>
              Status
            </Label>

            <Select
              value={status}
              onValueChange={(
                value
              ) =>
                setStatus(
                  value as
                    | "active"
                    | "inactive"
                )
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

          {/* FOOTER */}

          <DialogFooter>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Category"}
            </Button>

          </DialogFooter>

        </form>

      </DialogContent>
    </Dialog>
  );
}