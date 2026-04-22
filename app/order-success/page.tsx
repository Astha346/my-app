"use client";

import { useRouter } from "next/navigation";

export default function OrderSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">

        <div className="text-green-500 text-5xl mb-4">
          ✓
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          Order Successful
        </h1>

        <p className="text-gray-500 mt-2">
          Your order has been placed successfully.
        </p>

        <div className="mt-6 flex flex-col gap-3">

          <button
            onClick={() => router.push("/orders")}
            className="bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            View Orders
          </button>

          <button
            onClick={() => router.push("/")}
            className="bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
          >
            Continue Shopping
          </button>

        </div>

      </div>
    </div>
  );
}