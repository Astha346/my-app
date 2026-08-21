"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";

import type { Category } from "@/types/category";

import CategoryHeader from "./CategoryHeader";
import CategoryTable from "./CategoryTable";
import EditCategoryDialog from "./EditCategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

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

  const [editCategory, setEditCategory] =
    useState<Category | null>(null);

  const [deleteCategory, setDeleteCategory] =
    useState<Category | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // ==========================================
  // FETCH CATEGORIES + PRODUCTS
  // ==========================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        categoriesResponse,
        productsResponse,
      ] = await Promise.all([
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
        "CATEGORIES:",
        categoryData
      );

      console.log(
        "PRODUCTS:",
        productData
      );

      setCategories(categoryData);
      setProducts(productData);
    } catch (error) {
      console.error(
        "Failed to fetch data:",
        error
      );

      setCategories([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // EDIT CATEGORY
  // ==========================================

  const handleEdit = (
    category: Category
  ) => {
    setEditCategory(category);
    setEditOpen(true);
  };

  // ==========================================
  // DELETE CATEGORY
  // ==========================================

  const handleDelete = (
    category: Category
  ) => {
    setDeleteCategory(category);
    setDeleteOpen(true);
  };

  // ==========================================
  // AFTER CREATE / UPDATE / DELETE
  // ==========================================

  const handleSuccess = () => {
    fetchData();
  };

  return (
    <div className="space-y-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <CategoryHeader
        onAddCategory={() => {
          console.log(
            "Add Category clicked"
          );
        }}
      />

      {/* ======================================
          DEBUG INFO
          You can remove this later
      ====================================== */}

      <div className="text-sm text-muted-foreground">
        Categories: {categories.length} | Products:{" "}
        {products.length}
      </div>

      {/* ======================================
          TABLE
      ====================================== */}

      {loading ? (
        <div className="flex min-h-75 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading categories...
          </p>
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* ======================================
          EDIT CATEGORY
      ====================================== */}

      <EditCategoryDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        category={editCategory}
        categories={categories}
        onSuccess={handleSuccess}
      />

      {/* ======================================
          DELETE CATEGORY
      ====================================== */}

      <DeleteCategoryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={deleteCategory}
        onSuccess={handleSuccess}
      />

    </div>
  );
}