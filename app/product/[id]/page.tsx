"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);

  // 📊 ANALYTICS FUNCTION (NEW)
  const trackView = async (id: number) => {
    try {
      await api.post("/analytics/click", {
        productId: id,
      });
    } catch (err) {
      console.log("Analytics error:", err);
    }
  };

  useEffect(() => {
    if (!id) return;

    // fetch product (your existing logic)
    fetch(`https://dummyjson.com/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));

    // 📊 track product view (safe, non-blocking)
    trackView(Number(id));
  }, [id]);

  const handleBuyNow = async () => {
    if (!product) return;

    await api.post("/cart/add", {
      userId: "demo-user",
      productId: product.id,
      name: product.title,
      price: product.price,
      image: product.thumbnail,
      quantity: 1,
    });

    // 📊 optional analytics for buy
    trackView(product.id);

    router.push("/cart");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* BACK BUTTON */}
      <button onClick={() => router.push("/")}>
        ← Back
      </button>

      {/* IMAGE */}
      <img
        src={product.thumbnail}
        className="w-full h-80 object-cover rounded"
      />

      {/* TITLE */}
      <h1 className="text-2xl font-bold mt-4">
        {product.title}
      </h1>

      {/* DESCRIPTION */}
      <p className="mt-2 text-gray-600">
        {product.description}
      </p>

      {/* PRICE */}
      <p className="mt-3 text-xl font-bold">
        ${product.price}
      </p>

      {/* BUY BUTTON */}
      <button
        onClick={handleBuyNow}
        className="mt-5 bg-black text-white px-4 py-2 rounded"
      >
        Buy Now
      </button>

    </div>
  );
}