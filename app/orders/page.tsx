"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function OrdersPage() {
  const userId = "demo-user";
  const [orders, setOrders] = useState<any[]>([]);

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-4">My Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="border p-4 mb-3 rounded">
              <p>Total: ${order.total}</p>
              <p>Status: {order.status}</p>
            </div>
          ))
        )}

      </div>
    </div>
  );
}