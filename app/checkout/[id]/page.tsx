"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Checkout() {
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

  const placeOrder = async () => {
    await api.delete(`/cart/clear/${userId}`);
    router.push("/order-success");
  };

  return (
    <div className="p-6 max-w-md mx-auto">

      <h1 className="text-xl font-bold">Checkout</h1>

      <h2 className="mt-3 font-bold">
        Total: ${total}
      </h2>

      <button
        onClick={placeOrder}
        className="bg-black text-white w-full mt-4 py-2"
      >
        Place Order
      </button>

    </div>
  );
}