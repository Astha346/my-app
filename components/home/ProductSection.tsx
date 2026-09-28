"use client";

import { ProductCard } from "@/types/types";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Heart } from "lucide-react";
import { useState } from "react";

export default function ProductSection({
  title,
  products,
}: {
  title: string;
  products: ProductCard[];
}) {
  const router = useRouter();

  // Wishlist UI state only for now
  const [wishlist, setWishlist] = useState<string[]>([]);

  const trackClick = async (id: string) => {
    try {
      await api.post("/analytics/click", {
        productId: id,
      });
    } catch (err) {
      console.log("Analytics error:", err);
    }
  };

  const handleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }

      return [...prev, productId];
    });
  };

  const handleBuyNow = async (p: ProductCard) => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const userId = user._id || user.id;

      if (!userId) {
        alert("Please login first");
        router.push("/login");
        return;
      }

      const price = Number(
        p.price.replace(/[^0-9.]/g, "")
      );

      await api.post("/cart/add", {
        userId: userId,
        productId: p.id,
        name: p.name,
        price,
        image: p.image,
        quantity: 1,
      });

      await trackClick(p.id);

      router.push("/cart");
    } catch (err) {
      console.log("Buy error:", err);
      alert("Failed to add to cart");
    }
  };

  return (
    <section className="bg-gray-50 px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
              {title}
            </h2>

            <div className="mt-2 h-1 w-10 rounded-full bg-black" />
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {products.map((p) => {
            const isWishlisted = wishlist.includes(p.id);

            return (
              <div
                key={p.id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Product Image */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={async () => {
                      await trackClick(p.id);
                      router.push(`/product/${p.id}`);
                    }}
                    className="block w-full"
                  >
                    <div className="relative h-44 overflow-hidden bg-gray-50 sm:h-48 md:h-52">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* View badge */}
                      <div className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-gray-700 shadow-sm backdrop-blur">
                        View
                      </div>
                    </div>
                  </button>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    aria-label={
                      isWishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlist(p.id);
                    }}
                    className={`absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur transition-all duration-200 ${
                      isWishlisted
                        ? "bg-pink-600 text-white"
                        : "bg-white/95 text-gray-600 hover:bg-white hover:text-pink-600"
                    }`}
                  >
                    <Heart
                      size={18}
                      strokeWidth={2}
                      fill={isWishlisted ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                {/* Product Details */}
                <div className="p-3.5 md:p-4">
                  <h3 className="min-h-10 line-clamp-2 text-sm font-semibold leading-5 text-gray-800 transition-colors group-hover:text-black">
                    {p.name}
                  </h3>

                  <div className="mt-2">
                    <p className="text-base font-bold text-gray-900 md:text-lg">
                      {p.price}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await trackClick(p.id);
                        router.push(`/product/${p.id}`);
                      }}
                      className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 sm:text-sm"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBuyNow(p)}
                      className="flex-1 rounded-xl bg-black py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98] sm:text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}