"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  CartItem,
} from "@/lib/cart";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  // load cart
  useEffect(() => {
    setCart(getCart());
  }, []);

  const refresh = () => {
    setCart(getCart());
  };

  // total price helper
  const getTotal = () => {
    return cart.reduce((sum, item) => {
      const price = Number(item.price.replace("$", ""));
      return sum + price * item.quantity;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Cart</h1>

          <button
            onClick={() => router.push("/")}
            className="text-sm bg-gray-200 px-3 py-1 rounded"
          >
            Continue Shopping
          </button>
        </div>

        {/* EMPTY CART */}
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          <>
            {/* CART ITEMS */}
            <div className="space-y-4">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border p-3 rounded-lg"
                >

                  <img
                    src={item.image}
                    className="h-20 w-20 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-green-600">{item.price}</p>

                    {/* quantity controls */}
                    <div className="flex items-center gap-2 mt-2">

                      <button
                        onClick={() => {
                          updateQuantity(item.id, item.quantity - 1);
                          refresh();
                        }}
                        className="px-3 bg-gray-200 rounded"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => {
                          updateQuantity(item.id, item.quantity + 1);
                          refresh();
                        }}
                        className="px-3 bg-gray-200 rounded"
                      >
                        +
                      </button>

                    </div>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => {
                      removeFromCart(item.id);
                      refresh();
                    }}
                    className="text-red-500"
                  >
                    Remove
                  </button>

                </div>
              ))}

            </div>

            {/* FOOTER */}
            <div className="mt-6 border-t pt-4 flex justify-between items-center">

              <button
                onClick={() => {
                  clearCart();
                  setCart([]);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Clear Cart
              </button>

              <div className="text-right">
                <p className="text-gray-600">Total</p>
                <h2 className="text-xl font-bold">
                  ${getTotal()}
                </h2>
              </div>

            </div>

          </>
        )}
      </div>
    </div>
  );
}