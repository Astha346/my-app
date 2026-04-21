"use client";

import { useRouter } from "next/navigation";

export default function OrderSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-3xl font-bold text-green-600">
        🎉 Order Successful
      </h1>

      <p>Thank you for your purchase</p>

      <button
        onClick={() => router.push("/")}
        className="bg-black text-white px-4 py-2 rounded-lg"
      >
        Go Home
      </button>
    </div>
  );
}