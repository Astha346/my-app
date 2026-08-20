
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

export default function ProductsContent() {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [viewOpen, setViewOpen] = useState(false);

  const [deleteProduct, setDeleteProduct] =
    useState<Product | null>(null);

  // Products
  const [products, setProducts] = useState<Product[]>([]);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [status, setStatus] = useState("all");

  async function handleDelete() {
    if (!deleteProduct) return;

    try {
      await api.delete(`/products/${deleteProduct._id}`);

      // Remove deleted product from frontend state
      setProducts((prev) =>
      prev.filter(
        (product) => product._id !== deleteProduct._id
      )
    );

      setDeleteProduct(null);

    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  }

  function handleReset() {
    setSearch("");
    setCategory("all");
    setBrand("all");
    setStatus("all");
  }

  // Brand detection from product name
  function matchesBrand(product: Product) {
    if (brand === "all") return true;

    return product.name
      .toLowerCase()
      .includes(brand.toLowerCase());
  }

  // Filter products
  const filteredProducts = products.filter((product) => {

    const searchMatch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch =
      category === "all" ||
      product.category === category;

    const brandMatch = matchesBrand(product);

    const statusMatch = status === "all";

    return (
      searchMatch &&
      categoryMatch &&
      brandMatch &&
      statusMatch
    );
  });

  return (
    <div className="space-y-6">

      <ProductHeader
        onAddProduct={() => setOpen(true)}
      />

      <ProductStats />

      <ProductFilters
        search={search}
        category={category}
        brand={brand}
        status={status}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onBrandChange={setBrand}
        onStatusChange={setStatus}
        onReset={handleReset}
      />

      <ProductTable
        refresh={refresh}
        products={filteredProducts}
        onProductsLoaded={setProducts}
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
