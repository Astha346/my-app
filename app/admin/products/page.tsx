"use client";

import { useState } from "react";

import ProductHeader from "@/components/admin/Products/ProductHeader";
import ProductStats from "@/components/admin/Products/ProductStats";
import ProductFilters from "@/components/admin/Products/ProductFilters";
import ProductTable from "@/components/admin/Products/ProductTable";
import AddProductDialog from "@/components/admin/Products/AddProductDialog";

export default function ProductsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">

      <ProductHeader
        onAddProduct={() => setOpen(true)}
      />

      <ProductStats />

      <ProductFilters />

      <ProductTable />

      <AddProductDialog
        open={open}
        onClose={() => setOpen(false)}
      />

    </div>
  );
}