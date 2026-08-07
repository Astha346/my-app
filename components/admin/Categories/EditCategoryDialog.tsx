"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  status?: "active" | "inactive";
}

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  categories: Category[];
  onSuccess: () => void;
}

export default function EditCategoryDialog({
  open,
  onOpenChange,
  category,
  categories,
  onSuccess,
}: EditCategoryDialogProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    parentId: "",
    status: "active",
  });

  useEffect(() => {
    if (!category) return;

    setForm({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
      parentId: category.parentId || "",
      status: category.status || "active",
    });
  }, [category]);

  const handleSubmit = async () => {
    if (!category) return;

    if (!form.name.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      setLoading(true);

      await axios.patch(
        `http://localhost:3001/categories/${category._id}`,
        {
          ...form,
          parentId: form.parentId || null,
        }
      );

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>

          <DialogDescription>
            Update category information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">

          <div>
            <Label>Name</Label>

            <Input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Description</Label>

            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Parent Category</Label>

            <Select
              value={form.parentId}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  parentId: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="none">
                  None
                </SelectItem>

                {categories
                  .filter((c) => c._id !== category?._id)
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

          <div>
            <Label>Image URL</Label>

            <Input
              value={form.image}
              onChange={(e) =>
                setForm({
                  ...form,
                  image: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Status</Label>

            <Select
              value={form.status}
              onValueChange={(value: "active" | "inactive") =>
                setForm({
                  ...form,
                  status: value,
                })
              }
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

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}