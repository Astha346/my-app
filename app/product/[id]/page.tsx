"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const sampleProducts = [
  {
    id: 1,
    name: "Apple Watch",
    price: "$299",
    image: "/images/apple-watch.jpg",
    description:
      "A premium smartwatch designed to track your health, fitness, and daily activity with precision and style.",
  },
  {
    id: 2,
    name: "Shoes",
    price: "$79",
    image: "/images/shoes.jpg",
    description:
      "Comfort-focused footwear engineered for all-day support, durability, and modern casual style.",
  },
  {
    id: 3,
    name: "Shirt",
    price: "$49",
    image: "/images/shirt.jpg",
    description:
      "A soft-touch cotton shirt crafted for everyday comfort with a clean and minimal design.",
  },
  {
    id: 4,
    name: "Handbag",
    price: "$120",
    image: "/images/handbag.jpg",
    description:
      "An elegant handbag designed with premium materials, offering both style and practical storage.",
  },
  {
    id: 5,
    name: "Perfume",
    price: "$59",
    image: "/images/perfume.jpg",
    description:
      "A long-lasting fragrance crafted with refined notes to deliver a confident and lasting impression.",
  },
  {
    id: 6,
    name: "Sunglasses",
    price: "$89",
    image: "/images/sunglassess.jpg",
    description:
      "Stylish UV-protected eyewear designed to reduce glare while enhancing everyday fashion.",
  },
  {
    id: 7,
    name: "Laptop",
    price: "$899",
    image: "/images/laptop.jpg",
    description:
      "A high-performance laptop built for productivity, multitasking, and seamless computing experience.",
  },
  {
    id: 8,
    name: "Headphones",
    price: "$199",
    image: "/images/headphone.jpg",
    description:
      "Noise-cancelling headphones delivering deep bass, clear sound, and immersive audio quality.",
  },
  {
    id: 9,
    name: "Smartphone",
    price: "$699",
    image: "/images/smartphone.jpg",
    description:
      "A next-generation smartphone offering powerful performance, advanced camera, and smooth user experience.",
  },
];

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params?.id);
  const product = sampleProducts.find((p) => p.id === id);

  const [loading, setLoading] = useState(false);

  if (!product) {
    return (
      <div className="p-10 text-center text-red-500">
        Product not found

        <div className="mt-4">
          <button
            onClick={() => router.push("/")}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:3001/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      await res.json();

      alert("✅ Added to cart!");

      // 🔥 IMPORTANT: go to cart page
      router.push("/cart");

    } catch (err) {
      console.log(err);
      alert("❌ Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">

      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="mb-5 bg-gray-200 px-4 py-2 rounded-lg"
      >
        ← Back
      </button>

      <img src={product.image} className="h-60 rounded-lg" />

      <h1 className="text-2xl font-bold mt-3">{product.name}</h1>

      <p className="text-gray-600 mt-2">{product.description}</p>

      <p className="text-green-600 font-bold mt-2">
        {product.price}
      </p>

      {/* ADD TO CART */}
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className={`mt-4 px-4 py-2 rounded-lg text-white ${
          loading ? "bg-gray-400" : "bg-green-600"
        }`}
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>

    </div>
  );
}