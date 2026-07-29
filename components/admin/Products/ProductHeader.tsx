"use client";

import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductHeaderProps {
  onAddProduct: () => void;
}

export default function ProductHeader({
  onAddProduct,
}: ProductHeaderProps) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
          <Package className="h-7 w-7 text-blue-600" />
        </div>

        <div>
          <h1 className="text-3xl font-bold">
            Product Management
          </h1>

          <p className="text-muted-foreground">
            Manage your products, inventory and pricing.
          </p>
        </div>

      </div>

      <Button
        className="gap-2"
        onClick={onAddProduct}
      >
        <Plus size={18} />
        Add Product
      </Button>

    </div>
  );
}