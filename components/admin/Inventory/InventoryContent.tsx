
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Loader2,
  Package,
  RefreshCw,
  Search,
  Save,
  X,
} from "lucide-react";
import api from "@/lib/api";

interface Product {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  price: string | number;
  stock: number;
  image?: string;
  description?: string;
}

interface Pagination {
  totalPages?: number;
}

const LOW_STOCK_LIMIT = 5;
const PAGE_SIZE = 100;
const ITEMS_PER_PAGE = 10;

export default function InventoryContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [editingProductId, setEditingProductId] = useState("");
  const [stockValue, setStockValue] = useState("");
  const [savingStock, setSavingStock] = useState(false);

  const getProductId = (product: Product) =>
    product._id || product.id || "";

  const loadProducts = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      setSuccessMessage("");

      const firstResponse = await api.get("/products", {
        params: { page: 1, limit: PAGE_SIZE },
      });

      const firstData = firstResponse.data;

      // Support an API that returns a plain array.
      if (Array.isArray(firstData)) {
        setProducts(firstData);
        return;
      }

      const firstProducts: Product[] = Array.isArray(
        firstData?.products,
      )
        ? firstData.products
        : [];

      const pagination: Pagination | undefined =
        firstData?.pagination;

      const totalPages = Math.max(
        1,
        Number(pagination?.totalPages) || 1,
      );

      // Fetch every page returned by the backend.
      const remainingPages: Product[][] = [];

      for (let page = 2; page <= totalPages; page++) {
        const response = await api.get("/products", {
          params: { page, limit: PAGE_SIZE },
        });

        const data = response.data;

        const pageProducts: Product[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
            ? data.products
            : [];

        remainingPages.push(pageProducts);
      }

      setProducts([
        ...firstProducts,
        ...remainingPages.flat(),
      ]);
    } catch (err) {
      console.error("Failed to load inventory:", err);
      setError("Unable to load inventory. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((product) => product.category)
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name?.toLowerCase().includes(normalizedSearch) ||
        product.category?.toLowerCase().includes(normalizedSearch) ||
        getProductId(product)
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "all" ||
        product.category === selectedCategory;

      const stock = Number(product.stock) || 0;

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "low" &&
          stock > 0 &&
          stock <= LOW_STOCK_LIMIT) ||
        (stockFilter === "out" && stock === 0) ||
        (stockFilter === "available" &&
          stock > LOW_STOCK_LIMIT);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, selectedCategory, stockFilter]);

  // Pagination calculations use the filtered product list.
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
  );

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredProducts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [filteredProducts, currentPage]);

  const startItem =
    filteredProducts.length === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endItem = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredProducts.length,
  );

  // Return to page 1 when filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, stockFilter]);

  // Keep the current page valid after products change.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const totalUnits = products.reduce(
    (total, product) => total + (Number(product.stock) || 0),
    0,
  );

  const lowStockCount = products.filter((product) => {
    const stock = Number(product.stock) || 0;
    return stock > 0 && stock <= LOW_STOCK_LIMIT;
  }).length;

  const outOfStockCount = products.filter(
    (product) => (Number(product.stock) || 0) === 0,
  ).length;

  const startEditingStock = (product: Product) => {
    setEditingProductId(getProductId(product));
    setStockValue(String(Number(product.stock) || 0));
    setError("");
    setSuccessMessage("");
  };

  const cancelEditingStock = () => {
    setEditingProductId("");
    setStockValue("");
  };

  const saveStock = async (product: Product) => {
    const id = getProductId(product);
    const newStock = Number(stockValue);

    if (!id) {
      setError("Unable to identify this product.");
      return;
    }

    if (
      stockValue.trim() === "" ||
      !Number.isInteger(newStock) ||
      newStock < 0
    ) {
      setError("Stock must be a non-negative whole number.");
      return;
    }

    try {
      setSavingStock(true);
      setError("");
      setSuccessMessage("");

      const response = await api.patch(
        `/products/${id}/stock`,
        { stock: newStock },
      );

      const updatedProduct: Product | undefined =
        response.data?.product;

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          getProductId(item) === id
            ? {
                ...item,
                ...(updatedProduct || {}),
                stock: newStock,
              }
            : item,
        ),
      );

      setSuccessMessage("Stock updated successfully.");
      cancelEditingStock();
    } catch (err: any) {
      console.error("Failed to update stock:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to update stock. Please try again.",
      );
    } finally {
      setSavingStock(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return {
        label: "Out of stock",
        className: "bg-red-50 text-red-700 ring-red-200",
      };
    }

    if (stock <= LOW_STOCK_LIMIT) {
      return {
        label: "Low stock",
        className:
          "bg-amber-50 text-amber-700 ring-amber-200",
      };
    }

    return {
      label: "In stock",
      className:
        "bg-emerald-50 text-emerald-700 ring-emerald-200",
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin text-pink-600" />
          <span className="text-sm font-medium">
            Loading inventory...
          </span>
        </div>
      </div>
    );
  }

  // Create compact page buttons with ellipses for large page counts.
  const visiblePages: (number | string)[] = [];
  for (let page = 1; page <= totalPages; page++) {
    if (
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1
    ) {
      const previous = visiblePages[visiblePages.length - 1];

      if (
        typeof previous === "number" &&
        page - previous > 1
      ) {
        visiblePages.push("...");
      }

      visiblePages.push(page);
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventory Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor product quantities and manage stock levels.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadProducts(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              refreshing ? "animate-spin" : ""
            }`}
          />
          Refresh inventory
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">{error}</div>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
            className="rounded p-1 hover:bg-red-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total products
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {products.length}
              </p>
            </div>
            <div className="rounded-xl bg-pink-50 p-3">
              <Package className="h-6 w-6 text-pink-600" />
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Products in your inventory
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total stock units
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalUnits.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3">
              <Boxes className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Combined quantity of all products
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Low stock
              </p>
              <p className="mt-2 text-3xl font-bold text-amber-600">
                {lowStockCount}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Products with 1–{LOW_STOCK_LIMIT} units remaining
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Out of stock
              </p>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {outOfStockCount}
              </p>
            </div>
            <div className="rounded-xl bg-red-50 p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Products with zero units remaining
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by product name, category, or ID..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          >
            <option value="all">All stock statuses</option>
            <option value="available">In stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </select>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Inventory table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Inventory items
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Update quantities and monitor stock status.
            </p>
          </div>
          <Package className="h-5 w-5 text-slate-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Product</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Price</th>
                <th className="px-5 py-4 font-semibold">Stock quantity</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedProducts.map((product, index) => {
                const id = getProductId(product);
                const stock = Number(product.stock) || 0;
                const status = getStockStatus(stock);
                const isEditing = editingProductId === id;

                return (
                  <tr
                    key={id || `${product.name}-${index}`}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-11 w-11 rounded-lg border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100">
                            <Package className="h-5 w-5 text-slate-400" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="max-w-[230px] truncate font-semibold text-slate-900">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            ID: {id || "Unavailable"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {product.category || "Uncategorized"}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-800">
                      Rs {Number(product.price || 0).toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={stockValue}
                          onChange={(event) =>
                            setStockValue(event.target.value)
                          }
                          aria-label={`Stock quantity for ${product.name}`}
                          className="w-24 rounded-lg border border-pink-300 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-pink-100"
                        />
                      ) : (
                        <span className="font-semibold text-slate-900">
                          {stock}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => void saveStock(product)}
                              disabled={savingStock}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-pink-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-pink-700 disabled:opacity-60"
                            >
                              {savingStock ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Save className="h-3.5 w-3.5" />
                              )}
                              Save
                            </button>

                            <button
                              type="button"
                              onClick={cancelEditingStock}
                              disabled={savingStock}
                              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-60"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEditingStock(product)}
                            disabled={!id || savingStock}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Update stock
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center">
                      <Package className="mb-3 h-10 w-10 text-slate-300" />
                      <p className="font-medium text-slate-700">
                        No products found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {startItem}-{endItem}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {filteredProducts.length}
            </span>{" "}
            products
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {visiblePages.map((page, index) =>
              typeof page === "number" ? (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`min-w-10 rounded-lg border px-3 py-2 text-sm font-semibold ${
                    currentPage === page
                      ? "border-pink-600 bg-pink-600 text-white"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span
                  key={`ellipsis-${index}`}
                  className="px-1 text-slate-400"
                >
                  ...
                </span>
              ),
            )}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1),
                )
              }
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
