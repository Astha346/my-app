"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  ShieldCheck,
} from "lucide-react";

type CartItem = {
  _id: string;
  title: string;
  name?: string;
  price: number;
  quantity: number;
  image?: string;
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

  const itemCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const goToCheckout = () => {
    if (!userId) {
      alert("User not found. Please login again.");
      return;
    }

    router.push(`/checkout/${userId}`);
  };

  const updateQuantity = (id: string, change: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item._id !== id) return item;

        const newQuantity = Math.max(1, item.quantity + change);

        return {
          ...item,
          quantity: newQuantity,
        };
      })
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200" />
            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-2xl bg-white shadow-sm"
                />
              ))}
            </div>

            <div className="h-72 animate-pulse rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-pink-600"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </button>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                  <ShoppingBag size={22} />
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Your Cart
                </h1>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {itemCount === 1
                  ? "1 item in your shopping bag"
                  : `${itemCount} items in your shopping bag`}
              </p>
            </div>

            {cart.length > 0 && (
              <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-gray-100">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </div>
            )}
          </div>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 text-pink-600">
              <ShoppingBag size={34} strokeWidth={1.7} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Looks like you haven't added anything to your cart yet.
              Explore our products and find something you love.
            </p>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 active:scale-[0.98]"
            >
              Start Shopping
              <ArrowRight size={17} />
            </button>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
            {/* Cart Items */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Cart Items
                </h2>

                <span className="text-sm text-gray-400">
                  {cart.length} {cart.length === 1 ? "product" : "products"}
                </span>
              </div>

              <div className="space-y-4">
                {cart.map((item) => {
                  const itemName = item.name || item.title;
                  const itemTotal = item.price * item.quantity;

                  return (
                    <div
                      key={item._id}
                      className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 sm:h-28 sm:w-28">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={itemName}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <ShoppingBag
                              size={30}
                              className="text-gray-300"
                            />
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900 sm:text-base">
                                {itemName}
                              </h3>

                              <p className="mt-1 text-sm text-gray-500">
                                Rs {item.price.toLocaleString()}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item._id)}
                              aria-label={`Remove ${itemName}`}
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-3">
                            {/* Quantity */}
                            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item._id, -1)
                                }
                                disabled={item.quantity <= 1}
                                className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-white hover:text-pink-600 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <Minus size={15} />
                              </button>

                              <span className="w-8 text-center text-sm font-semibold text-gray-900">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item._id, 1)
                                }
                                className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-white hover:text-pink-600"
                              >
                                <Plus size={15} />
                              </button>
                            </div>

                            {/* Item Total */}
                            <p className="text-base font-bold text-gray-900 sm:text-lg">
                              Rs {itemTotal.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Order Summary */}
            <aside className="lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-5 py-5">
                  <h2 className="text-lg font-bold text-gray-900">
                    Order Summary
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Review your order before checkout
                  </p>
                </div>

                <div className="space-y-4 px-5 py-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="font-medium text-gray-900">
                      Rs {total.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Delivery
                    </span>

                    <span className="font-semibold text-green-600">
                      Calculated at checkout
                    </span>
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Total
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Before delivery charges
                        </p>
                      </div>

                      <p className="text-2xl font-bold text-gray-900">
                        Rs {total.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={goToCheckout}
                    disabled={!userId}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Benefits */}
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm">
                        <Truck size={16} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-800">
                          Easy Delivery
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Delivery details at checkout
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm">
                        <ShieldCheck size={16} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-800">
                          Secure Checkout
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Your order information is protected
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm">
                        <Check size={16} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-800">
                          Easy Ordering
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Review everything before placing order
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}