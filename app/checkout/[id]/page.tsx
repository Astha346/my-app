"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const router = useRouter();

  const [cart, setCart] = useState<any[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    console.log("CHECKOUT USER =", user);

    // support both id and _id
    const id = user._id || user.id;

    console.log("CHECKOUT ID =", id);

    if (!id) return;

    setUserId(id);

    const fetchCart = async () => {
      try {
        const res = await api.get(
          `/cart/${id}`
        );

        console.log("CART =", res.data);

        setCart(res.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCart();
  }, []);

  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity,
    0
  );

    const placeOrder = async () => {
  try {
    console.log("userId =", userId);

    const res = await api.post(
      "/orders/create-from-cart",
      {
        userId,
      }
    );

    console.log(
      "ORDER CREATED =",
      res.data
    );

    await api.delete(
      `/cart/clear/${userId}`
    );

    router.push(
      "/order-success"
    );
  } catch (error) {
    console.log(error);
  }
};

      

      

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold">
        Checkout
      </h1>

      <div className="mt-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex justify-between mb-2"
          >
            <span>
              {item.name} ×{" "}
              {item.quantity}
            </span>

            <span>
              $
              {(
                item.price *
                item.quantity
              ).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <h2 className="mt-4 font-bold">
        Total: $
        {total.toFixed(2)}
      </h2>

      <button
        onClick={placeOrder}
        className="bg-black text-white w-full mt-4 py-2 rounded"
      >
        Place Order
      </button>
    </div>
  );
}