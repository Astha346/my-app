"use client";

import { useState } from "react";
import api from "@/lib/api";

import ProductHeader from "@/components/admin/Products/ProductHeader";
import ProductStats from "@/components/admin/Products/ProductStats";
import ProductFilters from "@/components/admin/Products/ProductFilters";
import ProductTable from "@/components/admin/Products/ProductTable";
import AddProductDialog from "@/components/admin/Products/AddProductDialog";
import EditProductDialog from "@/components/admin/Products/EditProductDialog";
import ViewProductDialog from "@/components/admin/Products/ViewProductDialog";
import DeleteProductModal from "@/components/admin/Products/DeleteProductModal";

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [viewOpen, setViewOpen] = useState(false);

  const [deleteProduct, setDeleteProduct] = useState<any>(null);

  async function handleDelete() {
    if (!deleteProduct) return;

    try {
      await api.delete(`/products/${deleteProduct._id}`);

      setDeleteProduct(null);

      setRefresh((prev) => !prev);
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  }

  return (
    <div className="space-y-6">
      <ProductHeader
        onAddProduct={() => setOpen(true)}
      />

      <ProductStats />

      <ProductFilters />

      <ProductTable
        refresh={refresh}
        onEdit={(product) => {
          setSelectedProduct(product);
          setEditOpen(true);
        }}
        onView={(product) => {
          setSelectedProduct(product);
          setViewOpen(true);
        }}
        onDelete={(product) => {
          setDeleteProduct(product);
        }}
      />

      <AddProductDialog
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => setRefresh((prev) => !prev)}
      />

      <EditProductDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        product={selectedProduct}
        onSuccess={() => setRefresh((prev) => !prev)}
      />

      <ViewProductDialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        product={selectedProduct}
      />

      {deleteProduct && (
        <DeleteProductModal
          product={deleteProduct}
          setDeleteProduct={setDeleteProduct}
          deleteHandler={handleDelete}
        />
      )}
    </div>
  );
}