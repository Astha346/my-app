"use client";

import { useMemo, useState } from "react";

import OrderStats from "./OrderStats";
import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";
import OrderDetailsDialog from "./OrderDetailsDialog";

import { Order } from "@/types/order";

const mockOrders: Order[] = [
  {
    _id: "1",
    orderNumber: "#ORD-1024",

    customer: {
      name: "Ram Sharma",
      email: "ram@gmail.com",
      phone: "9800000000",
    },

    items: [
      {
        productId: "p1",
        name: "Wireless Headphone",
        price: 1500,
        quantity: 1,
      },
      {
        productId: "p2",
        name: "T-Shirt",
        price: 475,
        quantity: 2,
      },
    ],

    subtotal: 2450,
    shipping: 100,
    discount: 100,
    total: 2450,

    status: "delivered",

    paymentMethod: "esewa",
    paymentStatus: "paid",

    shippingAddress: {
      address: "New Baneshwor",
      city: "Kathmandu",
      country: "Nepal",
    },

    createdAt: "2026-08-26",
  },

  {
    _id: "2",
    orderNumber: "#ORD-1023",

    customer: {
      name: "Sita Thapa",
      email: "sita@gmail.com",
      phone: "9811111111",
    },

    items: [
      {
        productId: "p3",
        name: "Smart Watch",
        price: 2500,
        quantity: 1,
      },
    ],

    subtotal: 2500,
    shipping: 100,
    discount: 0,
    total: 2600,

    status: "processing",

    paymentMethod: "cod",
    paymentStatus: "pending",

    shippingAddress: {
      address: "Lalitpur",
      city: "Lalitpur",
      country: "Nepal",
    },

    createdAt: "2026-08-26",
  },

  {
    _id: "3",
    orderNumber: "#ORD-1022",

    customer: {
      name: "Hari KC",
      email: "hari@gmail.com",
      phone: "9822222222",
    },

    items: [
      {
        productId: "p4",
        name: "Laptop",
        price: 85000,
        quantity: 1,
      },
    ],

    subtotal: 85000,
    shipping: 0,
    discount: 5000,
    total: 80000,

    status: "shipped",

    paymentMethod: "khalti",
    paymentStatus: "paid",

    shippingAddress: {
      address: "Pokhara",
      city: "Pokhara",
      country: "Nepal",
    },

    createdAt: "2026-08-25",
  },

  {
    _id: "4",
    orderNumber: "#ORD-1021",

    customer: {
      name: "Mina Rai",
      email: "mina@gmail.com",
      phone: "9833333333",
    },

    items: [
      {
        productId: "p5",
        name: "Face Cream",
        price: 699,
        quantity: 1,
      },
    ],

    subtotal: 699,
    shipping: 100,
    discount: 0,
    total: 799,

    status: "pending",

    paymentMethod: "cod",
    paymentStatus: "pending",

    shippingAddress: {
      address: "Bhaktapur",
      city: "Bhaktapur",
      country: "Nepal",
    },

    createdAt: "2026-08-25",
  },
];

export default function OrdersContent() {

  // IMPORTANT:
  // We need setOrders so the frontend can update order status.
  const [orders, setOrders] =
    useState<Order[]>(mockOrders);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [payment, setPayment] =
    useState("all");

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  // -----------------------------------------
  // UPDATE ORDER STATUS
  // -----------------------------------------

  const handleStatusUpdate = (
    orderId: string,
    newStatus: Order["status"]
  ) => {

    console.log(
      "Updating order:",
      orderId
    );

    console.log(
      "New order status:",
      newStatus
    );

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order._id === orderId
          ? {
              ...order,
              status: newStatus,
            }
          : order
      )
    );
  };

  // -----------------------------------------
  // FILTER ORDERS
  // -----------------------------------------

  const filteredOrders = useMemo(() => {

    return orders.filter((order) => {

      const searchMatch =
        order.orderNumber
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        order.customer.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        order.customer.email
          .toLowerCase()
          .includes(search.toLowerCase());

      const statusMatch =
        status === "all" ||
        order.status === status;

      const paymentMatch =
        payment === "all" ||
        order.paymentMethod === payment;

      return (
        searchMatch &&
        statusMatch &&
        paymentMatch
      );
    });

  }, [
    orders,
    search,
    status,
    payment,
  ]);

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          Orders
        </h1>

        <p className="mt-1 text-gray-500">
          Manage and track customer orders
        </p>
      </div>

      {/* STATS */}

      <OrderStats
        orders={orders}
      />

      {/* FILTERS */}

      <OrderFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        payment={payment}
        setPayment={setPayment}
      />

      {/* TABLE */}

      <OrderTable
        orders={filteredOrders}
        onView={setSelectedOrder}
      />

      {/* ORDER DETAILS */}

      <OrderDetailsDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() =>
          setSelectedOrder(null)
        }
        onStatusUpdate={
          handleStatusUpdate
        }
      />

    </div>
  );
}