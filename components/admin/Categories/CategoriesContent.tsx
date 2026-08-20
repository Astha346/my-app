"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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

  
  // FETCH PRODUCTS


  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:3001/products"
      );

      const productData: Product[] =
        Array.isArray(response.data)
          ? response.data
          : [];

      console.log("PRODUCTS:", productData);

      setProducts(productData);

      // CREATE CATEGORIES FROM PRODUCTS
      

      const categoryMap = new Map<string, Category>();

      productData.forEach((product) => {
        const categoryName =
          product.category?.trim();

        if (!categoryName) return;

        const normalizedName =
          categoryName.toLowerCase();

        if (!categoryMap.has(normalizedName)) {
          categoryMap.set(normalizedName, {
            _id: normalizedName,
            name: categoryName,
            description: "",
            status: "active",
            parentId: null,
          } as Category);
        }
      });

      const generatedCategories =
        Array.from(categoryMap.values());

      console.log(
        "GENERATED CATEGORIES:",
        generatedCategories
      );

      setCategories(generatedCategories);
    } catch (error) {
      console.error(
        "Failed to fetch products:",
        error
      );

      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // INITIAL LOAD
  

  useEffect(() => {
    fetchProducts();
  }, []);

  // EDIT
  

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setEditOpen(true);
  };


  // DELETE
  
  const handleDelete = (category: Category) => {
    setDeleteCategory(category);
    setDeleteOpen(true);
  };

  // SUCCESS
  

  const handleSuccess = () => {
    fetchProducts();
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <CategoryHeader
        onAddCategory={() => {
          console.log(
            "Add Category clicked"
          );
        }}
      />

      {/* DEBUG */}

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