
"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

import { ProductCard } from "@/types/types";
import {
  getWishlist,
  removeFromWishlist,
} from "@/lib/wishlist";
import { addToCart } from "@/lib/cart";
import api from "@/lib/api";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<ProductCard[]>([]);
  const [deleteProduct, setDeleteProduct] =
    useState<ProductCard | null>(null);

  useEffect(() => {
    const loadWishlist = () => {
      const savedWishlist = getWishlist();
      setWishlist(savedWishlist);
    };

    loadWishlist();

    window.addEventListener(
      "wishlistUpdated",
      loadWishlist
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        loadWishlist
      );
    };
  }, []);

  const handleRemove = (productId: string) => {
    const updatedWishlist =
      removeFromWishlist(productId);

    setWishlist(updatedWishlist);
  };

  const handleAddToCart = async (
    product: ProductCard
  ) => {
    try {
      const userString =
        localStorage.getItem("user");

      if (!userString) {
        alert("Please login first.");
        return;
      }

      const user = JSON.parse(userString);

      await api.post("/cart/add", {
        userId: user.id,
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        quantity: 1,
      });

      addToCart(product);

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      window.location.href = "/cart";
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      alert("Failed to add product to cart.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="hover:text-pink-600"
            >
              Home
            </Link>

            <span>/</span>

            <span className="font-medium text-gray-800">
              Wishlist
            </span>
          </div>

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
              <Heart
                size={25}
                fill="currentColor"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                My Wishlist
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {wishlist.length === 0
                  ? "Save products you love for later."
                  : `${wishlist.length} ${
                      wishlist.length === 1
                        ? "item"
                        : "items"
                    } saved`}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* EMPTY */}
        {wishlist.length === 0 ? (
          <div className="flex min-h-[450px] flex-col items-center justify-center rounded-3xl border bg-white px-6 text-center shadow-sm">

            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-pink-50">
              <Heart
                size={42}
                className="text-pink-400"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              You haven't saved any products yet.
              Browse our products and tap the heart
              icon to save your favorites.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>

          </div>
        ) : (
          <>
            {/* BACK */}
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pink-600"
            >
              <ArrowLeft size={17} />
              Continue Shopping
            </Link>

            {/* PRODUCTS */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

              {wishlist.map((product) => (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  {/* IMAGE */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    {/* HEART */}
                    <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-pink-600 text-white shadow">
                      <Heart
                        size={15}
                        fill="currentColor"
                      />
                    </div>

                    {/* DELETE */}
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteProduct(product)
                      }
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                  {/* DETAILS */}
                  <div className="p-4">

                    <h2 className="line-clamp-2 min-h-[42px] text-sm font-semibold text-gray-800">
                      {product.name}
                    </h2>

                    <p className="mt-2 text-lg font-bold text-pink-600">
                      Rs. {product.price}
                    </p>

                    {/* ADD TO CART */}
                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart(product)
                      }
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
                    >
                      <ShoppingCart size={17} />
                      Add to Cart
                    </button>

                    {/* REMOVE */}
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteProduct(product)
                      }
                      className="mt-2 w-full py-1.5 text-xs font-medium text-gray-400 hover:text-red-500"
                    >
                      Remove from Wishlist
                    </button>

                  </div>
                </div>
              ))}

            </div>
          </>
        )}

      </section>

      {/* DELETE CONFIRMATION POPUP */}
      {deleteProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">

            {/* POPUP HEADER */}
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
                <Trash2 size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Remove from Wishlist?
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Are you sure you want to remove this product?
                </p>
              </div>

            </div>

            {/* PRODUCT NAME */}
            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
              <p className="truncate text-sm font-semibold text-gray-800">
                {deleteProduct.name}
              </p>
            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setDeleteProduct(null)
                }
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  handleRemove(deleteProduct.id);
                  setDeleteProduct(null);
                }}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Remove
              </button>

            </div>

          </div>
        </div>
      )}

    </main>
  );
}

