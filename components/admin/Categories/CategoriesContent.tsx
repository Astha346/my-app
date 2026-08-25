"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";

import type { Category } from "@/types/category";

import CategoryHeader from "./CategoryHeader";
import CategoryTable from "./CategoryTable";
import EditCategoryDialog from "./EditCategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import AddCategoryDialog from "./AddCategoryDialog";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: string | number;
  image?: string;
  description?: string;
  stock: string | number;
}

export default function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);

  const [editCategory, setEditCategory] =
    useState<Category | null>(null);

  const [deleteCategory, setDeleteCategory] =
    useState<Category | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // =====================================================
  // NORMALIZE
  // =====================================================

  const normalize = (value: unknown) => {
    return String(value ?? "")
      .trim()
      .toLowerCase();
  };

  // =====================================================
  // FETCH DATA
  // =====================================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [categoriesResponse, productsResponse] =
        await Promise.all([
          api.get("/categories"),
          api.get("/products"),
        ]);

      const categoryData: Category[] =
        Array.isArray(categoriesResponse.data)
          ? categoriesResponse.data
          : [];

      const productData: Product[] =
        Array.isArray(productsResponse.data)
          ? productsResponse.data
          : [];

      console.log(
        "========== CATEGORIES API =========="
      );

      console.log(categoryData);

      console.log(
        "========== PRODUCTS API =========="
      );

      console.log(productData);

      // =================================================
      // CREATE MISSING CATEGORIES FROM PRODUCTS
      // =================================================

      const existingCategoryNames = new Set(
        categoryData.map((category) =>
          normalize(category.name)
        )
      );

      const productCategoryNames = Array.from(
        new Set(
          productData
            .map((product) => product.category?.trim())
            .filter(Boolean)
        )
      );

      const missingCategories: Category[] =
        productCategoryNames
          .filter(
            (categoryName) =>
              !existingCategoryNames.has(
                normalize(categoryName)
              )
          )
          .map((categoryName, index) => ({
            _id: `product-category-${index}-${normalize(
              categoryName
            )}`,
            name: categoryName,
            description:
              `Products in ${categoryName}`,
            image: "",
            parentId: null,
            productCount: productData.filter(
              (product) =>
                normalize(product.category) ===
                normalize(categoryName)
            ).length,
            status: "active",
          }));

      // =================================================
      // COMBINE REAL + PRODUCT CATEGORIES
      // =================================================

      const combinedCategories: Category[] = [
        ...categoryData,
        ...missingCategories,
      ];

      console.log(
        "========== FINAL CATEGORIES =========="
      );

      console.log(combinedCategories);

      console.log(
        "TOTAL CATEGORIES:",
        combinedCategories.length
      );

      console.log(
        "TOTAL PRODUCTS:",
        productData.length
      );

      setCategories(combinedCategories);
      setProducts(productData);
    } catch (error) {
      console.error(
        "Failed to fetch categories/products:",
        error
      );

      setCategories([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchData();
  }, []);

  // =====================================================
  // ADD CATEGORY
  // =====================================================

  const handleAddCategory = () => {
    setAddOpen(true);
  };

  // =====================================================
  // EDIT CATEGORY
  // =====================================================

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setEditOpen(true);
  };

  // =====================================================
  // DELETE CATEGORY
  // =====================================================

  const handleDelete = (category: Category) => {
    setDeleteCategory(category);
    setDeleteOpen(true);
  };

  // =====================================================
  // SUCCESS
  // =====================================================

  const handleSuccess = () => {
    fetchData();
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <CategoryHeader
        onAddCategory={handleAddCategory}
      />

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Total Categories
          </p>

          <p className="mt-2 text-2xl font-bold">
            {categories.length}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Total Products
          </p>

          <p className="mt-2 text-2xl font-bold">
            {products.length}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Categories With Products
          </p>

          <p className="mt-2 text-2xl font-bold">
            {
              categories.filter((category) =>
                products.some(
                  (product) =>
                    normalize(product.category) ===
                    normalize(category.name)
                )
              ).length
            }
          </p>
        </div>

      </div>

      {/* =================================================
          DEBUG
          ================================================= */}

      <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm">

        <div className="flex flex-wrap gap-x-6 gap-y-1">

          <span>
            Categories:{" "}
            <strong>{categories.length}</strong>
          </span>

          <span>
            Products:{" "}
            <strong>{products.length}</strong>
          </span>

        </div>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card">

          <div className="text-center">

            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

            <p className="text-sm text-muted-foreground">
              Loading categories...
            </p>

          </div>

        </div>
      ) : (
        <CategoryTable
          categories={categories}
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* =================================================
          ADD CATEGORY
      ================================================= */}

      <AddCategoryDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        categories={categories}
        onSuccess={handleSuccess}
      />

      {/* =================================================
          EDIT CATEGORY
      ================================================= */}

      <EditCategoryDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        category={editCategory}
        categories={categories}
        onSuccess={handleSuccess}
      />

      {/* =================================================
          DELETE CATEGORY
      ================================================= */}

      <DeleteCategoryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={deleteCategory}
        onSuccess={handleSuccess}
      />

    </div>
  );
}