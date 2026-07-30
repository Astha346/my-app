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

  const trackClick = async (id: string) => {
    try {
      await api.post("/analytics/click", {
        productId: id,
      });
    } catch (err) {
      console.log("Analytics error:", err);
    }
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

    const price = Number(p.price.replace(/[^0-9.]/g, ""));

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
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden"
          >
            <img
              src={p.image}
              className="h-40 w-full object-cover"
              alt={p.name}
            />

            <div className="p-3 space-y-2">
              <h3 className="font-semibold text-sm line-clamp-2">
                {p.name}
              </h3>

              <p className="text-green-600 font-bold text-sm">
                {p.price}
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={async () => {
                    await trackClick(p.id);
                    router.push(`/product/${p.id}`);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded text-sm"
                >
                  View
                </button>

                <button
                  onClick={() => handleBuyNow(p)}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 py-2 rounded text-sm font-medium"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}