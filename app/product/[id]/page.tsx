"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
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

    router.push("/cart");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <button onClick={() => router.push("/")}>
        ← Back
      </button>

      <img
        src={product.thumbnail}
        className="w-full h-80 object-cover rounded"
      />

      <h1 className="text-2xl font-bold mt-4">
        {product.title}
      </h1>

      <p className="mt-2 text-gray-600">
        {product.description}
      </p>

      <p className="mt-3 text-xl font-bold">
        ${product.price}
      </p>

      <button
        onClick={handleBuyNow}
        className="mt-5 bg-black text-white px-4 py-2 rounded"
      >
        Buy Now
      </button>

    </div>
  );
}