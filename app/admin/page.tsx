"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";

import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";

import ProductsContent from "@/components/admin/Products/ProductsContent";

import StatsCards from "@/components/admin/Dashboard/StatsCard";
import SalesOverview from "@/components/admin/Dashboard/SalesOverview";
import TopProducts from "@/components/admin/Dashboard/TopProducts";
import RecentOrders from "@/components/admin/Dashboard/RecentOrders";
import OrderStatus from "@/components/admin/Dashboard/OrderStatus";
import DeleteOrderModal from "@/components/admin/Dashboard/DeleteOrderModal";
import ViewOrderModal from "@/components/admin/Dashboard/ViewOrderModal";

import PermissionMatrix from "@/components/admin/Permissions/PermissionMatrix";

import CategoriesContent from "@/components/admin/Categories/CategoriesContent";

export default function AdminPage() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [deleteOrder, setDeleteOrder] = useState<any>(null);

  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });

  const [salesData, setSalesData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

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
    const loadDashboard = async () => {
      try {
        const [
          statsResponse,
          salesResponse,
          statusResponse,
          productsResponse,
          ordersResponse,
        ] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/sales-by-month"),
          api.get("/dashboard/orders-by-status"),
          api.get("/dashboard/top-products"),
          api.get("/dashboard/recent-orders"),
        ]);

        setStats(statsResponse.data);
        setSalesData(
          Array.isArray(salesResponse.data)
            ? salesResponse.data
            : []
        );

        setStatusData(
          Array.isArray(statusResponse.data)
            ? statusResponse.data
            : []
        );

        setTopProducts(
          Array.isArray(productsResponse.data)
            ? productsResponse.data
            : []
        );

        setRecentOrders(
          Array.isArray(ordersResponse.data)
            ? ordersResponse.data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );
      }
    };

    loadDashboard();
  }, []);

  const handleDelete = async () => {
    if (!deleteOrder) return;

    try {
      await api.delete(
        `/orders/${deleteOrder._id}`
      );

      setRecentOrders((prev) =>
        prev.filter(
          (order) =>
            order._id !== deleteOrder._id
        )
      );

      setDeleteOrder(null);
    } catch (error) {
      console.error(
        "Failed to delete order:",
        error
      );

      alert("Failed to delete order");
    }
  };

  const salesChartData = salesData.map(
    (item) => ({
      month:
        months[item?._id?.month] ||
        "Unknown",

      sales: item?.sales || 0,
    })
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* SIDEBAR */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* MAIN AREA */}
      <div className="flex-1">
        <Navbar />

        <main className="p-8">

          {/* ================= DASHBOARD ================= */}

          {activePage === "Dashboard" && (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold">
                  Dashboard
                </h1>

                <p className="mt-2 text-gray-500">
                  Welcome back Admin 👋
                </p>
              </div>

              <StatsCards stats={stats} />

              <SalesOverview
                salesData={salesChartData}
              />

              <TopProducts
                products={topProducts}
              />

              <RecentOrders
                orders={recentOrders}
                setSelectedOrder={
                  setSelectedOrder
                }
                setDeleteOrder={
                  setDeleteOrder
                }
                setOrders={
                  setRecentOrders
                }
              />

              <OrderStatus
                statusData={statusData}
              />

              {deleteOrder && (
                <DeleteOrderModal
                  order={deleteOrder}
                  setDeleteOrder={
                    setDeleteOrder
                  }
                  deleteHandler={
                    handleDelete
                  }
                />
              )}

              {selectedOrder && (
                <ViewOrderModal
                  order={selectedOrder}
                  setSelectedOrder={
                    setSelectedOrder
                  }
                />
              )}
            </>
          )}

          {/* ================= PRODUCTS ================= */}

          {activePage === "Products" && (
            <ProductsContent />
          )}

          {/* ================= CATEGORIES ================= */}

          {activePage === "Categories" && (
            <CategoriesContent />
          )}

          {/* ================= PERMISSIONS ================= */}

          {activePage === "Permissions" && (
            <PermissionMatrix />
          )}

          {/* ================= ORDERS ================= */}

          {activePage === "Orders" && (
            <div className="rounded-xl border bg-white p-8">
              <h1 className="text-2xl font-bold">
                Orders
              </h1>

              <p className="mt-2 text-gray-500">
                Orders management will appear here.
              </p>
            </div>
          )}

          {/* ================= CUSTOMERS ================= */}

          {activePage === "Customers" && (
            <div className="rounded-xl border bg-white p-8">
              <h1 className="text-2xl font-bold">
                Customers
              </h1>

              <p className="mt-2 text-gray-500">
                Customer management will appear here.
              </p>
            </div>
          )}

          {/* ================= ANALYTICS ================= */}

          {activePage === "Analytics" && (
            <div className="rounded-xl border bg-white p-8">
              <h1 className="text-2xl font-bold">
                Analytics
              </h1>

              <p className="mt-2 text-gray-500">
                Analytics will appear here.
              </p>
            </div>
          )}

          {/* ================= SETTINGS ================= */}

          {activePage === "Settings" && (
            <div className="rounded-xl border bg-white p-8">
              <h1 className="text-2xl font-bold">
                Settings
              </h1>

              <p className="mt-2 text-gray-500">
                Settings will appear here.
              </p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}