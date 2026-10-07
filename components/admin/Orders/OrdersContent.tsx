"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";

import api from "@/lib/api";

import OrderFilters from "@/components/admin/Orders/OrderFilters";
import OrderTable from "@/components/admin/Orders/OrderTable";
import Pagination from "@/components/admin/Orders/Pagination";
import OrderDetailsDialog from "@/components/admin/Orders/OrderDetailsDialog";
import type { Order } from "@/types/order";

interface OrdersContentProps {
  onViewOrder?: (order: Order) => void;
}

export default function OrdersContent({
  onViewOrder,
}: OrdersContentProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewOrderOpen, setViewOrderOpen] = useState(false);

  // =========================
  // FILTERS
  // =========================
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  // Selected dates in UI
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  // Dates actually applied to API
  const [appliedDateFrom, setAppliedDateFrom] =
    useState<Date | undefined>();

  const [appliedDateTo, setAppliedDateTo] =
    useState<Date | undefined>();

  // =========================
  // PAGINATION
  // =========================
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalOrders, setTotalOrders] = useState(0);

  // =========================
  // SELECTED ORDERS
  // =========================
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // =========================
  // FETCH ORDERS
  // =========================
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", String(currentPage));
      params.set("limit", String(itemsPerPage));

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (status) {
        params.set("status", status);
      }

      if (payment) {
        params.set("paymentMethod", payment);
      }

      if (paymentStatus) {
        params.set("paymentStatus", paymentStatus);
      }

      if (appliedDateFrom) {
        params.set(
          "startDate",
          format(appliedDateFrom, "yyyy-MM-dd"),
        );
      }

      if (appliedDateTo) {
        params.set(
          "endDate",
          format(appliedDateTo, "yyyy-MM-dd"),
        );
      }

      const response = await api.get(
        `/orders?${params.toString()}`,
      );

      const data = response.data;

      setOrders(data.orders || []);

      setTotalOrders(
        data.pagination?.total ||
          data.pagination?.totalOrders ||
          0,
      );
    } catch (error) {
      console.error("Failed to fetch orders:", error);

      setOrders([]);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    itemsPerPage,
    search,
    status,
    payment,
    paymentStatus,
    appliedDateFrom,
    appliedDateTo,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // =========================
  // FILTER HANDLERS
  // =========================
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatus = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handlePayment = (value: string) => {
    setPayment(value);
    setCurrentPage(1);
  };

  const handlePaymentStatus = (value: string) => {
    setPaymentStatus(value);
    setCurrentPage(1);
  };

  // =========================
  // APPLY DATE FILTER
  // =========================
  const handleApplyFilters = () => {
    if (dateFrom && dateTo && dateFrom > dateTo) {
      alert("Date From cannot be after Date To.");
      return;
    }

    setAppliedDateFrom(dateFrom);
    setAppliedDateTo(dateTo);
    setCurrentPage(1);
  };

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.max(
    1,
    Math.ceil(totalOrders / itemsPerPage),
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // =========================
  // SELECT ORDERS
  // =========================
  const handleSelectionChange = (ids: string[]) => {
    setSelectedOrders(ids);
  };

  // =========================
  // ORDER ACTIONS
  // =========================

  const handleView = (order: Order) => {
  setSelectedOrder(order);
  setViewOrderOpen(true);

  onViewOrder?.(order);
};
  const handlePrintInvoice = (order: Order) => {
  const invoiceWindow = window.open(
    "",
    "_blank",
    "width=900,height=700",
  );

  if (!invoiceWindow) {
    alert("Please allow pop-ups to print the invoice.");
    return;
  }

  const invoiceOrder = order as Order & {
    deliveryAddress?: string;
    createdAt?: string;
    total?: number;
  };

  invoiceWindow.document.write(`
    <html>
      <head>
        <title>ShopEase Invoice</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #222;
          }

          .invoice {
            max-width: 800px;
            margin: auto;
          }

          .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #222;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }

          h1 {
            margin: 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th,
          td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }

          th {
            background: #f5f5f5;
          }

          .total {
            text-align: right;
            font-size: 20px;
            font-weight: bold;
            margin-top: 20px;
          }

          .footer {
            text-align: center;
            margin-top: 40px;
            color: #777;
          }
        </style>
      </head>

      <body>
        <div class="invoice">

          <div class="header">
            <div>
              <h1>ShopEase</h1>
              <p>Order Invoice</p>
            </div>

            <div>
              <strong>Order ID:</strong> ${invoiceOrder._id}
              <br />

              <strong>Date:</strong>
              ${
                invoiceOrder.createdAt
                  ? new Date(
                      invoiceOrder.createdAt,
                    ).toLocaleDateString()
                  : "-"
              }
            </div>
          </div>

          <p>
            <strong>Delivery Address:</strong>
            ${invoiceOrder.deliveryAddress || "-"}
          </p>

          <p>
            <strong>Payment Method:</strong>
            ${invoiceOrder.paymentMethod || "-"}
            <br />

            <strong>Payment Status:</strong>
            ${invoiceOrder.paymentStatus || "-"}
            <br />

            <strong>Order Status:</strong>
            ${invoiceOrder.status || "-"}
          </p>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              ${
                order.items?.length
                  ? order.items
                      .map(
                        (item) => `
                          <tr>
                            <td>
                              ${item.name || item.productId || "-"}
                            </td>

                            <td>
                              ${item.quantity || 0}
                            </td>

                            <td>
                              Rs. ${item.price || 0}
                            </td>

                            <td>
                              Rs. ${
                                (item.price || 0) *
                                (item.quantity || 0)
                              }
                            </td>
                          </tr>
                        `,
                      )
                      .join("")
                  : `
                    <tr>
                      <td colspan="4">
                        No product information available
                      </td>
                    </tr>
                  `
              }
            </tbody>
          </table>

          <div class="total">
            Total: Rs. ${invoiceOrder.total || 0}
          </div>

          <div class="footer">
            Thank you for shopping with ShopEase.
          </div>

        </div>

        <script>
          window.onload = function () {
            window.print();
          };
        </script>
      </body>
    </html>
  `);

  invoiceWindow.document.close();
};

  // =========================
  // CHANGE ORDER STATUS
  // =========================
  const handleChangeStatus = async (order: Order) => {
    const newStatus = window.prompt(
      "Enter status: pending, confirmed, processing, shipped, delivered, cancelled",
      order.status,
    );

    if (!newStatus) {
      return;
    }

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    const normalizedStatus = newStatus
      .trim()
      .toLowerCase();

    if (!allowedStatuses.includes(normalizedStatus)) {
      alert("Invalid order status.");
      return;
    }

    try {
      const response = await api.patch(
        `/orders/${order._id}/status`,
        {
          status: normalizedStatus,
        },
      );

      const updatedOrder = response.data;

      setOrders((previousOrders) =>
        previousOrders.map((item) =>
          item._id === order._id
            ? {
                ...item,
                status:
                  updatedOrder.status ||
                  normalizedStatus,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error,
      );

      alert("Failed to update order status.");
    }
  };

  // =========================
  // CANCEL ORDER
  // =========================
  const handleCancelOrder = async (order: Order) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.patch(
        `/orders/${order._id}/cancel`,
      );

      setOrders((previousOrders) =>
        previousOrders.map((item) =>
          item._id === order._id
            ? {
                ...item,
                status: "cancelled",
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to cancel order:",
        error,
      );

      alert("Failed to cancel order.");
    }
  };

  const handleReturnRefund = (order: Order) => {
    console.log("Return / Refund:", order);
  };

  const handleReviewReturnRefund = (order: Order) => {
    console.log("Review Return / Refund:", order);
  };

  // =========================
  // PAYMENT METHOD
  // =========================
  const handlePaymentMethodChange = async (
    order: Order,
    value: "cod" | "esewa" | "khalti",
  ) => {
    try {
      await api.patch(
        `/orders/${order._id}/payment`,
        {
          paymentMethod: value,
        },
      );

      setOrders((previousOrders) =>
        previousOrders.map((item) =>
          item._id === order._id
            ? {
                ...item,
                paymentMethod: value,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to update payment method:",
        error,
      );

      throw error;
    }
  };

  // =========================
  // PAYMENT STATUS
  // =========================
  const handlePaymentStatusChange = async (
    order: Order,
    value: "paid" | "pending" | "failed",
  ) => {
    try {
      await api.patch(
        `/orders/${order._id}/payment`,
        {
          paymentStatus: value,
        },
      );

      setOrders((previousOrders) =>
        previousOrders.map((item) =>
          item._id === order._id
            ? {
                ...item,
                paymentStatus: value,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to update payment status:",
        error,
      );

      throw error;
    }
  };

  // =========================
  // STATS
  // =========================
  const stats = useMemo(() => {
    const total = orders.length;

    const pending = orders.filter(
      (order) => order.status === "pending",
    ).length;

    const confirmed = orders.filter(
      (order) => order.status === "confirmed",
    ).length;

    const processing = orders.filter(
      (order) => order.status === "processing",
    ).length;

    const shipped = orders.filter(
      (order) => order.status === "shipped",
    ).length;

    const delivered = orders.filter(
      (order) => order.status === "delivered",
    ).length;

    const cancelled = orders.filter(
      (order) => order.status === "cancelled",
    ).length;

    return {
      total,
      pending,
      confirmed,
      processing,
      shipped,
      delivered,
      cancelled,
    };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* =========================
          FILTERS
      ========================= */}
      <OrderFilters
        search={search}
        status={status}
        payment={payment}
        paymentStatus={paymentStatus}
        setSearch={handleSearch}
        setStatus={handleStatus}
        setPayment={handlePayment}
        setPaymentStatus={handlePaymentStatus}
        dateFrom={dateFrom}
        dateTo={dateTo}
        setDateFrom={setDateFrom}
        setDateTo={setDateTo}
        onApplyFilters={handleApplyFilters}
      />

      {/* =========================
          APPLIED DATE MESSAGE
      ========================= */}
      {(appliedDateFrom || appliedDateTo) && (
        <div className="rounded-lg border bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Showing orders from{" "}
          <strong>
            {appliedDateFrom
              ? format(
                  appliedDateFrom,
                  "dd/MM/yyyy",
                )
              : "beginning"}
          </strong>{" "}
          to{" "}
          <strong>
            {appliedDateTo
              ? format(
                  appliedDateTo,
                  "dd/MM/yyyy",
                )
              : "today"}
          </strong>
        </div>
      )}

      {/* =========================
          ORDER TABLE
      ========================= */}
      <div className="rounded-xl border bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-50 items-center justify-center">
            <p className="text-sm text-slate-500">
              Loading orders...
            </p>
          </div>
        ) : (
          <OrderTable
            orders={orders}
            currentPage={currentPage}
            onView={handleView}
            selectedOrders={selectedOrders}
            onSelectionChange={
              handleSelectionChange
            }
            onPrintInvoice={handlePrintInvoice}
            onChangeStatus={handleChangeStatus}
            onCancelOrder={handleCancelOrder}
            onReturnRefund={handleReturnRefund}
            onReviewReturnRefund={
              handleReviewReturnRefund
            }
            onPaymentMethodChange={
              handlePaymentMethodChange
            }
            onPaymentStatusChange={
              handlePaymentStatusChange
            }
          />
        )}
      </div>

      {/* =========================
          PAGINATION
      ========================= */}
      {totalOrders > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalOrders}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={
            handleItemsPerPageChange
          }
        />
      )}

      {/* =========================
          NO ORDERS
      ========================= */}
      {!loading && orders.length === 0 && (
        <div className="rounded-xl border bg-white py-12 text-center">
          <p className="text-gray-500">
            No orders found for the selected filters.
          </p>
        </div>
      )}
      <OrderDetailsDialog
  order={selectedOrder}
  open={viewOrderOpen}
  onClose={() => {
    setViewOrderOpen(false);
    setSelectedOrder(null);
  }}
  onStatusUpdate={async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      setOrders((previousOrders) =>
        previousOrders.map((item) =>
          item._id === orderId
            ? {
                ...item,
                status: newStatus,
              }
            : item,
        ),
      );

      setSelectedOrder((previousOrder) =>
        previousOrder && previousOrder._id === orderId
          ? {
              ...previousOrder,
              status: newStatus,
            }
          : previousOrder,
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status.");
      throw error;
    }
  }}
  onPrintInvoice={handlePrintInvoice}
  onReturnRefund={handleReturnRefund}
   />
    </div>
  );
}