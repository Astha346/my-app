"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

type CartItem = {
  _id: string;
  title: string;
  price: number;
  quantity: number;
};

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    console.log("USER =", user);

    if (!user?.id) {
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const fetchCart = async () => {
      try {
        const res = await api.get(
          `/cart/${user.id}`
        );

        console.log("CART =", res.data);

        setCart(res.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const checkout = async () => {
    if (!method) {
      alert("Please select a payment method");
      return;
    }

    try {
      const res = await api.post(
        "/orders/create-from-cart",
        {
          userId,
          paymentMethod: method,
        }
      );
       console.log("ORDER =", res.data);
       
      const order = res.data;

      if (method === "cod") {
        await api.delete(
          `/cart/clear/${userId}`
        );

        router.push("/order-success");
      } else {
        if (!order?.paymentUrl) {
          alert("Payment URL not found");
          return;
        }

        window.location.href =
          order.paymentUrl;
      }
    } catch (err) {
      console.log(
        "Checkout error:",
        err
      );
    }
  };

  if (loading)
    return (
      <p className="p-6">
        Loading cart...
      </p>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex justify-between mb-2"
            >
              <span>
                {item.title} ×{" "}
                {item.quantity}
              </span>

              <span>
                Rs {item.price}
              </span>
            </div>
          ))}

          <h2 className="font-bold mt-4">
            Total: Rs {total}
          </h2>

          <div className="mt-5 space-y-3">

            <label className="flex items-center gap-3 border p-3 rounded cursor-pointer">
              <input
                type="radio"
                value="esewa"
                checked={
                  method === "esewa"
                }
                onChange={(e) =>
                  setMethod(
                    e.target.value
                  )
                }
              />

              <img
                src="/images/esewa.png"
                className="h-6"
              />

              <span>eSewa</span>
            </label>

            <label className="flex items-center gap-3 border p-3 rounded cursor-pointer">
              <input
                type="radio"
                value="khalti"
                checked={
                  method === "khalti"
                }
                onChange={(e) =>
                  setMethod(
                    e.target.value
                  )
                }
              />

              <img
                src="/images/khalti.png"
                className="h-6"
              />

              <span>Khalti</span>
            </label>

            <label className="flex items-center gap-3 border p-3 rounded cursor-pointer">
              <input
                type="radio"
                value="cod"
                checked={
                  method === "cod"
                }
                onChange={(e) =>
                  setMethod(
                    e.target.value
                  )
                }
              />

              <span>
                Cash on Delivery
              </span>
            </label>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() =>
                router.push("/")
              }
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Add More Products
            </button>

            <button
              onClick={checkout}
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