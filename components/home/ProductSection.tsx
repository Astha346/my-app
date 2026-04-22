"use client";

import { ProductCard } from "@/types/types";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function ProductSection({
  title,
  products,
}: {
  title: string;
  products: ProductCard[];
}) {
  const router = useRouter();

  // 🛒 BUY NOW (add to cart + go cart page)
  const handleBuyNow = async (p: ProductCard) => {
    try {
      await api.post("/cart/add", {
        userId: "demo-user",
        productId: p.id,
        name: p.name,
        price: typeof p.price === "string"
          ? Number(p.price.replace(/[^0-9.]/g, ""))
          : p.price,
        image: p.image,
        quantity: 1,
      });

      router.push("/cart");
    } catch (err) {
      console.log("Buy error:", err);
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="p-6">

      {/* TITLE */}
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden"
          >

            {/* IMAGE */}
            <img
              src={p.image}
              className="h-40 w-full object-cover"
              alt={p.name}
            />

            {/* CONTENT */}
            <div className="p-3 space-y-2">

              {/* NAME */}
              <h3 className="font-semibold text-sm line-clamp-2">
                {p.name}
              </h3>

              {/* PRICE */}
              <p className="text-green-600 font-bold text-sm">
                {p.price}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-3">

                {/* 👁 VIEW */}
                <button
                  onClick={() => router.push(`/product/${p.id}`)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded text-sm"
                >
                  View
                </button>

                {/* 🛒 BUY NOW */}
                <button
                  onClick={() => handleBuyNow(p)}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 py-2 rounded text-sm font-medium"
                >
                  Buy Now
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}