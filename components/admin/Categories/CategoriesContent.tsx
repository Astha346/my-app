"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";

import type { Category } from "@/types/category";

import CategoryHeader from "./CategoryHeader";
import CategoryTable from "./CategoryTable";
import EditCategoryDialog from "./EditCategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import AddCategoryDialog from "./AddCategoryDialog";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: string | number;
  image?: string;
  description?: string;
  stock: string | number;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [pagination, setPagination] =
    useState<PaginationData>({
      page: 1,
      limit: 5,
      total: 0,
      totalPages: 1,
    });

  const [addOpen, setAddOpen] = useState(false);

  const [editCategory, setEditCategory] =
    useState<Category | null>(null);

  const [deleteCategory, setDeleteCategory] =
    useState<Category | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // ==========================================
  // NORMALIZE
  // ==========================================

  const normalize = (value: unknown) => {
    return String(value ?? "")
      .trim()
      .toLowerCase();
  };

  // ==========================================
  // FETCH ALL PRODUCTS
  // ==========================================

  const fetchAllProducts = async (): Promise<Product[]> => {
    try {
      const firstResponse = await api.get(
        "/products?page=1&limit=100"
      );

      const firstData = firstResponse.data;

      const firstProducts: Product[] =
        Array.isArray(firstData)
          ? firstData
          : Array.isArray(firstData?.products)
            ? firstData.products
            : [];

      // If backend returns direct array
      if (Array.isArray(firstData)) {
        return firstProducts;
      }

      const totalPages =
        Number(
          firstData?.pagination?.totalPages
        ) || 1;

      if (totalPages <= 1) {
        return firstProducts;
      }

      let allProducts: Product[] = [
        ...firstProducts,
      ];

      // Fetch remaining product pages
      for (
        let productPage = 2;
        productPage <= totalPages;
        productPage++
      ) {
        const response = await api.get(
          `/products?page=${productPage}&limit=100`
        );

        const data = response.data;

        const pageProducts: Product[] =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.products)
              ? data.products
              : [];

        allProducts = [
          ...allProducts,
          ...pageProducts,
        ];
      }

      return allProducts;
    } catch (error) {
      console.error(
        "Failed to fetch products:",
        error
      );

      return [];
    }
  };

  // ==========================================
  // FETCH CATEGORIES + PRODUCTS
  // ==========================================

  const fetchData = async () => {
    try {
      setLoading(true);

      console.log(
        "================================"
      );

      console.log(
        "FETCHING CATEGORY PAGE:",
        page
      );

      console.log(
        "CATEGORY LIMIT:",
        limit
      );

      console.log(
        "================================"
      );

      // ========================================
      // FETCH CURRENT CATEGORY PAGE
      // ========================================

      const categoriesResponse =
        await api.get(
          `/categories?page=${page}&limit=${limit}`
        );

      // IMPORTANT:
      // Show the complete response in console
      console.log(
        "CATEGORY PAGE:",
        page
      );

      console.log(
        "CATEGORY RESPONSE:",
        JSON.stringify(
          categoriesResponse.data,
          null,
          2
        )
      );

      const categoryResponseData =
        categoriesResponse.data;

      // ========================================
      // GET CATEGORIES
      // ========================================

      const categoryData: Category[] =
        Array.isArray(categoryResponseData)
          ? categoryResponseData
          : Array.isArray(
                categoryResponseData?.categories
              )
            ? categoryResponseData.categories
            : [];

      // Show only category names
      console.log(
        "CATEGORY NAMES:",
        categoryData.map(
          (category) => category.name
        )
      );

      console.log(
        "CURRENT PAGE CATEGORY COUNT:",
        categoryData.length
      );

      // ========================================
      // PAGINATION
      // ========================================

      if (
        categoryResponseData?.pagination
      ) {
        const backendPagination =
          categoryResponseData.pagination;

        const newPagination = {
          page:
            Number(
              backendPagination.page
            ) || page,

          limit:
            Number(
              backendPagination.limit
            ) || limit,

          total:
            Number(
              backendPagination.total
            ) || 0,

          totalPages:
            Number(
              backendPagination.totalPages
            ) || 1,
        };

        console.log(
          "CATEGORY PAGINATION:",
          JSON.stringify(
            newPagination,
            null,
            2
          )
        );

        setPagination(
          newPagination
        );
      } else {
        // Old backend fallback
        setPagination({
          page: 1,
          limit:
            categoryData.length ||
            limit,
          total: categoryData.length,
          totalPages: 1,
        });
      }

      // ========================================
      // FETCH ALL PRODUCTS
      // ========================================

      const productData =
        await fetchAllProducts();

      console.log(
        "ALL PRODUCTS:",
        productData
      );

      console.log(
        "TOTAL PRODUCTS:",
        productData.length
      );

      // ========================================
      // SET STATE
      // ========================================

      setCategories(categoryData);
      setProducts(productData);

      console.log(
        "================================"
      );
    } catch (error) {
      console.error(
        "Failed to fetch categories:",
        error
      );

      setCategories([]);
      setProducts([]);

      setPagination({
        page: 1,
        limit,
        total: 0,
        totalPages: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH WHEN PAGE / LIMIT CHANGES
  // ==========================================

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  // ==========================================
  // PAGE CHANGE
  // ==========================================

  const handlePageChange = (
    newPage: number
  ) => {
    console.log(
      "CHANGING CATEGORY PAGE TO:",
      newPage
    );

    if (newPage < 1) {
      return;
    }

    if (
      newPage > pagination.totalPages
    ) {
      return;
    }

    setPage(newPage);
  };

  // ==========================================
  // ITEMS PER PAGE
  // ==========================================

  const handleItemsPerPageChange = (
    value: number
  ) => {
    console.log(
      "CHANGING CATEGORY LIMIT TO:",
      value
    );

    setLimit(value);
    setPage(1);
  };

  // ==========================================
  // ADD CATEGORY
  // ==========================================

  const handleAddCategory = () => {
    setAddOpen(true);
  };

  // ==========================================
  // EDIT CATEGORY
  // ==========================================

  const handleEdit = (
    category: Category
  ) => {
    setEditCategory(category);
    setEditOpen(true);
  };

  // ==========================================
  // DELETE CATEGORY
  // ==========================================

  const handleDelete = (
    category: Category
  ) => {
    setDeleteCategory(category);
    setDeleteOpen(true);
  };

  // ==========================================
  // SUCCESS
  // ==========================================

  const handleSuccess = () => {
    fetchData();
  };

  // ==========================================
  // CATEGORIES WITH PRODUCTS
  // ==========================================

  const categoriesWithProducts =
    categories.filter((category) =>
      products.some(
        (product) =>
          normalize(
            product.category
          ) ===
          normalize(category.name)
      )
    ).length;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-6">

      {/* ========================================
          HEADER
      ======================================== */}

      <CategoryHeader
        onAddCategory={
          handleAddCategory
        }
      />

      {/* ========================================
          STATISTICS
      ======================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* TOTAL CATEGORIES */}

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Total Categories
          </p>

          <p className="mt-2 text-2xl font-bold">
            {pagination.total}
          </p>
        </div>

        {/* TOTAL PRODUCTS */}

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Total Products
          </p>

          <p className="mt-2 text-2xl font-bold">
            {products.length}
          </p>
        </div>

        {/* CATEGORIES WITH PRODUCTS */}

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Categories With Products
          </p>

          <p className="mt-2 text-2xl font-bold">
            {categoriesWithProducts}
          </p>
        </div>

      </div>

      {/* ========================================
          PAGINATION INFORMATION
      ======================================== */}

      <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm">
        <div className="flex flex-wrap gap-x-6 gap-y-1">

          <span>
            Categories:{" "}
            <strong>
              {pagination.total}
            </strong>
          </span>

          <span>
            Products:{" "}
            <strong>
              {products.length}
            </strong>
          </span>

          <span>
            Current Page:{" "}
            <strong>
              {pagination.page}
            </strong>
          </span>

          <span>
            Total Pages:{" "}
            <strong>
              {pagination.totalPages}
            </strong>
          </span>

        </div>
      </div>

      {/* ========================================
          CATEGORY TABLE
      ======================================== */}

      {loading ? (
        <div className="flex min-h-75 items-center justify-center rounded-xl border bg-card">

          <div className="text-center">

            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

            <p className="text-sm text-muted-foreground">
              Loading categories...
            </p>

          </div>

        </div>
      ) : (
        <CategoryTable
          categories={categories}
          products={products}
          pagination={pagination}
          onPageChange={
            handlePageChange
          }
          onItemsPerPageChange={
            handleItemsPerPageChange
          }
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* ========================================
          ADD CATEGORY
      ======================================== */}

      <AddCategoryDialog
        open={addOpen}
        onOpenChange={
          setAddOpen
        }
        categories={categories}
        onSuccess={
          handleSuccess
        }
      />

      {/* ========================================
          EDIT CATEGORY
      ======================================== */}

      <EditCategoryDialog
        open={editOpen}
        onOpenChange={
          setEditOpen
        }
        category={editCategory}
        categories={categories}
        onSuccess={
          handleSuccess
        }
      />

      {/* ========================================
          DELETE CATEGORY
      ======================================== */}

      <DeleteCategoryDialog
        open={deleteOpen}
        onOpenChange={
          setDeleteOpen
        }
        category={deleteCategory}
        onSuccess={
          handleSuccess
        }
      />

    </div>
  );
}