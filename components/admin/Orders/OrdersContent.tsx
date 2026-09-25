
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";

import api from "@/lib/api";

import OrderFilters from "@/components/admin/Orders/OrderFilters";
import OrderTable from "@/components/admin/Orders/OrderTable";
import Pagination from "@/components/admin/Orders/Pagination";

import type { Order } from "@/types/order";

interface OrdersContentProps {
  onViewOrder?: (order: Order) => void;
}

export default function OrdersContent({
  onViewOrder,
}: OrdersContentProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

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
    onViewOrder?.(order);
  };

  const handlePrintInvoice = (order: Order) => {
    console.log("Print invoice:", order);
  };

  const handleChangeStatus = (order: Order) => {
    console.log("Change status:", order);
  };

  const handleCancelOrder = async (order: Order) => {
    console.log("Cancel order:", order);
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
      await api.patch(`/orders/${order._id}`, {
        paymentMethod: value,
      });

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
      await api.patch(`/orders/${order._id}`, {
        paymentStatus: value,
      });

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
              ? format(appliedDateFrom, "dd/MM/yyyy")
              : "beginning"}
          </strong>{" "}
          to{" "}
          <strong>
            {appliedDateTo
              ? format(appliedDateTo, "dd/MM/yyyy")
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
            onSelectionChange={handleSelectionChange}
            onPrintInvoice={handlePrintInvoice}
            onChangeStatus={handleChangeStatus}
            onCancelOrder={handleCancelOrder}
            onReturnRefund={handleReturnRefund}
            onReviewReturnRefund={handleReviewReturnRefund}
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
    </div>
  );
}

