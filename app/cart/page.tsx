"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const userId = "demo-user";

  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    api.get(`/cart/${userId}`).then(res => setCart(res.data));
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const clearCart = async () => {
    await api.delete(`/cart/clear/${userId}`);
    router.push("/order-success");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item._id} className="flex justify-between mb-2">
              <span>{item.name} × {item.quantity}</span>
              <span>${item.price}</span>
            </div>
          ))}

          <h2 className="font-bold mt-4">Total: ${total}</h2>

          <div className="flex gap-3 mt-5">
            <button
              onClick={() => router.push("/")}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Add More Products
            </button>

            <button
              onClick={clearCart}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}