
"use client";

import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Trash2,
  Folder,
  FolderOpen,
  Package,
} from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";

import type { Category } from "@/types/category";

interface CategoryTableProps {
  categories?: Category[];
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export default function CategoryTable({
  categories = [],
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const [expanded, setExpanded] = useState<string[]>([]);

  const safeCategories = Array.isArray(categories)
    ? categories
    : [];

  const mainCategories = safeCategories.filter(
    (category) => !category.parentId
  );

  const getChildren = (parentId: string) => {
    return safeCategories.filter(
      (category) => category.parentId === parentId
    );
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  if (safeCategories.length === 0) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="flex min-h-75 flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Folder className="h-6 w-6 text-muted-foreground" />
          </div>

          <h3 className="text-lg font-semibold">
            No categories found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            There are no categories to display yet.
            Create your first category to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 shadow-sm">

      {/* TABLE */}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>

            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[45%]">
                  Category
                </TableHead>

                <TableHead>Type</TableHead>

                <TableHead>Products</TableHead>

                <TableHead>Status</TableHead>

                <TableHead className="w-17.5 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {mainCategories.map((category) => {
                const children = getChildren(
                  category._id
                );

                const isExpanded = expanded.includes(
                  category._id
                );

                return (
                  <CategoryRows
                    key={category._id}
                    category={category}
                    children={children}
                    expanded={isExpanded}
                    onToggle={() =>
                      toggleExpand(category._id)
                    }
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                );
              })}
            </TableBody>

          </Table>
        </div>
      </CardContent>
    </Card>
    );
    }

  interface CategoryRowsProps {
  category: Category;
  children: Category[];
  expanded: boolean;
  onToggle: () => void;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

function CategoryRows({
  category,
  children,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}: CategoryRowsProps) {
  return (
    <>
      {/* MAIN CATEGORY */}
      <TableRow className="group">

        <TableCell>
          <div className="flex items-center gap-3">

            {children.length > 0 ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onToggle}
              >
                {expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="w-7" />
            )}

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              {expanded ? (
                <FolderOpen className="h-4 w-4 text-primary" />
              ) : (
                <Folder className="h-4 w-4 text-primary" />
              )}
            </div>

            <div className="min-w-0">
              <p className="font-medium">
                {category.name}
              </p>

              {category.description && (
                <p className="max-w-87.5 truncate text-xs text-muted-foreground">
                  {category.description}
                </p>
              )}
            </div>
          </div>
          </TableCell>

         <TableCell>
          <Badge variant="secondary">
            Main
          </Badge>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-muted-foreground" />

            {category.productCount ?? 0}
          </div>
        </TableCell>

        <TableCell>
          <StatusBadge
            status={category.status}
          />
        </TableCell>

        <TableCell className="text-right">
          <CategoryActions
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </TableCell>

      </TableRow>

      {/* SUBCATEGORIES */}
      {expanded &&
        children.map((child) => (
          <TableRow
            key={child._id}
            className="bg-muted/20"
          >

            <TableCell>
              <div className="flex items-center gap-3 pl-12">

                <div className="h-6 w-px bg-border" />

                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                  <Folder className="h-4 w-4 text-muted-foreground" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {child.name}
                  </p>

                  {child.description && (
                    <p className="max-w-75 truncate text-xs text-muted-foreground">
                      {child.description}
                    </p>
                  )}
                </div>

              </div>
            </TableCell>

            <TableCell>
              <Badge variant="outline">
                Subcategory
              </Badge>
            </TableCell>

            <TableCell>
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-muted-foreground" />

                {child.productCount ?? 0}
              </div>
            </TableCell>

            <TableCell>
              <StatusBadge
                status={child.status}
              />
            </TableCell>

            <TableCell className="text-right">
              <CategoryActions
                category={child}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </TableCell>

          </TableRow>
        ))}
    </>
  );
}

  function StatusBadge({
  status,
  }: {
  status?: string;
  }) {
  const isActive =
    status?.toLowerCase() === "active";

  return (
    <Badge
      variant={isActive ? "default" : "secondary"}
      className={
        isActive
          ? "bg-emerald-600 hover:bg-emerald-600"
          : ""
      }
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          isActive
            ? "bg-white"
            : "bg-muted-foreground"
        }`}
      />

      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
  }

function CategoryActions({
  category,
  onEdit,
  onDelete,
   }: {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
   }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">
            Open actions
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">

        <DropdownMenuItem
          onClick={() => onEdit?.(category)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete?.(category)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}

