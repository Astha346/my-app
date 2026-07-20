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
  Clock,
  AlertTriangle,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminPage() {
  const [activePage, setActivePage] =
    useState("Dashboard");

  const [stats, setStats] = useState({
    totalSales: 0,
    revenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });

  const [salesData, setSalesData] =
    useState<any[]>([]);

  const [revenueData, setRevenueData] =
    useState<any[]>([]);

  const [statusData, setStatusData] =
    useState<any[]>([]);

  const [customerData, setCustomerData] =
    useState<any[]>([]);

  const [categoryData, setCategoryData] =
    useState<any[]>([]);

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

  const COLORS = [
    "#3B82F6",
    "#22C55E",
    "#F97316",
    "#A855F7",
    "#EF4444",
  ];

  useEffect(() => {
    axios
      .get(
        "http://localhost:3001/dashboard/stats"
      )
      .then((res) =>
        setStats(res.data)
      );

    axios
      .get(
        "http://localhost:3001/dashboard/sales-by-month"
      )
      .then((res) =>
        setSalesData(res.data)
      );

    axios
      .get(
        "http://localhost:3001/dashboard/revenue-by-month"
      )
      .then((res) =>
        setRevenueData(res.data)
      );

    axios
      .get(
        "http://localhost:3001/dashboard/orders-by-status"
      )
      .then((res) =>
        setStatusData(res.data)
      );

    axios
      .get(
        "http://localhost:3001/dashboard/customer-growth"
      )
      .then((res) =>
        setCustomerData(res.data)
      );

    axios
      .get(
        "http://localhost:3001/dashboard/category-sales"
      )
      .then((res) =>
        setCategoryData(
          res.data.filter(
            (item: any) =>
              item._id
          )
        )
      );
  }, []);

  const salesChartData =
    salesData.map((item) => ({
      month:
        months[
          item?._id?.month
        ],
      sales: item.sales,
    }));

  const revenueChartData =
    revenueData.map((item) => ({
      month:
        months[
          item?._id?.month
        ],
      revenue:
        item.revenue,
    }));

  const customerChartData =
    customerData.map((item) => ({
      month:
        months[
          item?._id?.month
        ],
      customers:
        item.customers,
    }));

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar
        activePage={activePage}
        setActivePage={
          setActivePage
        }
      />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">

          {activePage ===
            "Dashboard" && (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold">
                  Dashboard
                </h1>

                <p className="text-gray-500 mt-2">
                  Welcome back,
                  Admin 👋
                </p>
              </div>

              {/* STATS */}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl p-6 shadow-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p>
                        Orders
                      </p>

                      <h1 className="text-4xl font-bold mt-3">
                        {
                          stats.totalOrders
                        }
                      </h1>
                    </div>

                    <ShoppingCart size={40} />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl p-6 shadow-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p>
                        Revenue
                      </p>

                      <h1 className="text-4xl font-bold mt-3">
                        Rs{" "}
                        {
                          stats.revenue
                        }
                      </h1>
                    </div>

                    <DollarSign size={40} />
                  </div>
                </div>

                <div className="bg-linear-to-r from-purple-500 to-fuchsia-600 text-white rounded-3xl p-6 shadow-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p>
                        Customers
                      </p>

                      <h1 className="text-4xl font-bold mt-3">
                        {
                          stats.totalCustomers
                        }
                      </h1>
                    </div>

                    <Users size={40} />
                  </div>
                </div>

                <div className="bg-linear-to-r from-orange-500 to-red-500 text-white rounded-3xl p-6 shadow-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p>
                        Products
                      </p>

                      <h1 className="text-4xl font-bold mt-3">
                        {
                          stats.totalProducts
                        }
                      </h1>
                    </div>

                    <Package size={40} />
                  </div>
                </div>
              </div>

              {/* CHARTS */}

              <div className="grid lg:grid-cols-2 gap-6 mt-8">

                <div className="bg-white rounded-3xl p-6 shadow">
                  <h2 className="text-xl font-bold mb-5">
                    Sales By Month
                  </h2>

                  <div className="h-75">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={
                          salesChartData
                        }
                      >
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Bar
                          dataKey="sales"
                          fill="#3B82F6"
                          radius={[
                            10,
                            10,
                            0,
                            0,
                          ]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow">
                  <h2 className="text-xl font-bold mb-5">
                    Revenue
                  </h2>

                  <div className="h-75">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={
                          revenueChartData
                        }
                      >
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Bar
                          dataKey="revenue"
                          fill="#22C55E"
                          radius={[
                            10,
                            10,
                            0,
                            0,
                          ]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow">
                  <h2 className="text-xl font-bold mb-5">
                    Customer Growth
                  </h2>

                  <div className="h-75">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={
                          customerChartData
                        }
                      >
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Bar
                          dataKey="customers"
                          fill="#A855F7"
                          radius={[
                            10,
                            10,
                            0,
                            0,
                          ]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow">
                  <h2 className="text-xl font-bold mb-5">
                    Order Status
                  </h2>

                  <div className="h-75">
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
                          nameKey="_id"
                          outerRadius={
                            110
                          }
                          label
                        >
                          {statusData.map(
                            (
                              _,
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

              {/* TOP PRODUCTS */}

              <div className="bg-white rounded-3xl p-6 shadow mt-8">
                <h2 className="text-xl font-bold mb-5">
                  Top Selling Products
                </h2>

                <div className="h-75">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      layout="vertical"
                      data={
                        categoryData
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis type="number" />

                      <YAxis
                        type="category"
                        dataKey="_id"
                        width={
                          180
                        }
                      />

                      <Tooltip />

                      <Bar
                        dataKey="sales"
                        fill="#F97316"
                        radius={[
                          0,
                          10,
                          10,
                          0,
                        ]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}