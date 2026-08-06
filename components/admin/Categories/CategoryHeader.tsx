
"use client";

import { FolderTree, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CategoryHeaderProps {
  onAddCategory: () => void;
}

export default function CategoryHeader({
  onAddCategory,
}: CategoryHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      {/* LEFT */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <FolderTree className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Categories
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage product categories and their subcategories
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <Button
        type="button"
        onClick={onAddCategory}
        className="w-full gap-2 sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        Add Category
      </Button>
    </div>
  );
}

