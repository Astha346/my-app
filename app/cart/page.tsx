
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

type CartItem = {
  _id: string;
  title: string;
  name?: string;
  price: number;
  quantity: number;
};

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      console.log("USER =", user);

      // Support both id and _id
      const id = user?.id || user?._id;

      if (!id) {
        console.log("User ID not found");
        setLoading(false);
        return;
      }

      setUserId(id);

      const fetchCart = async () => {
        try {
          const res = await api.get(`/cart/${id}`);

          console.log("CART =", res.data);

          setCart(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          console.log("Failed to fetch cart:", err);
          setCart([]);
        } finally {
          setLoading(false);
        }
      };

      fetchCart();
    } catch (error) {
      console.log("Invalid user data:", error);
      setLoading(false);
    }
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const goToCheckout = () => {
    if (!userId) {
      alert("User not found. Please login again.");
      return;
    }

    router.push(`/checkout/${userId}`);
  };

  if (loading) {
    return <p className="p-6">Loading cart...</p>;
  }

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
              key={item._id || index}
              className="flex justify-between mb-2"
            >
              <span>
                {item.name || item.title} × {item.quantity}
              </span>

              <span>
                Rs {item.price * item.quantity}
              </span>
            </div>
          ))}

          <h2 className="font-bold mt-4">
            Total: Rs {total}
          </h2>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => router.push("/")}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Add More Products
            </button>

            <button
              onClick={goToCheckout}
              disabled={!userId}
              className="bg-black text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
