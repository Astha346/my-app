"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProductFilters() {
  return (
    <div className="bg-white rounded-xl border p-5">

      <div className="grid gap-4 md:grid-cols-5">

        {/* Search */}
        <div className="relative md:col-span-2">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <Input
            placeholder="Search products..."
            className="pl-10"
          />
        </div>

        {/* Category */}
        <select className="border rounded-lg px-3">
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Food</option>
        </select>

        {/* Brand */}
        <select className="border rounded-lg px-3">
          <option>All Brands</option>
          <option>Apple</option>
          <option>Samsung</option>
          <option>Nike</option>
        </select>

        {/* Status */}
        <select className="border rounded-lg px-3">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

      </div>

      <div className="mt-4 flex justify-end gap-3">

        <Button variant="outline">
          Reset
        </Button>

        <Button>
          Search
        </Button>

      </div>

    </div>
  );
}