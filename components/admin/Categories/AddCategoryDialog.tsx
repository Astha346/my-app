"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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
const [status, setStatus] = useState<"active" | "inactive">("active");

const [loading, setLoading] = useState(false);

useEffect(() => {
if (!open) {
setName("");
setDescription("");
setParentId("none");
setStatus("active");
}
}, [open]);

const safeCategories = Array.isArray(categories)
? categories
: [];

const handleSubmit = async (
event: React.FormEvent<HTMLFormElement>
) => {
event.preventDefault();


if (!name.trim()) {
  alert("Category name is required");
  return;
}

try {
  setLoading(true);

  const response = await axios.post(
    "http://localhost:3001/categories",
    {
      name: name.trim(),
      description: description.trim(),
      parentId: parentId === "none" ? null : parentId,
      status,
    }
  );

  console.log("Category created:", response.data);

  setName("");
  setDescription("");
  setParentId("none");
  setStatus("active");

  onOpenChange(false);

  onSuccess?.();
} catch (error) {
  console.error("Failed to create category:", error);

  if (axios.isAxiosError(error)) {
    console.error("Response:", error.response?.data);
  }

  alert("Failed to create category");
} finally {
  setLoading(false);
}


};

     return ( <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-125"> <DialogHeader> 
      <DialogTitle>Add Category</DialogTitle>

      <DialogDescription>
        Create a new category or subcategory.
      </DialogDescription>
    </DialogHeader>

    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* CATEGORY NAME */}
      <div className="space-y-2">
        <Label htmlFor="category-name">
          Category Name
        </Label>

        <Input
          id="category-name"
          placeholder="Enter category name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
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
            setDescription(event.target.value)
          }
          className="resize-none"
        />
      </div>

      {/* PARENT CATEGORY */}
      <div className="space-y-2">
        <Label>Parent Category</Label>

        <Select
          value={parentId}
          onValueChange={setParentId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select parent category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="none">
              No Parent Category
            </SelectItem>

            {safeCategories
              .filter(
                (category) => !category.parentId
              )
              .map((category) => (
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

      {/* STATUS */}
      <div className="space-y-2">
        <Label>Status</Label>

        <Select
          value={status}
          onValueChange={(
            value: "active" | "inactive"
          ) => setStatus(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
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
          onClick={() => onOpenChange(false)}
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
