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

interface Product {
  _id: string;
  name: string;
  category: string;
  price: string;
  image?: string;
  description?: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ProductsContent() {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [viewOpen, setViewOpen] = useState(false);

  const [deleteProduct, setDeleteProduct] =
    useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>([]);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [status, setStatus] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [pagination, setPagination] =
    useState<PaginationData>({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    });

  // -----------------------------
  // DELETE PRODUCT
  // -----------------------------
  async function handleDelete() {
    if (!deleteProduct) return;

    try {
      await api.delete(
        `/products/${deleteProduct._id}`
      );

      setDeleteProduct(null);

      // Refresh products
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      alert("Failed to delete product.");
    }
  }

  // -----------------------------
  // RESET FILTERS
  // -----------------------------
  function handleReset() {
    setSearch("");
    setCategory("all");
    setBrand("all");
    setStatus("all");

    // Go back to first page
    setPage(1);
  }

  // -----------------------------
  // PRODUCTS LOADED FROM API
  // -----------------------------
  function handleProductsLoaded(
    data:
      | Product[]
      | {
          data?: Product[];
          products?: Product[];
          pagination?: PaginationData;
        }
  ) {
    // If backend returns array directly
    if (Array.isArray(data)) {
      setProducts(data);
      return;
    }

    // Backend currently returns:
    // {
    //   products: [],
    //   pagination: {}
    // }

    if (Array.isArray(data.products)) {
      setProducts(data.products);
    } else if (Array.isArray(data.data)) {
      setProducts(data.data);
    } else {
      setProducts([]);
    }

    if (data.pagination) {
      setPagination(data.pagination);
    }
  }

  // -----------------------------
  // CHANGE PAGE
  // -----------------------------
  function handlePageChange(newPage: number) {
    if (newPage < 1) return;

    if (
      pagination.totalPages > 0 &&
      newPage > pagination.totalPages
    ) {
      return;
    }

    setPage(newPage);
  }

  // -----------------------------
  // CHANGE ITEMS PER PAGE
  // -----------------------------
  function handleItemsPerPageChange(
    value: number
  ) {
    setLimit(value);

    // Always go back to page 1
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <ProductHeader
        onAddProduct={() => setOpen(true)}
      />

      {/* STATS */}
      <ProductStats />

      {/* FILTERS */}
      <ProductFilters
        search={search}
        category={category}
        brand={brand}
        status={status}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onCategoryChange={(value) => {
          setCategory(value);
          setPage(1);
        }}
        onBrandChange={(value) => {
          setBrand(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onReset={handleReset}
      />

      {/* PRODUCT TABLE */}
      <ProductTable
        refresh={refresh}
        page={page}
        limit={limit}
        search={search}
        category={category}
        products={products}
        onProductsLoaded={handleProductsLoaded}
        onPageChange={handlePageChange}
        onItemsPerPageChange={
          handleItemsPerPageChange
        }
        pagination={pagination}
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

      {/* ADD PRODUCT */}
      <AddProductDialog
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setPage(1);
          setRefresh((prev) => !prev);
        }}
      />

      {/* EDIT PRODUCT */}
      <EditProductDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        product={selectedProduct}
        onSuccess={() => {
          setRefresh((prev) => !prev);
        }}
      />

      {/* VIEW PRODUCT */}
      <ViewProductDialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        product={selectedProduct}
      />

      {/* DELETE PRODUCT */}
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