"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import ProductsContent from "@/components/admin/Products/ProductsContent";
import StatsCards from "@/components/admin/Dashboard/StatsCard";
import SalesOverview from "@/components/admin/Dashboard/SalesOverview"; 
import TopProducts from "@/components/admin/Dashboard/TopProducts";
import RecentOrders from "@/components/admin/Dashboard/RecentOrders";
import OrderStatus from "@/components/admin/Dashboard/OrderStatus";
import DeleteOrderModal from "@/components/admin/Dashboard/DeleteOrderModal";
import ViewOrderModal from "@/components/admin/Dashboard/ViewOrderModal"
import PermissionMatrix from "@/components/admin/Permissions/PermissionMatrix";
import CategoriesContent from "@/components/admin/Categories/CategoriesContent";

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
  const loadDashboard = async () => {
    try {
      const [stats, sales, status, products, orders] = await Promise.all([
        axios.get("http://localhost:3001/dashboard/stats"),
        axios.get("http://localhost:3001/dashboard/sales-by-month"),
        axios.get("http://localhost:3001/dashboard/orders-by-status"),
        axios.get("http://localhost:3001/dashboard/top-products"),
        axios.get("http://localhost:3001/dashboard/recent-orders"),
      ]);

      setStats(stats.data);
      setSalesData(sales.data);
      setStatusData(status.data);
      setTopProducts(products.data);
      setRecentOrders(orders.data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    }
  };

  loadDashboard();
   }, []);

const handleDelete = async () => {

  if (!deleteOrder) return;

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

};
      

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

  {/* DASHBOARD */}
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
        setSelectedOrder={setSelectedOrder}
        setDeleteOrder={setDeleteOrder}
        setOrders={setRecentOrders}
      />

      <OrderStatus
        statusData={statusData}
      />

      {deleteOrder && (
        <DeleteOrderModal
          order={deleteOrder}
          setDeleteOrder={setDeleteOrder}
          deleteHandler={handleDelete}
        />
      )}

      {selectedOrder && (
        <ViewOrderModal
          order={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      )}
    </>
  )}

  {/* PRODUCTS */}
  {activePage === "Products" && (
    <ProductsContent />
  )}

  {/* PERMISSIONS */}
  {activePage === "Permissions" && (
    <PermissionMatrix />
  )}

  {/* CATEGORIES */}
   {activePage === "Categories" && (
  <CategoriesContent />
   )}

</main>
              
</div>
</div>
  );
}

