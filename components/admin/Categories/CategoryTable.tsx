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

interface Product {
  _id: string;
  name: string;
  category: string;
  price: string | number;
  image?: string;
  description?: string;
  stock: string | number;
}

interface CategoryTableProps {
  categories?: Category[];
  products?: Product[];
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export default function CategoryTable({
  categories = [],
  products = [],
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const [expanded, setExpanded] = useState<string[]>([]);

  /*
   * SAFETY
   *
   * Make sure categories and products
   * are always arrays.
   */
  const safeCategories = Array.isArray(categories)
    ? categories
    : [];

  const safeProducts = Array.isArray(products)
    ? products
    : [];

  /*
   * NORMALIZE TEXT
   *
   * Beauty
   * beauty
   * " Beauty "
   *
   * all become:
   *
   * beauty
   */
  const normalize = (value: unknown) => {
    return String(value ?? "")
      .trim()
      .toLowerCase();
  };

  /*
   * MAIN CATEGORIES
   *
   * parentId = null
   * parentId = undefined
   * parentId = ""
   *
   * means it is a main category.
   */
  const mainCategories = safeCategories.filter(
    (category) => !category.parentId
  );

  /*
   * GET SUBCATEGORIES
   */
  const getChildren = (parentId: string) => {
    return safeCategories.filter(
      (category) =>
        normalize(category.parentId) === normalize(parentId)
    );
  };

  /*
   * GET PRODUCTS BELONGING TO CATEGORY
   *
   * Category:
   * {
   *   name: "Beauty"
   * }
   *
   * Product:
   * {
   *   category: "Beauty"
   * }
   *
   * So we compare:
   *
   * category.name
   * with
   * product.category
   */
  const getProductsByCategory = (categoryName: string) => {
    return safeProducts.filter(
      (product) =>
        normalize(product.category) ===
        normalize(categoryName)
    );
  };

  /*
   * EXPAND / COLLAPSE
   */
  const toggleExpand = (categoryId: string) => {
    setExpanded((previous) => {
      if (previous.includes(categoryId)) {
        return previous.filter(
          (id) => id !== categoryId
        );
      }

      return [...previous, categoryId];
    });
  };

  /*
   * DEBUG
   */
  console.log(
    "CATEGORY NAMES:",
    safeCategories.map((category) => category.name)
  );

  console.log(
    "PRODUCT CATEGORY VALUES:",
    safeProducts.map((product) => product.category)
  );

  console.log(
    "MAIN CATEGORIES:",
    mainCategories.map((category) => category.name)
  );

  /*
   * NO CATEGORY
   */
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

  /*
   * TABLE
   */
  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>

            {/* TABLE HEADER */}
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">

                <TableHead className="w-[45%]">
                  Category
                </TableHead>

                <TableHead>
                  Type
                </TableHead>

                <TableHead>
                  Products
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead className="w-17.5 text-right">
                  Actions
                </TableHead>

              </TableRow>
            </TableHeader>

            {/* TABLE BODY */}
            <TableBody>

              {mainCategories.map((category) => {
                const children = getChildren(
                  category._id
                );

                const categoryProducts =
                  getProductsByCategory(
                    category.name
                  );

                const isExpanded =
                  expanded.includes(category._id);

                return (
                  <CategoryRows
                    key={category._id}
                    category={category}
                    children={children}
                    products={categoryProducts}
                    expanded={isExpanded}
                    onToggle={() =>
                      toggleExpand(category._id)
                    }
                    onEdit={onEdit}
                    onDelete={onDelete}
                    getProductsByCategory={
                      getProductsByCategory
                    }
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

/* =========================================================
   CATEGORY ROWS
   ========================================================= */

interface CategoryRowsProps {
  category: Category;
  children: Category[];
  products: Product[];
  expanded: boolean;
  onToggle: () => void;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  getProductsByCategory: (
    categoryName: string
  ) => Product[];
}

function CategoryRows({
  category,
  children,
  products,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  getProductsByCategory,
}: CategoryRowsProps) {
  return (
    <>
      {/* =================================================
          MAIN CATEGORY
          ================================================= */}

      <TableRow className="group">

        {/* CATEGORY NAME */}
        <TableCell>
          <div className="flex items-center gap-3">

            {/* EXPAND BUTTON */}
            {children.length > 0 ||
            products.length > 0 ? (
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

            {/* FOLDER ICON */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              {expanded ? (
                <FolderOpen className="h-4 w-4 text-primary" />
              ) : (
                <Folder className="h-4 w-4 text-primary" />
              )}
            </div>

            {/* NAME */}
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

        {/* TYPE */}
        <TableCell>
          <Badge variant="secondary">
            Main
          </Badge>
        </TableCell>

        {/* PRODUCT COUNT */}
        <TableCell>
          <div className="flex items-center gap-2 text-sm">

            <Package className="h-4 w-4 text-muted-foreground" />

            {products.length}

          </div>
        </TableCell>

        {/* STATUS */}
        <TableCell>
          <StatusBadge
            status={category.status}
          />
        </TableCell>

        {/* ACTIONS */}
        <TableCell className="text-right">

          <CategoryActions
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />

        </TableCell>

      </TableRow>

      {/* =================================================
          SUBCATEGORIES
          ================================================= */}

      {expanded &&
        children.map((child) => {

          const childProducts =
            getProductsByCategory(
              child.name
            );

          return (
            <TableRow
              key={child._id}
              className="bg-muted/20"
            >

              {/* NAME */}
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

              {/* TYPE */}
              <TableCell>

                <Badge variant="outline">
                  Subcategory
                </Badge>

              </TableCell>

              {/* PRODUCTS */}
              <TableCell>

                <div className="flex items-center gap-2 text-sm">

                  <Package className="h-4 w-4 text-muted-foreground" />

                  {childProducts.length}

                </div>

              </TableCell>

              {/* STATUS */}
              <TableCell>

                <StatusBadge
                  status={child.status}
                />

              </TableCell>

              {/* ACTIONS */}
              <TableCell className="text-right">

                <CategoryActions
                  category={child}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />

              </TableCell>

            </TableRow>
          );
        })}

      {/* =================================================
          PRODUCTS
          ================================================= */}

      {expanded &&
        products.map((product) => (

          <TableRow
            key={product._id}
            className="bg-background"
          >

            {/* PRODUCT */}
            <TableCell>

              <div className="flex items-center gap-3 pl-20">

                {/* IMAGE */}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-9 w-9 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">

                    <Package className="h-4 w-4 text-muted-foreground" />

                  </div>
                )}

                {/* NAME */}
                <div className="min-w-0">

                  <p className="text-sm font-medium">
                    {product.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Stock: {product.stock}
                  </p>

                </div>

              </div>

            </TableCell>

            {/* TYPE */}
            <TableCell>

              <Badge variant="outline">
                Product
              </Badge>

            </TableCell>

            {/* PRICE */}
            <TableCell>

              <span className="text-sm">
                Rs. {product.price}
              </span>

            </TableCell>

            {/* STOCK */}
            <TableCell>

              <Badge
                variant={
                  Number(product.stock) > 0
                    ? "secondary"
                    : "destructive"
                }
              >
                {Number(product.stock) > 0
                  ? "In Stock"
                  : "Out of Stock"}
              </Badge>

            </TableCell>

            {/* EMPTY ACTION */}
            <TableCell />

          </TableRow>

        ))}

    </>
  );
}

/* =========================================================
   STATUS BADGE
   ========================================================= */

function StatusBadge({
  status,
}: {
  status?: string;
}) {
  const isActive =
    status?.toLowerCase() === "active";

  return (
    <Badge
      variant={
        isActive
          ? "default"
          : "secondary"
      }
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

      {isActive
        ? "Active"
        : "Inactive"}

    </Badge>
  );
}

/* =========================================================
   CATEGORY ACTIONS
   ========================================================= */

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

        {/* EDIT */}
        <DropdownMenuItem
          onClick={() =>
            onEdit?.(category)
          }
        >

          <Pencil className="mr-2 h-4 w-4" />

          Edit

        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* DELETE */}
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() =>
            onDelete?.(category)
          }
        >

          <Trash2 className="mr-2 h-4 w-4" />

          Delete

        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}