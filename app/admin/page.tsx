"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import StatsCard from "@/components/admin/Dashboard/StatsCards";

import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  Clock,
  AlertTriangle,
} from "lucide-react";

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

  useEffect(() => {
    axios
      .get("http://localhost:3001/dashboard/stats")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="flex">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">

          {activePage === "Dashboard" && (
            <>
              <h1 className="text-4xl font-bold">
                Dashboard Overview
              </h1>

              <p className="text-gray-500 mt-2 mb-8">
                Welcome back, Admin!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Sales"
                  value={stats.totalSales}
                  icon={<DollarSign size={28} />}
                />

                <StatsCard
                  title="Revenue"
                  value={`Rs ${stats.revenue}`}
                  icon={<DollarSign size={28} />}
                />

                <StatsCard
                  title="Total Orders"
                  value={stats.totalOrders}
                  icon={<ShoppingCart size={28} />}
                />

                <StatsCard
                  title="Total Customers"
                  value={stats.totalCustomers}
                  icon={<Users size={28} />}
                />

                <StatsCard
                  title="Total Products"
                  value={stats.totalProducts}
                  icon={<Package size={28} />}
                />

                <StatsCard
                  title="Pending Orders"
                  value={stats.pendingOrders}
                  icon={<Clock size={28} />}
                />

                <StatsCard
                  title="Low Stock Products"
                  value={stats.lowStockProducts}
                  icon={<AlertTriangle size={28} />}
                />
              </div>
            </>
          )}

          {activePage === "Products" && (
            <h1 className="text-4xl font-bold">
              Products Page
            </h1>
          )}

          {activePage === "Categories" && (
            <h1 className="text-4xl font-bold">
              Categories Page
            </h1>
          )}

          {activePage === "Orders" && (
            <h1 className="text-4xl font-bold">
              Orders Page
            </h1>
          )}

          {activePage === "Customers" && (
            <h1 className="text-4xl font-bold">
              Customers Page
            </h1>
          )}

          {activePage === "Analytics" && (
            <h1 className="text-4xl font-bold">
              Analytics Page
            </h1>
          )}

          {activePage === "Settings" && (
            <h1 className="text-4xl font-bold">
              Settings Page
            </h1>
          )}
        </main>
      </div>
    </div>
  );
}