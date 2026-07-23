"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import StatsCard from "@/components/admin/StatsCard";

import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
} from "lucide-react";

import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
} from "recharts";

export default function AdminPage() {
  const [activePage, setActivePage] =
    useState("Dashboard");
   const [selectedOrder, setSelectedOrder] = useState<any>(null);
   const [editingOrder, setEditingOrder] = useState<any>(null);
   const [deleteOrder, setDeleteOrder] = useState<any>(null);
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });

  const [orders, setOrders] = useState([]);

  const [salesData, setSalesData] =
    useState<any[]>([]);

  const [statusData, setStatusData] =
    useState<any[]>([]);

  const [topProducts, setTopProducts] =
    useState<any[]>([]);

  const [recentOrders, setRecentOrders] =
    useState<any[]>([]);

  const COLORS = [
    "#22C55E",
    "#3B82F6",
    "#A855F7",
    "#F59E0B",
  ];

  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

   useEffect(() => {
  axios
    .get("http://localhost:3001/dashboard/stats")
    .then((res) => {
      console.log("stats", res.data);
      setStats(res.data);
    });


  axios
    .get("http://localhost:3001/dashboard/sales-by-month")
    .then((res) => {
      console.log("sales", res.data);
      setSalesData(res.data);
    });


  axios
    .get("http://localhost:3001/dashboard/orders-by-status")
    .then((res) => {
      console.log("status", res.data);
      console.log("API Sales:", res.data);
      setStatusData(res.data);
    });


  axios
    .get("http://localhost:3001/dashboard/top-products")
    .then((res) => {
      console.log("products", res.data);
      setTopProducts(res.data);
    });


  axios
    .get("http://localhost:3001/dashboard/recent-orders")
    .then((res) => {
      console.log("orders", res.data);
      setRecentOrders(res.data);
    });

}, []);
      

    const salesChartData = salesData.map((item) => ({
    month: months[item._id.month],
     sales: item.sales,
     }));
    console.log("Sales Chart Data:", JSON.stringify(salesChartData, null, 2));

    console.log(salesChartData);
      return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        activePage={activePage}
        setActivePage={
          setActivePage
        }
      />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">

          <div className="mb-8">
            <h1 className="text-4xl font-bold">
              Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Welcome back Admin 👋
            </p>
          </div>

          {/* Cards */}

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

            

            <StatsCard
      title="Revenue"
     value={`Rs ${stats.revenue}`}
    icon={<DollarSign size={40} className="text-purple-500" />}
      />

    <StatsCard
  title="Orders"
  value={stats.totalOrders}
  icon={<ShoppingCart size={40} className="text-green-500" />}
   />

   <StatsCard
  title="Customers"
  value={stats.totalCustomers}
  icon={<Users size={40} className="text-blue-500" />}
   />

  <StatsCard
  title="Products"
  value={stats.totalProducts}
  icon={<Package size={40} className="text-orange-500" />}
    />
           
     </div>
          {/* Sales + Products */}

          <div className="grid lg:grid-cols-3 gap-6 mt-8">

            <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow">

              <h2 className="font-bold text-xl mb-5">
                Sales Overview
              </h2>

              <div className="h-80">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart
                    data={
                      salesChartData
                    }
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Area
                      dataKey="sales"
                      fill="#6366f1"
                      fillOpacity={
                        0.1
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#4f46e5"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>

              </div>
            </div>

            {/* Top Products */}

            <div className="bg-white rounded-3xl p-6 shadow">

              <div className="flex justify-between mb-5">
                <h2 className="font-bold text-xl">
                  Top Selling Products
                </h2>

                <button className="text-indigo-600">
                  View All
                </button>
              </div>

              <div className="space-y-5">

                {topProducts.map(
                  (
                    product: any
                  ) => (
                    <div
                      key={
                        product._id
                      }
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">

                        <img
                          src={
                            product.image ||
                            "/placeholder.png"
                          }
                          className="w-14 h-14 rounded-xl object-cover"
                        />

                        <div>
                          <p className="font-medium">
                            {
                              product.name
                            }
                          </p>

                          <p className="text-sm text-gray-500">
                            {
                              product.sold
                            }{" "}
                            sold
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}

              </div>
            </div>
          </div>

          {/* Recent Orders */}

          <div className="grid lg:grid-cols-3 gap-6 mt-8">

            <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow">

              <div className="flex justify-between mb-6">
                <h2 className="font-bold text-xl">
                  Recent Orders
                </h2>

                <button className="text-indigo-600">
                  View All
                </button>
              </div>

              <table className="w-full">

                <thead>
                  <tr className="text-gray-500 border-b">

                    <th className="pb-4 text-left">
                      Order
                    </th>

                    <th className="pb-4 text-left">
                      Customer
                    </th>

                    <th className="pb-4 text-left">
                      Amount
                    </th>

                    <th className="pb-4 text-left">
                      Status
                    </th>

                    <th className="pb-4 text-left">
                   Actions
                  </th>

                  </tr>
                </thead>
                          <tbody>
        {recentOrders.map((order: any) => (
        <tr
      key={order._id}
      className="border-b"
    >
      <td className="py-5">
        #{order._id.slice(-6)}
      </td>

      <td>
        {order.customerName}
      </td>

      <td>
        Rs {order.total.toFixed(2)}
      </td>

      <td>
  <span
    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
      ${
        order.status === "Pending"
          ? "bg-yellow-100 text-yellow-700"
          : order.status === "Processing"
          ? "bg-blue-100 text-blue-700"
          : order.status === "Shipped"
          ? "bg-purple-100 text-purple-700"
          : order.status === "Delivered"
          ? "bg-green-100 text-green-700"
          : order.status === "Cancelled"
          ? "bg-red-100 text-red-700"
          : "bg-gray-100 text-gray-700"
      }
    `}
  >
    <span
      className={`w-2.5 h-2.5 rounded-full
        ${
          order.status === "Pending"
            ? "bg-yellow-500"
            : order.status === "Processing"
            ? "bg-blue-500"
            : order.status === "Shipped"
            ? "bg-purple-500"
            : order.status === "Delivered"
            ? "bg-green-500"
            : order.status === "Cancelled"
            ? "bg-red-500"
            : "bg-gray-500"
        }
      `}
    />
    {order.status}
     </span>
    </td>

      <td className="space-x-3">
        <button className="text-blue-600" onClick={() => setSelectedOrder(order)}>
          View
        </button>

        <button
  className="text-green-600"
  onClick={async () => {
    const status = prompt(
      "Enter status:\nPending\nProcessing\nConfirmed\nCompleted\nCancelled"
    );

    if (!status) return;

    await axios.patch(
      `http://localhost:3001/orders/${order._id}/status`,
      {
        status,
      }
    );

    alert("Status Updated");

    window.location.reload();
  }}
>
  Edit
</button>

       <button
  className="text-red-600"
  onClick={() => setDeleteOrder(order)}
>
  Delete
</button>

         </td>
        </tr>
        ))}
        </tbody>

              </table>

              
            </div>

            {/* Order Status */}

            <div className="bg-white rounded-3xl p-6 shadow">

              <h2 className="font-bold text-xl mb-5">
                Order Status
              </h2>

              <div className="h-80">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>

                    <Pie
                      data={
                        statusData
                      }
                      dataKey="count"
                      nameKey="id"
                      outerRadius={
                        110
                      }
                      label
                    >
                      {statusData.map(
                        (
                          _: any,
                          index
                        ) => (
                          <Cell
                            key={
                              index
                            }
                            fill={
                              COLORS[
                                index %
                                  COLORS.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip />

                  </PieChart>
                </ResponsiveContainer>

              </div>
            </div>
          </div>

       </main>

{selectedOrder && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-125 shadow-lg">

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">
          Order Details
        </h2>

        <button
          onClick={() => setSelectedOrder(null)}
          className="text-gray-500 text-xl"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">

        <p>
          <strong>Order ID:</strong>
          {" "}
          {selectedOrder._id}
        </p>

        <p>
          <strong>Customer:</strong>
          {" "}
          {selectedOrder.customerName}
        </p>

        <p>
          <strong>Total:</strong>
          {" "}
          Rs {selectedOrder.total}
        </p>

        <p>
          <strong>Status:</strong>
          {" "}
          {selectedOrder.status}
        </p>

      </div>

      <div className="mt-6 text-right">
        <button
          onClick={() => setSelectedOrder(null)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
  {deleteOrder && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl w-[420px] p-6 shadow-lg">

      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Delete Order
      </h2>

      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this order?
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3">

        <button
          onClick={() => setDeleteOrder(null)}
          className="px-5 py-2 border rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            try {
              await axios.delete(
                `http://localhost:3001/orders/${deleteOrder._id}`
              );

              setRecentOrders((prev: any[]) =>
                prev.filter(
                  (item) => item._id !== deleteOrder._id
                )
              );

              setDeleteOrder(null);
            } catch (error) {
              console.error(error);
              alert("Failed to delete order");
            }
          }}
          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
        >
          Delete
        </button>

      </div>

    </div>
  </div>
)}
</div>
</div>
  );
}

