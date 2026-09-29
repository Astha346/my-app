"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import api from "@/lib/api";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Wallet,
} from "lucide-react";

const MapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-100 w-full items-center justify-center rounded-2xl bg-gray-100">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-pink-600" />
        <p className="text-sm text-gray-500">Loading map...</p>
      </div>
    </div>
  ),
});

const DEFAULT_LOCATION: [number, number] = [27.7172, 85.324];

type CartItem = {
  _id: string;
  productId?: string;
  name?: string;
  title?: string;
  price: number;
  quantity: number;
  image?: string;
};

type PaymentMethod = "cod" | "esewa" | "khalti";

export default function Checkout() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [position, setPosition] =
    useState<[number, number] | null>(DEFAULT_LOCATION);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cod");

  const [loading, setLoading] = useState(false);

  // =====================================================
  // GET USER + CART
  // =====================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      console.log("No user found");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      console.log("CHECKOUT USER =", user);

      const id = user?._id || user?.id;

      console.log("CHECKOUT USER ID =", id);

      if (!id) {
        console.log("User ID not found");
        return;
      }

      setUserId(id);
      fetchCart(id);
    } catch (error) {
      console.error("Failed to read user:", error);
    }
  }, []);

  // =====================================================
  // FETCH CART
  // =====================================================

  const fetchCart = async (id: string) => {
    try {
      const response = await api.get(`/cart/${id}`);

      console.log("CART RESPONSE =", response.data);

      if (Array.isArray(response.data)) {
        setCart(response.data);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("FAILED TO FETCH CART =", error);
      setCart([]);
    }
  };

  // =====================================================
  // TOTAL
  // =====================================================

  const total = cart.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.quantity);
  }, 0);

  const itemCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  // =====================================================
  // CREATE ESEWA PAYMENT
  // =====================================================

  const payWithEsewa = async () => {
    try {
      const transactionUuid = `TXN-${Date.now()}`;

      console.log("ESEWA AMOUNT =", total);
      console.log(
        "ESEWA TRANSACTION UUID =",
        transactionUuid
      );

      const response = await api.post("/payment/esewa", {
        amount: total,
        transactionUuid,
      });

      console.log("ESEWA RESPONSE =", response.data);

      const paymentUrl = response.data?.paymentUrl;
      const fields = response.data?.fields;

      if (!paymentUrl || !fields) {
        throw new Error(
          "Invalid eSewa payment response"
        );
      }

      const form = document.createElement("form");

      form.method = "POST";
      form.action = paymentUrl;

      Object.entries(fields).forEach(
        ([key, value]) => {
          const input = document.createElement("input");

          input.type = "hidden";
          input.name = key;
          input.value = String(value);

          form.appendChild(input);
        }
      );

      document.body.appendChild(form);

      form.submit();
    } catch (error: any) {
      console.error(
        "ESEWA PAYMENT ERROR =",
        error
      );

      console.error(
        "ESEWA ERROR RESPONSE =",
        error?.response?.data
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to start eSewa payment."
      );

      setLoading(false);
    }
  };

  // =====================================================
  // CREATE COD ORDER
  // =====================================================

  const createCodOrder = async () => {
    const [latitude, longitude] = position!;

    console.log("USER ID =", userId);
    console.log(
      "DELIVERY ADDRESS =",
      deliveryAddress
    );
    console.log("LATITUDE =", latitude);
    console.log("LONGITUDE =", longitude);
    console.log(
      "PAYMENT METHOD =",
      paymentMethod
    );

    const response = await api.post(
      `/orders/create-from-cart/${userId}`,
      {
        deliveryAddress: deliveryAddress.trim(),
        latitude,
        longitude,
        paymentMethod: "cod",
      }
    );

    console.log(
      "COD ORDER CREATED =",
      response.data
    );

    await api.delete(`/cart/clear/${userId}`);

    router.push("/order-success");
  };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const placeOrder = async () => {
    if (!userId) {
      alert("User not found. Please login again.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!deliveryAddress.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    if (!position) {
      alert(
        "Please select your delivery location on the map."
      );
      return;
    }

    try {
      setLoading(true);

      if (paymentMethod === "cod") {
        await createCodOrder();
        return;
      }

      if (paymentMethod === "esewa") {
        await payWithEsewa();
        return;
      }

      if (paymentMethod === "khalti") {
        alert(
          "Khalti payment will be added next."
        );

        setLoading(false);
        return;
      }
    } catch (error: any) {
      console.error(
        "ORDER CREATION ERROR =",
        error
      );

      console.error(
        "ORDER ERROR RESPONSE =",
        error?.response?.data
      );

      alert(
        error?.response?.data?.message ||
          "Failed to place order. Please try again."
      );

      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f8f8fa]">
      {/* TOP HEADER */}

      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-pink-600"
          >
            <ArrowLeft size={17} />
            Back to Cart
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
              <ShoppingBag size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Checkout
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Complete your order securely
              </p>
            </div>
          </div>

          {/* CHECKOUT STEPS */}

          <div className="mt-6 hidden items-center sm:flex">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-600 text-white">
                <Check size={14} />
              </div>

              <span className="text-sm font-semibold text-gray-900">
                Cart
              </span>
            </div>

            <div className="mx-4 h-px w-16 bg-pink-200" />

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-600 text-sm font-bold text-white">
                2
              </div>

              <span className="text-sm font-semibold text-pink-600">
                Checkout
              </span>
            </div>

            <div className="mx-4 h-px w-16 bg-gray-200" />

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-400">
                3
              </div>

              <span className="text-sm font-medium text-gray-400">
                Complete
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          {/* LEFT SIDE */}

          <div className="space-y-6">
            {/* DELIVERY ADDRESS */}

            <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Delivery Information
                    </h2>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Delivery Address
                </label>

                <textarea
                  value={deliveryAddress}
                  onChange={(event) =>
                    setDeliveryAddress(
                      event.target.value
                    )
                  }
                  placeholder="Example: New Baneshwor, Kathmandu"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-50"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Please provide a clear address so your
                  order can be delivered easily.
                </p>
              </div>
            </section>

            {/* MAP */}

            <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Delivery Location
                    </h2>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Select your exact delivery location
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-4 rounded-xl bg-pink-50 px-4 py-3">
                  <p className="text-sm font-medium text-pink-800">
                    📍 Select your location
                  </p>

                  <p className="mt-1 text-xs leading-5 text-pink-600">
                    Click anywhere on the map or drag the
                    marker to choose your delivery location.
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200">
                  <MapPicker
                    position={position}
                    setPosition={setPosition}
                  />
                </div>

                {position && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Latitude
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {position[0].toFixed(6)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Longitude
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {position[1].toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* PAYMENT */}

            <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                    <CreditCard size={19} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Payment Method
                    </h2>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Choose your preferred payment option
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-5 sm:p-6">
                {/* COD */}

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${
                    paymentMethod === "cod"
                      ? "border-pink-500 bg-pink-50/60 ring-2 ring-pink-100"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        paymentMethod === "cod"
                          ? "bg-pink-600 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Truck size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Cash on Delivery
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Pay when your order arrives
                      </p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() =>
                      setPaymentMethod("cod")
                    }
                    className="h-4 w-4 accent-pink-600"
                  />
                </label>

                {/* ESEWA */}

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${
                    paymentMethod === "esewa"
                      ? "border-pink-500 bg-pink-50/60 ring-2 ring-pink-100"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold ${
                        paymentMethod === "esewa"
                          ? "bg-pink-600 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      E
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        eSewa
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Pay securely using eSewa
                      </p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="esewa"
                    checked={paymentMethod === "esewa"}
                    onChange={() =>
                      setPaymentMethod("esewa")
                    }
                    className="h-4 w-4 accent-pink-600"
                  />
                </label>

                {/* KHALTI */}

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${
                    paymentMethod === "khalti"
                      ? "border-pink-500 bg-pink-50/60 ring-2 ring-pink-100"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold ${
                        paymentMethod === "khalti"
                          ? "bg-pink-600 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      K
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Khalti
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Pay using Khalti wallet
                      </p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="khalti"
                    checked={paymentMethod === "khalti"}
                    onChange={() =>
                      setPaymentMethod("khalti")
                    }
                    className="h-4 w-4 accent-pink-600"
                  />
                </label>
              </div>
            </section>
          </div>

          {/* RIGHT SIDE */}

          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {/* SUMMARY HEADER */}

              <div className="border-b border-gray-100 px-5 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Order Summary
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      {itemCount}{" "}
                      {itemCount === 1
                        ? "item"
                        : "items"}{" "}
                      in your order
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                    <Package size={19} />
                  </div>
                </div>
              </div>

              {/* ITEMS */}

              <div className="max-h-90 space-y-4 overflow-y-auto px-5 py-5">
                {cart.length === 0 ? (
                  <p className="py-6 text-center text-sm text-gray-500">
                    Your cart is empty.
                  </p>
                ) : (
                  cart.map((item) => {
                    const itemName =
                      item.name ||
                      item.title ||
                      "Product";

                    const itemTotal =
                      Number(item.price) *
                      Number(item.quantity);

                    return (
                      <div
                        key={item._id}
                        className="flex gap-3"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={itemName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-300">
                              <ShoppingBag size={22} />
                            </div>
                          )}

                          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-600 px-1 text-[10px] font-bold text-white">
                            {item.quantity}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-semibold leading-5 text-gray-800">
                            {itemName}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Rs{" "}
                            {Number(
                              item.price
                            ).toLocaleString()}{" "}
                            × {item.quantity}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-bold text-gray-900">
                          Rs{" "}
                          {itemTotal.toLocaleString()}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* PRICE */}

              <div className="border-t border-gray-100 px-5 py-5">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="font-medium text-gray-800">
                      Rs {total.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
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
                </div>

                {/* PLACE ORDER */}

                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={
                    loading ||
                    cart.length === 0
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-pink-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {paymentMethod === "cod"
                        ? "Place Order"
                        : paymentMethod === "esewa"
                        ? "Pay with eSewa"
                        : "Proceed to Payment"}

                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>

              {/* SECURITY */}

              <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm">
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      Secure Checkout
                    </p>

                    <p className="mt-1 text-[11px] leading-4 text-gray-400">
                      Your order and payment information
                      are handled securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}