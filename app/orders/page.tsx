"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const userId = "demo-user";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get(`/order/${userId}`);
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          My Orders
        </h1>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-gray-500 text-center">
            No orders found
          </div>
        ) : (
          <div className="space-y-4">

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow p-5 border border-gray-100 hover:shadow-md transition"
              >

                {/* TOP */}
                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-700 font-semibold">
                    Order ID: {order._id.slice(-6)}
                  </p>

                  <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                    {order.status}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Total:</span> ${order.total}
                  </p>

                  <p>
                    <span className="font-medium">Items:</span>{" "}
                    {order.items?.map((item: any) => item.name).join(", ")}
                  </p>
                </div>

                {/* DATE */}
                <p className="text-xs text-gray-400 mt-3">
                  {new Date(order.createdAt).toLocaleString()}
                </p>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}