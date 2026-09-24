"use client";

import { useState } from "react";

import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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

import Pagination from "@/components/admin/Orders/Pagination";

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

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface CategoryTableProps {
  categories?: Category[];
  products?: Product[];

  pagination: PaginationData;

  onPageChange: (
    page: number
  ) => void;

  onItemsPerPageChange: (
    value: number
  ) => void;

  onEdit?: (
    category: Category
  ) => void;

  onDelete?: (
    category: Category
  ) => void;
}

export default function CategoryTable({
  categories = [],
  products = [],
  pagination,
  onPageChange,
  onItemsPerPageChange,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const [expanded, setExpanded] =
    useState<string[]>([]);

  // =====================================================
  // NORMALIZE
  // =====================================================

  const normalize = (
    value: unknown
  ) => {
    return String(value ?? "")
      .trim()
      .toLowerCase();
  };

  // =====================================================
  // MAIN CATEGORIES
  // =====================================================

  const mainCategories =
    categories.filter(
      (category) =>
        !category.parentId
    );

  // =====================================================
  // CHILD CATEGORIES
  // =====================================================

  const getChildren = (
    parentId: string
  ) => {
    return categories.filter(
      (category) =>
        normalize(
          category.parentId
        ) ===
        normalize(parentId)
    );
  };

  // =====================================================
  // PRODUCTS FOR CATEGORY
  // =====================================================

  const getProductsByCategory = (
    categoryName: string
  ) => {
    return products.filter(
      (product) =>
        normalize(
          product.category
        ) ===
        normalize(categoryName)
    );
  };

  // =====================================================
  // EXPAND / COLLAPSE
  // =====================================================

  const toggleExpand = (
    categoryId: string
  ) => {
    setExpanded((previous) => {
      if (
        previous.includes(
          categoryId
        )
      ) {
        return previous.filter(
          (id) =>
            id !== categoryId
        );
      }

      return [
        ...previous,
        categoryId,
      ];
    });
  };

  // =====================================================
  // EMPTY
  // =====================================================

  if (categories.length === 0) {
    return (
      <Card>

        <CardContent className="flex min-h-75 flex-col items-center justify-center text-center">

          <Folder className="mb-3 h-10 w-10 text-muted-foreground" />

          <h3 className="text-lg font-semibold">
            No categories found
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Create a category to get started.
          </p>

        </CardContent>

      </Card>
    );
  }

  // =====================================================
  // TABLE
  // =====================================================

  return (
    <Card className="overflow-hidden">

      {/* HEADER */}
      <CardHeader className="border-b bg-muted/20">

        <div className="flex items-center justify-between">

          <div>

            <CardTitle>
              Categories & Products
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Expand a category to see its products.
            </p>

          </div>

          <Badge variant="secondary">
            {products.length} Products
          </Badge>

        </div>

      </CardHeader>

      <CardContent className="p-0">

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow className="bg-muted/40">

                <TableHead className="min-w-75">
                  Category / Product
                </TableHead>

                <TableHead>
                  Type
                </TableHead>

                <TableHead>
                  Price
                </TableHead>

                <TableHead>
                  Stock
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead className="w-20 text-right">
                  Actions
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {mainCategories.map(
                (category) => {

                  const children =
                    getChildren(
                      category._id
                    );

                  const categoryProducts =
                    getProductsByCategory(
                      category.name
                    );

                  const isExpanded =
                    expanded.includes(
                      category._id
                    );

                  return (
                    <CategoryRows
                      key={
                        category._id
                      }

                      category={
                        category
                      }

                      children={
                        children
                      }

                      products={
                        categoryProducts
                      }

                      expanded={
                        isExpanded
                      }

                      onToggle={() =>
                        toggleExpand(
                          category._id
                        )
                      }

                      onEdit={
                        onEdit
                      }

                      onDelete={
                        onDelete
                      }

                      getProductsByCategory={
                        getProductsByCategory
                      }
                    />
                  );
                }
              )}

            </TableBody>

          </Table>

        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        <div className="px-5 pb-4">

          <Pagination
            currentPage={
              pagination.page
            }

            totalPages={
              pagination.totalPages
            }

            totalItems={
              pagination.total
            }

            itemsPerPage={
              pagination.limit
            }

            onPageChange={
              onPageChange
            }

            onItemsPerPageChange={
              onItemsPerPageChange
            }

          />

        </div>

      </CardContent>

    </Card>
  );
}

// =======================================================
// CATEGORY ROWS
// =======================================================

interface CategoryRowsProps {
  category: Category;

  children: Category[];

  products: Product[];

  expanded: boolean;

  onToggle: () => void;

  onEdit?: (
    category: Category
  ) => void;

  onDelete?: (
    category: Category
  ) => void;

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

      <TableRow className="hover:bg-muted/30">

        <TableCell>

          <div className="flex items-center gap-3">

            {/* EXPAND BUTTON */}

            {(
              children.length > 0 ||
              products.length > 0
            ) ? (

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={
                  onToggle
                }
              >

                {expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}

              </Button>

            ) : (

              <div className="w-8" />

            )}

            {/* FOLDER */}

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">

              {expanded ? (
                <FolderOpen className="h-5 w-5 text-primary" />
              ) : (
                <Folder className="h-5 w-5 text-primary" />
              )}

            </div>

            {/* NAME */}

            <div>

              <p className="font-semibold">
                {category.name}
              </p>

              {category.description && (
                <p className="max-w-100 truncate text-xs text-muted-foreground">
                  {category.description}
                </p>
              )}

            </div>

          </div>

        </TableCell>

        {/* TYPE */}

        <TableCell>

          <Badge variant="secondary">
            Main Category
          </Badge>

        </TableCell>

        {/* PRICE */}

        <TableCell>
          -
        </TableCell>

        {/* PRODUCTS */}

        <TableCell>

          <div className="flex items-center gap-2">

            <Package className="h-4 w-4 text-muted-foreground" />

            {products.length}

          </div>

        </TableCell>

        {/* STATUS */}

        <TableCell>

          <StatusBadge
            status={
              category.status
            }
          />

        </TableCell>

        {/* ACTIONS */}

        <TableCell className="text-right">

          <CategoryActions
            category={
              category
            }

            onEdit={
              onEdit
            }

            onDelete={
              onDelete
            }
          />

        </TableCell>

      </TableRow>

      {/* =================================================
          SUBCATEGORIES
      ================================================= */}

      {expanded &&
        children.map(
          (child) => {

            const childProducts =
              getProductsByCategory(
                child.name
              );

            return (

              <TableRow
                key={
                  child._id
                }
                className="bg-muted/20"
              >

                <TableCell>

                  <div className="flex items-center gap-3 pl-12">

                    <Folder className="h-4 w-4 text-muted-foreground" />

                    <div>

                      <p className="text-sm font-medium">
                        {child.name}
                      </p>

                    </div>

                  </div>

                </TableCell>

                <TableCell>

                  <Badge variant="outline">
                    Subcategory
                  </Badge>

                </TableCell>

                <TableCell>
                  -
                </TableCell>

                <TableCell>
                  {childProducts.length}
                </TableCell>

                <TableCell>

                  <StatusBadge
                    status={
                      child.status
                    }
                  />

                </TableCell>

                <TableCell className="text-right">

                  <CategoryActions
                    category={
                      child
                    }

                    onEdit={
                      onEdit
                    }

                    onDelete={
                      onDelete
                    }
                  />

                </TableCell>

              </TableRow>

            );
          }
        )}

      {/* =================================================
          PRODUCTS
      ================================================= */}

      {expanded &&
        products.map(
          (product) => (

            <TableRow
              key={
                product._id
              }
              className="bg-background hover:bg-muted/20"
            >

              <TableCell>

                <div className="flex items-center gap-3 pl-20">

                  {/* IMAGE */}

                  {product.image ? (

                    <img
                      src={
                        product.image
                      }
                      alt={
                        product.name
                      }
                      className="h-10 w-10 rounded-lg object-cover"
                    />

                  ) : (

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">

                      <Package className="h-4 w-4 text-muted-foreground" />

                    </div>

                  )}

                  {/* PRODUCT NAME */}

                  <div>

                    <p className="text-sm font-medium">
                      {product.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {product.category}
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

                <span className="font-medium">
                  Rs.{" "}
                  {product.price}
                </span>

              </TableCell>

              {/* STOCK */}

              <TableCell>
                {product.stock}
              </TableCell>

              {/* STOCK STATUS */}

              <TableCell>

                <Badge
                  variant={
                    Number(
                      product.stock
                    ) > 0
                      ? "default"
                      : "destructive"
                  }
                >

                  {Number(
                    product.stock
                  ) > 0
                    ? "In Stock"
                    : "Out of Stock"}

                </Badge>

              </TableCell>

              {/* ACTIONS */}

              <TableCell />

            </TableRow>

          )
        )}

    </>
  );
}

// =======================================================
// STATUS BADGE
// =======================================================

function StatusBadge({
  status,
}: {
  status?: string;
}) {

  const active =
    status?.toLowerCase() ===
    "active";

  return (
    <Badge
      variant={
        active
          ? "default"
          : "secondary"
      }
    >

      {active
        ? "Active"
        : "Inactive"}

    </Badge>
  );
}

// =======================================================
// CATEGORY ACTIONS
// =======================================================

function CategoryActions({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;

  onEdit?: (
    category: Category
  ) => void;

  onDelete?: (
    category: Category
  ) => void;
}) {

  return (
    <DropdownMenu>

      <DropdownMenuTrigger
        asChild
      >

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >

          <MoreHorizontal className="h-4 w-4" />

          <span className="sr-only">
            Category actions
          </span>

        </Button>

      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">

        {/* EDIT */}

        <DropdownMenuItem
          onClick={() =>
            onEdit?.(
              category
            )
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
            onDelete?.(
              category
            )
          }
        >

          <Trash2 className="mr-2 h-4 w-4" />

          Delete

        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}