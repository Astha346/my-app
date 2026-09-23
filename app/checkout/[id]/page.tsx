"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import api from "@/lib/api";

const MapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-100 w-full rounded-xl bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
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
    return (
      sum +
      Number(item.price) * Number(item.quantity)
    );
  }, 0);

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

      console.log(
        "ESEWA RESPONSE =",
        response.data
      );

      const paymentUrl =
        response.data?.paymentUrl;

      const fields =
        response.data?.fields;

      if (!paymentUrl || !fields) {
        throw new Error(
          "Invalid eSewa payment response"
        );
      }

      // =================================================
      // CREATE FORM FOR ESEWA
      // =================================================

      const form = document.createElement("form");

      form.method = "POST";
      form.action = paymentUrl;

      Object.entries(fields).forEach(
        ([key, value]) => {
          const input =
            document.createElement("input");

          input.type = "hidden";
          input.name = key;
          input.value = String(value);

          form.appendChild(input);
        }
      );

      document.body.appendChild(form);

      // Redirect customer to eSewa
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

      // =================================================
      // COD
      // =================================================

      if (paymentMethod === "cod") {
        await createCodOrder();
        return;
      }

      // =================================================
      // ESEWA
      // =================================================

      if (paymentMethod === "esewa") {
        await payWithEsewa();
        return;
      }

      // =================================================
      // KHALTI
      // =================================================

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold">
            Checkout
          </h1>

          <p className="text-gray-500 mt-1">
            Enter your delivery details and select your
            location.
          </p>
        </div>

        {/* YOUR ORDER */}

        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">
            Your Order
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">
              Your cart is empty.
            </p>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div>
                    <p className="font-medium">
                      {item.name ||
                        item.title ||
                        "Product"}
                    </p>

                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <span className="font-medium">
                    $
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TOTAL */}

          <div className="flex justify-between mt-5 text-lg font-bold">
            <span>Total</span>

            <span>
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* DELIVERY ADDRESS */}

        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold">
            Delivery Address
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Enter the address where you want your order
            delivered.
          </p>

          <textarea
            value={deliveryAddress}
            onChange={(event) =>
              setDeliveryAddress(event.target.value)
            }
            placeholder="Example: New Baneshwor, Kathmandu"
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-3 mt-4 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* MAP */}

        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold">
            Select Delivery Location
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Click on the map to select your delivery
            location. You can also drag the marker.
          </p>

          <div className="mt-4 rounded-xl overflow-hidden border">
            <MapPicker
              position={position}
              setPosition={setPosition}
            />
          </div>

          {position && (
            <div className="mt-4 bg-gray-50 border rounded-lg p-4">
              <p className="font-medium">
                Selected Location
              </p>

              <div className="grid grid-cols-2 gap-4 mt-3">

                <div>
                  <p className="text-xs text-gray-500">
                    Latitude
                  </p>

                  <p className="text-sm font-medium">
                    {position[0].toFixed(6)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Longitude
                  </p>

                  <p className="text-sm font-medium">
                    {position[1].toFixed(6)}
                  </p>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* PAYMENT */}

        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold">
            Payment Method
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Choose how you want to pay for your order.
          </p>

          <div className="mt-4 space-y-3">

            {/* COD */}

            <label
              className={`block border rounded-lg p-4 cursor-pointer transition ${
                paymentMethod === "cod"
                  ? "border-black bg-gray-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() =>
                    setPaymentMethod("cod")
                  }
                />

                <div>
                  <p className="font-medium">
                    Cash on Delivery
                  </p>

                  <p className="text-sm text-gray-500">
                    Pay when your order is delivered.
                  </p>
                </div>
              </div>
            </label>

            {/* ESEWA */}

            <label
              className={`block border rounded-lg p-4 cursor-pointer transition ${
                paymentMethod === "esewa"
                  ? "border-black bg-gray-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="esewa"
                  checked={paymentMethod === "esewa"}
                  onChange={() =>
                    setPaymentMethod("esewa")
                  }
                />

                <div>
                  <p className="font-medium">
                    eSewa
                  </p>

                  <p className="text-sm text-gray-500">
                    Pay using eSewa.
                  </p>
                </div>
              </div>
            </label>

            {/* KHALTI */}

            <label
              className={`block border rounded-lg p-4 cursor-pointer transition ${
                paymentMethod === "khalti"
                  ? "border-black bg-gray-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="khalti"
                  checked={paymentMethod === "khalti"}
                  onChange={() =>
                    setPaymentMethod("khalti")
                  }
                />

                <div>
                  <p className="font-medium">
                    Khalti
                  </p>

                  <p className="text-sm text-gray-500">
                    Pay using Khalti.
                  </p>
                </div>
              </div>
            </label>

          </div>
        </div>

        {/* PLACE ORDER */}

        <button
          type="button"
          onClick={placeOrder}
          disabled={loading || cart.length === 0}
          className="w-full bg-black text-white py-3 rounded-lg mt-6 font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading
            ? "Processing..."
            : paymentMethod === "cod"
            ? "Place Order"
            : paymentMethod === "esewa"
            ? "Pay with eSewa"
            : "Proceed to Payment"}
        </button>

      </div>
    </div>
  );
}