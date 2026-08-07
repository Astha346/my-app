"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import CategoryHeader from "./CategoryHeader";
import CategoryStats from "./CategoryStats";
import CategoryFilters from "./CategoryFilters";
import CategoryTable from "./CategoryTable";
import AddCategoryDialog from "./AddCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";

import type { Category } from "@/types/category";
export default function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [parent, setParent] = useState("all");
  const [status, setStatus] = useState("all");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [editingCategory, setEditingCategory] =
  useState<Category | null>(null);

   const [isEditDialogOpen, setIsEditDialogOpen] =
  useState(false); 
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
  "http://localhost:3001/categories"
    );
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryCreated = async () => {
    setIsAddDialogOpen(false);
    await fetchCategories();
  };

  return (
    <div className="space-y-6">
      <CategoryHeader
        onAddCategory={() => setIsAddDialogOpen(true)}
      />

      <CategoryStats
        categories={categories}
      />

      <CategoryFilters
        search={search}
        parent={parent}
        status={status}
        categories={categories}
        onSearchChange={setSearch}
        onParentChange={setParent}
        onStatusChange={setStatus}
        onReset={() => {
          setSearch("");
          setParent("all");
          setStatus("all");
        }}
      />

     <CategoryTable
  categories={categories}
  onEdit={(category: Category) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  }}
/>
    

      <AddCategoryDialog
  open={isAddDialogOpen}
  onOpenChange={setIsAddDialogOpen}
  categories={categories}
  onSuccess={handleCategoryCreated}
/>
  <EditCategoryDialog
  open={isEditDialogOpen}
  onOpenChange={setIsEditDialogOpen}
  category={editingCategory}
  categories={categories}
  onSuccess={async () => {
    setIsEditDialogOpen(false);
    setEditingCategory(null);
    await fetchCategories();
  }}
/>
    </div>
  );
}