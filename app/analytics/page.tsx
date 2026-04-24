"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AnalyticsPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/analytics/top");
      setData(res.data);
    };

    fetchData();
  }, []);

  const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          📊 Analytics Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Track product performance and engagement
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Total Clicks</p>
          <h2 className="text-3xl font-bold mt-2 text-indigo-600">
            {totalClicks}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Tracked Products</p>
          <h2 className="text-3xl font-bold mt-2 text-indigo-600">
            {data.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Avg Clicks</p>
          <h2 className="text-3xl font-bold mt-2 text-indigo-600">
            {data.length ? (totalClicks / data.length).toFixed(1) : 0}
          </h2>
        </div>

      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Top Products
          </h2>
          <p className="text-sm text-gray-500">
            Sorted by performance
          </p>
        </div>

        <table className="w-full text-left">

          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="py-3 px-5">Product ID</th>
              <th className="py-3 px-5">Clicks</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item.productId}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="py-3 px-5 font-medium text-gray-700">
                  #{item.productId}
                </td>
                <td className="py-3 px-5 text-gray-900 font-semibold">
                  {item.clicks}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}