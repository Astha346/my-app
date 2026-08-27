"use client";

import { useMemo, useState } from "react";

import OrderStats from "./OrderStats";
import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";
import OrderDetailsDialog from "./OrderDetailsDialog";
import ChangeStatusDialog from "./ChangeStatusDialog";
import CancelOrderDialog from "./CancelOrderDialog";
import Invoice from "@/components/admin/Orders/Invoice";

import {
  Order,
  OrderStatus,
} from "@/types/order";

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

  // =========================================================
  // ORDERS
  // =========================================================

  const [orders, setOrders] =
    useState<Order[]>(mockOrders);

  // =========================================================
  // FILTERS
  // =========================================================

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [payment, setPayment] =
    useState("all");

  const [paymentStatus, setPaymentStatus] =
    useState("all");

  // =========================================================
  // DETAILS
  // =========================================================

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  // =========================================================
  // CHANGE STATUS
  // =========================================================

  const [statusOrder, setStatusOrder] =
    useState<Order | null>(null);

  // =========================================================
  // CANCEL
  // =========================================================

  const [cancelOrder, setCancelOrder] =
    useState<Order | null>(null);

  // =========================================================
  // INVOICE
  // =========================================================

  const [invoiceOrder, setInvoiceOrder] =
    useState<Order | null>(null);

  // =========================================================
  // SELECTED ORDERS
  // =========================================================

  const [selectedOrders, setSelectedOrders] =
    useState<string[]>([]);

  // =========================================================
  // SINGLE STATUS UPDATE
  // =========================================================

  const handleStatusUpdate = (
    orderId: string,
    newStatus: OrderStatus
  ) => {
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

    setStatusOrder(null);
    setSelectedOrder(null);
  };

  // =========================================================
  // OPEN STATUS DIALOG
  // =========================================================

  const handleChangeStatus = (
    order: Order
  ) => {
    setStatusOrder(order);
  };

  // =========================================================
  // OPEN CANCEL DIALOG
  // =========================================================

  const handleCancelOrder = (
    order: Order
  ) => {
    setCancelOrder(order);
  };

  // =========================================================
  // CONFIRM CANCEL
  // =========================================================

  const confirmCancelOrder = (
    order: Order
  ) => {
    setOrders((currentOrders) =>
      currentOrders.map((currentOrder) =>
        currentOrder._id === order._id
          ? {
              ...currentOrder,
              status: "cancelled",
            }
          : currentOrder
      )
    );

    setCancelOrder(null);

    setSelectedOrders((current) =>
      current.filter(
        (id) => id !== order._id
      )
    );
  };

  // =========================================================
  // BULK STATUS
  // =========================================================

  const handleBulkStatusUpdate = (
    newStatus: OrderStatus
  ) => {
    if (selectedOrders.length === 0) {
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        selectedOrders.includes(order._id)
          ? {
              ...order,
              status: newStatus,
            }
          : order
      )
    );

    setSelectedOrders([]);
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredOrders = useMemo(() => {

    return orders.filter((order) => {

      const searchValue =
        search.toLowerCase().trim();

      const searchMatch =
        order.orderNumber
          .toLowerCase()
          .includes(searchValue) ||

        order.customer.name
          .toLowerCase()
          .includes(searchValue) ||

        order.customer.email
          .toLowerCase()
          .includes(searchValue);

      const statusMatch =
        status === "all" ||
        order.status === status;

      const paymentMatch =
        payment === "all" ||
        order.paymentMethod === payment;

      const paymentStatusMatch =
        paymentStatus === "all" ||
        order.paymentStatus ===
          paymentStatus;

      return (
        searchMatch &&
        statusMatch &&
        paymentMatch &&
        paymentStatusMatch
      );
    });

  }, [
    orders,
    search,
    status,
    payment,
    paymentStatus,
  ]);

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>

        <h1 className="text-3xl font-bold text-slate-900">
          Orders
        </h1>

        <p className="mt-1 text-slate-500">
          Manage and track customer orders
        </p>

      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      <OrderStats
        orders={orders}
      />

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <OrderFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        payment={payment}
        setPayment={setPayment}
        paymentStatus={paymentStatus}
        setPaymentStatus={
          setPaymentStatus
        }
      />

      {/* =====================================================
          BULK ACTION
      ===================================================== */}

      {selectedOrders.length > 0 && (

        <div className="rounded-xl bg-slate-900 p-4 text-white">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="font-semibold">
                {selectedOrders.length}{" "}
                {selectedOrders.length === 1
                  ? "order"
                  : "orders"}{" "}
                selected
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Choose an action
              </p>

            </div>

            <div className="flex gap-2">

              <select
                defaultValue=""
                onChange={(e) => {

                  if (!e.target.value) {
                    return;
                  }

                  handleBulkStatusUpdate(
                    e.target.value as OrderStatus
                  );

                  e.target.value = "";
                }}
                className="
                  rounded-lg
                  border
                  border-slate-700
                  bg-slate-800
                  px-4
                  py-2
                  text-sm
                  text-white
                "
              >

                <option value="" disabled>
                  Update Status
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="confirmed">
                  Confirmed
                </option>

                <option value="processing">
                  Processing
                </option>

                <option value="shipped">
                  Shipped
                </option>

                <option value="delivered">
                  Delivered
                </option>

                <option value="cancelled">
                  Cancelled
                </option>

              </select>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrders([])
                }
                className="
                  rounded-lg
                  border
                  border-slate-700
                  px-4
                  py-2
                  text-sm
                  text-slate-300
                  hover:bg-slate-800
                "
              >
                Clear
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          TABLE
      ===================================================== */}

      <OrderTable
        orders={filteredOrders}
        onView={setSelectedOrder}
        selectedOrders={selectedOrders}
        onSelectionChange={
          setSelectedOrders
        }
        onPrintInvoice={(order) => {
          setInvoiceOrder(order);
        }}
        onChangeStatus={
          handleChangeStatus
        }
        onCancelOrder={
          handleCancelOrder
        }
      />

      {/* =====================================================
          ORDER DETAILS DIALOG
      ===================================================== */}

      <OrderDetailsDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() =>
          setSelectedOrder(null)
        }
        onStatusUpdate={
          handleStatusUpdate
        }
        onPrintInvoice={(order) => {
          setInvoiceOrder(order);
          setSelectedOrder(null);
        }}
      />

      {/* =====================================================
          CHANGE STATUS DIALOG
      ===================================================== */}

      <ChangeStatusDialog
        order={statusOrder}
        open={!!statusOrder}
        onClose={() =>
          setStatusOrder(null)
        }
        onConfirm={
          handleStatusUpdate
        }
      />

      {/* =====================================================
          CANCEL ORDER DIALOG
      ===================================================== */}

      <CancelOrderDialog
        order={cancelOrder}
        open={!!cancelOrder}
        onClose={() =>
          setCancelOrder(null)
        }
        onConfirm={
          confirmCancelOrder
        }
      />

      {/* =====================================================
          INVOICE
      ===================================================== */}

      {invoiceOrder && (
        <Invoice
          order={invoiceOrder}
          onClose={() =>
            setInvoiceOrder(null)
          }
        />
      )}

    </div>
  );
}