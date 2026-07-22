"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";

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

            <Card
              title="Revenue"
              value={`Rs ${stats.revenue}`}
              icon={
                <DollarSign
                  size={40}
                  className="text-purple-500"
                />
              }
            />

            <Card
              title="Orders"
              value={
                stats.totalOrders
              }
              icon={
                <ShoppingCart
                  size={40}
                  className="text-green-500"
                />
              }
            />

            <Card
              title="Customers"
              value={
                stats.totalCustomers
              }
              icon={
                <Users
                  size={40}
                  className="text-blue-500"
                />
              }
            />

            <Card
              title="Products"
              value={
                stats.totalProducts
              }
              icon={
                <Package
                  size={40}
                  className="text-orange-500"
                />
              }
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
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
          {order.status}
        </span>
      </td>

      <td className="space-x-3">
        <button className="text-blue-600">
          View
        </button>

        <button className="text-green-600">
          Edit
        </button>

        <button className="text-red-600">
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
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  icon,
}: any) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow">
      <div className="flex justify-between items-center">

        <div>
          <p className="text-gray-500">
            {title}
          </p>

          <h1 className="text-4xl font-bold mt-3">
            {value}
          </h1>
        </div>

        {icon}
      </div>
    </div>
  );
}