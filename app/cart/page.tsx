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
  const userId = "demo-user";

  // ✅ Typed state (important fix)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get(`/cart/${userId}`);
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
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const checkout = async () => {
    // ✅ Require payment selection
    if (!method) {
      alert("Please select a payment method");
      return;
    }

    try {
      const res = await api.post("/order/create-from-cart", {
        userId,
        paymentMethod: method,
      });

      const order = res.data;

      // ✅ COD (instant success)
      if (method === "cod") {
        await api.delete(`/cart/clear/${userId}`);
        router.push("/orders");
      }

      // ✅ eSewa / Khalti (redirect)
      else {
        if (!order?.paymentUrl) {
          alert("Payment URL not found");
          return;
        }
        window.location.href = order.paymentUrl;
      }

    } catch (err) {
      console.log("Checkout error:", err);
    }
  };

  if (loading) return <p className="p-6">Loading cart...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between mb-2">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>Rs {item.price}</span>
            </div>
          ))}

          <h2 className="font-bold mt-4">Total: Rs {total}</h2>

          {/* ✅ Payment options */}
          
     <div className="mt-5 space-y-3">

               {/* eSewa */}
        <label className="flex items-center justify-between border p-3 rounded cursor-pointer">
         <div className="flex items-center gap-3">
          <input
        type="radio"
        value="esewa"
        checked={method === "esewa"}
        onChange={(e) => setMethod(e.target.value)}
      />
      <img
        src="/images/esewa.png"
        alt="eSewa"
        className="h-6 w-auto"
      />
      <span>eSewa</span>
    </div>
  </label>

  {/* Khalti */}
  <label className="flex items-center justify-between border p-3 rounded cursor-pointer">
    <div className="flex items-center gap-3">
      <input
        type="radio"
        value="khalti"
        checked={method === "khalti"}
        onChange={(e) => setMethod(e.target.value)}
      />
      <img
        src="/images/khalti.png"
        alt="Khalti"
        className="h-6 w-auto"
      />
      <span>Khalti</span>
    </div>
  </label>

  {/* COD */}
  <label className="flex items-center justify-between border p-3 rounded cursor-pointer">
    <div className="flex items-center gap-3">
      <input
        type="radio"
        value="cod"
        checked={method === "cod"}
        onChange={(e) => setMethod(e.target.value)}
      />
      <span>Cash on Delivery</span>
          </div>
            </label>
              </div>

          {/* ✅ Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => router.push("/")}
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