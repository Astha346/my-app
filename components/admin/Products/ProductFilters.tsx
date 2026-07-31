
"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  search: string;
  category: string;
  brand: string;
  status: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

export default function ProductFilters({
  search,
  category,
  brand,
  status,
  onSearchChange,
  onCategoryChange,
  onBrandChange,
  onStatusChange,
  onReset,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-5">

      <div className="grid gap-4 md:grid-cols-5">

        {/* Search */}
        <div className="relative md:col-span-2">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="pl-10"
          />
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-lg border px-3"
        >
          <option value="all">All Categories</option>
          <option value="Beauty">Beauty</option>
          <option value="Fragrances">Fragrances</option>
          <option value="Furniture">Furniture</option>
          <option value="Groceries">Groceries</option>
          <option value="Laptops">Laptops</option>
          <option value="Mens Shirts">Mens Shirts</option>
        </select>

        {/* Brand */}
        <select
          value={brand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="rounded-lg border px-3"
        >
          <option value="all">All Brands</option>
          <option value="Apple">Apple</option>
          <option value="Samsung">Samsung</option>
          <option value="Nike">Nike</option>
          <option value="Nivea">Nivea</option>
          <option value="Garnier">Garnier</option>
          <option value="Dior">Dior</option>
          <option value="Versace">Versace</option>
          <option value="Davidoff">Davidoff</option>
          <option value="Armani">Armani</option>
          <option value="YSL">YSL</option>
          <option value="Hugo Boss">Hugo Boss</option>
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-lg border px-3"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

      </div>

      <div className="mt-4 flex justify-end gap-3">

        <Button
          type="button"
          variant="outline"
          onClick={onReset}
        >
          Reset
        </Button>

      </div>

    </div>
  );
}

