
"use client";

import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Category {
  _id: string;
  name: string;
  parentId?: string | null;
  status?: string;
}

interface CategoryFiltersProps {
  search: string;
  parent: string;
  status: string;
  categories?: Category[];

  onSearchChange: (value: string) => void;
  onParentChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

export default function CategoryFilters({
  search,
  parent,
  status,
  categories = [],
  onSearchChange,
  onParentChange,
  onStatusChange,
  onReset,
}: CategoryFiltersProps) {
  const mainCategories = categories.filter(
    (category) => !category.parentId
  );

  const hasFilters =
    search.trim() !== "" ||
    parent !== "all" ||
    status !== "all";

  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="p-5">
        <div className="flex flex-col gap-5">

          {/* HEADER */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Filter Categories
                </h3>

                <p className="text-xs text-muted-foreground">
                  Search and filter your categories
                </p>
              </div>
            </div>

            {hasFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>

          {/* FILTERS */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">

            {/* SEARCH */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(e) =>
                  onSearchChange(e.target.value)
                }
                placeholder="Search categories..."
                className="h-10 pl-9"
              />
            </div>

            {/* PARENT */}
            <Select
              value={parent}
              onValueChange={onParentChange}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Categories
                </SelectItem>

                <SelectItem value="root">
                  Main Categories
                </SelectItem>

                {mainCategories.map((category) => (
                  <SelectItem
                    key={category._id}
                    value={category._id}
                  >
                    {category.name} Subcategories
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* STATUS */}
            <Select
              value={status}
              onValueChange={onStatusChange}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Status
                </SelectItem>

                <SelectItem value="active">
                  Active
                </SelectItem>

                <SelectItem value="inactive">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ACTIVE FILTERS */}
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 border-t pt-4">
              <span className="text-xs font-medium text-muted-foreground">
                Active filters:
              </span>

              {search.trim() && (
                <div className="rounded-md bg-muted px-2.5 py-1 text-xs">
                  Search: <span className="font-medium">{search}</span>
                </div>
              )}

              {parent !== "all" && (
                <div className="rounded-md bg-muted px-2.5 py-1 text-xs">
                  Parent:{" "}
                  <span className="font-medium">
                    {parent === "root"
                      ? "Main Categories"
                      : mainCategories.find(
                          (category) =>
                            category._id === parent
                        )?.name ?? "Category"}
                  </span>
                </div>
              )}

              {status !== "all" && (
                <div className="rounded-md bg-muted px-2.5 py-1 text-xs">
                  Status:{" "}
                  <span className="font-medium capitalize">
                    {status}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

