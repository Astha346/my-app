"use client";

import { useState } from "react";
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
}

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSuccess: () => void;
}

export default function AddCategoryDialog({
  open,
  onOpenChange,
  categories,
  onSuccess,
}: AddCategoryDialogProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    parentId: "",
    status: "active",
  });

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:3001/categories", {
        ...form,
        parentId: form.parentId || null,
        productCount: 0,
      });

      setForm({
        name: "",
        description: "",
        image: "",
        parentId: "",
        status: "active",
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>

          <DialogDescription>
            Create a new product category.
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
                <SelectItem value="">
                  None
                </SelectItem>

                {categories.map((category) => (
                  <SelectItem
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
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
              onValueChange={(value) =>
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
            {loading
              ? "Creating..."
              : "Create Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}