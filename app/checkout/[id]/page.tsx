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

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params?.id);

  const product = sampleProducts.find((p) => p.id === id);

  const [ordered, setOrdered] = useState(false);

  const handleOrder = () => {
    if (!product) return;

    // create order
    const order = {
      id: Date.now(),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      time: new Date().toISOString(),
    };

    // get old orders
    const existingOrders = JSON.parse(
      localStorage.getItem("orders") || "[]"
    );

    // add new order
    existingOrders.push(order);

    // save back
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    // show success
    setOrdered(true);

    // optional redirect after 2 sec
    setTimeout(() => {
      router.push("/order-success");
    }, 1500);
  };

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">

      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">

        <h1 className="text-xl font-bold mb-4">Checkout</h1>

        <img
          src={product.image}
          className="h-40 w-full object-cover rounded-lg"
        />

        <h2 className="mt-3 font-semibold">{product.name}</h2>

        <p className="text-gray-600 mt-2">
          {product.description}
        </p>

        <p className="text-green-600 font-bold mt-2">
          {product.price}
        </p>

        <button
          onClick={handleOrder}
          className="bg-black text-white w-full mt-5 py-2 rounded-lg"
        >
          Place Order
        </button>

        {ordered && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            🎉 Order placed successfully!
          </div>
        )}

      </div>
    </div>
  );
}