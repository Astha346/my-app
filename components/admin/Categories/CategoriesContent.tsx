
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import type { Category } from "@/types/category";

import CategoryHeader from "./CategoryHeader";
import CategoryTable from "./CategoryTable";
import AddCategoryDialog from "./AddCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: string | number;
  image?: string;
  description?: string;
  stock: number;
}

export default function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [editCategory, setEditCategory] =
    useState<Category | null>(null);

  const [deleteCategory, setDeleteCategory] =
    useState<Category | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [categoriesResponse, productsResponse] =
        await Promise.all([
          axios.get("http://localhost:3001/categories"),
          axios.get("http://localhost:3001/products"),
        ]);

      console.log(
        "CATEGORIES RESPONSE:",
        categoriesResponse.data
      );

      console.log(
        "PRODUCTS RESPONSE:",
        productsResponse.data
      );

      const categoryData: Category[] =
        Array.isArray(categoriesResponse.data)
          ? categoriesResponse.data
          : [];

      const productData: Product[] =
        Array.isArray(productsResponse.data)
          ? productsResponse.data
          : [];

      console.log("CATEGORY COUNT:", categoryData.length);
      console.log("PRODUCT COUNT:", productData.length);

      setCategories(categoryData);
      setProducts(productData);
    } catch (error) {
      console.error(
        "Failed to fetch category/product data:",
        error
      );

      setCategories([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setEditOpen(true);
  };

  const handleDelete = (category: Category) => {
    setDeleteCategory(category);
    setDeleteOpen(true);
  };

  const handleSuccess = () => {
    fetchData();
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <CategoryHeader
        onAddCategory={() => setAddOpen(true)}
      />

      {/* ADD CATEGORY */}
      <AddCategoryDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        categories={categories}
        onSuccess={handleSuccess}
      />

      {/* DEBUG COUNTS */}
      <div className="text-sm text-muted-foreground">
        Categories: {categories.length} | Products:{" "}
        {products.length}
      </div>

      {/* TABLE */}
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

      {/* EDIT */}
      <EditCategoryDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        category={editCategory}
        categories={categories}
        onSuccess={handleSuccess}
      />

      {/* DELETE */}
      <DeleteCategoryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={deleteCategory}
        onSuccess={handleSuccess}
      />

    </div>
  );
}

