"use client";

import { useEffect, useState } from "react";

import CategoryHeader from "./CategoryHeader";
import CategoryStats from "./CategoryStats";
import CategoryFilters from "./CategoryFilters";
import CategoryTable from "./CategoryTable";

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  productCount?: number;
  status?: "active" | "inactive";
}

export default function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [parent, setParent] = useState("all");
  const [status, setStatus] = useState("all");

  // fetch categories here

  return (
    <div className="space-y-6">

      <CategoryHeader
        onAddCategory={() => {
          // open add category dialog
        }}
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
      />

    </div>
  );
}