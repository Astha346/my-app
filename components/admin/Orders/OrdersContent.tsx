"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  Order,
  OrderStatus,
  ReturnRefundStatus,
} from "@/types/order";

import OrderStats from "./OrderStats";
import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";
import OrderDetailsDialog from "./OrderDetailsDialog";
import ChangeStatusDialog from "./ChangeStatusDialog";
import CancelOrderDialog from "./CancelOrderDialog";
import Invoice from "./Invoice";
import ReturnRefundDialog from "./ReturnRefundDialog";
import ReturnRefundReviewDialog from "./ReturnRefundReviewDialog";
import Pagination from "./Pagination";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/* =========================================================
   BACKEND TYPES
========================================================= */

interface BackendOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface BackendOrder {
  _id: string;
  orderNumber?: string;
  userId?: string;

  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };

  items: BackendOrderItem[];

  subtotal?: number;
  shipping?: number;
  discount?: number;
  total: number;

  status: OrderStatus;

  paymentMethod?: "cod" | "esewa" | "khalti";
  paymentStatus?: "paid" | "pending" | "failed";

  shippingAddress?: {
    address?: string;
    city?: string;
    country?: string;
  };

  returnRefundStatus?: ReturnRefundStatus;
  returnItemIds?: string[];
  returnReason?: string;
  customerNote?: string;

  refundMethod?:
    | ""
    | "original"
    | "esewa"
    | "khalti"
    | "bank"
    | "cash";

  refundAmount?: number;
  refundReviewNote?: string;

  returnRequestedAt?: string;
  returnReviewedAt?: string;
  refundedAt?: string;

  createdAt: string;
}

interface OrdersResponse {
  orders?: BackendOrder[];
  data?: BackendOrder[];

  pagination?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };

  total?: number;
  totalOrders?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

interface ReturnRefundRequestData {
  itemIds: string[];
  customerNote?: string;
  reason?: string;
  refundMethod?: string;
  refundAmount?: number;
}

/* =========================================================
   MAP BACKEND ORDER TO FRONTEND ORDER
========================================================= */

const mapBackendOrderToFrontend = (
  order: BackendOrder
): Order => {
  return {
    _id: order._id,

    orderNumber:
      order.orderNumber ||
      order._id.slice(-6).toUpperCase(),

    customer: {
      name:
        order.customer?.name ||
        "Unknown Customer",

      email:
        order.customer?.email ||
        "-",

      phone:
        order.customer?.phone ||
        "",
    },

    items: (order.items || []).map((item) => ({
      productId: item.productId,
      name: item.name,
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 0),
      image: item.image,
    })),

    subtotal: Number(order.subtotal || 0),

    shipping: Number(order.shipping || 0),

    discount: Number(order.discount || 0),

    total: Number(order.total || 0),

    status: order.status,

    returnRefundStatus:
      order.returnRefundStatus ||
      "none",

    returnItemIds:
      order.returnItemIds ||
      [],

    returnReason:
      order.returnReason ||
      "",

    customerNote:
      order.customerNote ||
      "",

    refundMethod:
      order.refundMethod ||
      "",

    refundAmount:
      order.refundAmount !== undefined
        ? Number(order.refundAmount)
        : undefined,

    refundReviewNote:
      order.refundReviewNote ||
      "",

    returnRequestedAt:
      order.returnRequestedAt,

    returnReviewedAt:
      order.returnReviewedAt,

    refundedAt:
      order.refundedAt,

    paymentMethod:
      order.paymentMethod ||
      "cod",

    paymentStatus:
      order.paymentStatus ||
      "pending",

    shippingAddress: {
      address:
        order.shippingAddress?.address ||
        "",

      city:
        order.shippingAddress?.city ||
        "",

      country:
        order.shippingAddress?.country ||
        "",
    },

    createdAt:
      order.createdAt,
  };
};

/* =========================================================
   COMPONENT
========================================================= */

export default function OrdersContent() {
  /* =========================================================
     ORDERS STATE
  ========================================================= */

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =========================================================
     DIALOG STATE
  ========================================================= */

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [statusOrder, setStatusOrder] =
    useState<Order | null>(null);

  const [cancelOrder, setCancelOrder] =
    useState<Order | null>(null);

  const [returnOrder, setReturnOrder] =
    useState<Order | null>(null);

  const [reviewReturnOrder, setReviewReturnOrder] =
    useState<Order | null>(null);

  const [invoiceOrder, setInvoiceOrder] =
    useState<Order | null>(null);

  /* =========================================================
     BULK SELECTION
  ========================================================= */

  const [selectedOrders, setSelectedOrders] =
    useState<string[]>([]);

  /* =========================================================
     FILTERS
  ========================================================= */

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [paymentFilter, setPaymentFilter] =
    useState("all");

  const [paymentStatusFilter, setPaymentStatusFilter] =
    useState("all");

  /* =========================================================
     PAGINATION
  ========================================================= */

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(5);

  const [totalOrders, setTotalOrders] =
    useState(0);

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalOrders / itemsPerPage
    )
  );

  /* =========================================================
     FETCH ORDERS
  ========================================================= */

  const fetchOrders = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const params =
          new URLSearchParams();

        params.set(
          "page",
          String(currentPage)
        );

        params.set(
          "limit",
          String(itemsPerPage)
        );

        if (search.trim()) {
          params.set(
            "search",
            search.trim()
          );
        }

        if (
          statusFilter &&
          statusFilter !== "all"
        ) {
          params.set(
            "status",
            statusFilter
          );
        }

        if (
          paymentFilter &&
          paymentFilter !== "all"
        ) {
          params.set(
            "paymentMethod",
            paymentFilter
          );
        }

        if (
          paymentStatusFilter &&
          paymentStatusFilter !== "all"
        ) {
          params.set(
            "paymentStatus",
            paymentStatusFilter
          );
        }

        const response =
          await fetch(
            `${API_URL}/orders?${params.toString()}`,
            {
              method: "GET",

              headers: {
                "Content-Type":
                  "application/json",
              },

              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch orders: ${response.status}`
          );
        }

        const result: OrdersResponse =
          await response.json();

        /* =====================================================
           GET ORDERS FROM BACKEND
        ===================================================== */

        const backendOrders =
          result.orders ||
          result.data ||
          [];

        const mappedOrders =
          backendOrders.map(
            mapBackendOrderToFrontend
          );

        setOrders(mappedOrders);

        /* =====================================================
           GET TOTAL ORDERS

           Supports:
           1. result.pagination.total
           2. result.total
           3. result.totalOrders
           4. mappedOrders.length
        ===================================================== */

        const backendTotal =
          result.pagination?.total ??
          result.total ??
          result.totalOrders ??
          mappedOrders.length;

        setTotalOrders(
          Number(backendTotal)
        );
      } catch (err) {
        console.error(
          "Failed to fetch orders:",
          err
        );

        setError(
          "Failed to load orders. Please check your backend server."
        );

        setOrders([]);
        setTotalOrders(0);
      } finally {
        setLoading(false);
      }
    },
    [
      currentPage,
      itemsPerPage,
      search,
      statusFilter,
      paymentFilter,
      paymentStatusFilter,
    ]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value);
    setCurrentPage(1);
  };

  /* =========================================================
     STATUS FILTER
  ========================================================= */

  const handleStatusChange = (
    value: string
  ) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  /* =========================================================
     PAYMENT FILTER
  ========================================================= */

  const handlePaymentChange = (
    value: string
  ) => {
    setPaymentFilter(value);
    setCurrentPage(1);
  };

  /* =========================================================
     PAYMENT STATUS FILTER
  ========================================================= */

  const handlePaymentStatusChange = (
    value: string
  ) => {
    setPaymentStatusFilter(value);
    setCurrentPage(1);
  };

  /* =========================================================
     PAGINATION
  ========================================================= */

  const handlePageChange = (
    page: number
  ) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (
    value: number
  ) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  /* =========================================================
     VIEW ORDER
  ========================================================= */

  const handleView = (
    order: Order
  ) => {
    setSelectedOrder(order);
  };

  /* =========================================================
     PRINT INVOICE
  ========================================================= */

  const handlePrintInvoice = (
    order: Order
  ) => {
    setInvoiceOrder(order);

    setTimeout(() => {
      window.print();
    }, 300);
  };

  /* =========================================================
     CHANGE ORDER STATUS
  ========================================================= */

  const handleChangeStatus = (
    order: Order
  ) => {
    setStatusOrder(order);
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      const response =
        await fetch(
          `${API_URL}/orders/${orderId}/status`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              status: newStatus,
            }),
          }
        );

      const result =
        await response.json().catch(
          () => null
        );

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to update order status"
        );
      }

      setStatusOrder(null);

      await fetchOrders();
    } catch (err) {
      console.error(
        "Status update failed:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Failed to update order status."
      );
    }
  };

  /* =========================================================
     CANCEL ORDER
  ========================================================= */

  const handleCancelOrder = (
    order: Order
  ) => {
    setCancelOrder(order);
  };

  const handleConfirmCancel = async (
    orderId: string,
    reason?: string
  ) => {
    try {
      const response =
        await fetch(
          `${API_URL}/orders/${orderId}/cancel`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              reason:
                reason ||
                "Cancelled by admin",
            }),
          }
        );

      const result =
        await response.json().catch(
          () => null
        );

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to cancel order"
        );
      }

      setCancelOrder(null);

      await fetchOrders();
    } catch (err) {
      console.error(
        "Cancel order failed:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Failed to cancel order."
      );
    }
  };

  /* =========================================================
     RETURN / REFUND REQUEST
  ========================================================= */

  const handleReturnRefund = (
    order: Order
  ) => {
    setReturnOrder(order);
  };

  const handleReturnRefundSubmit =
    async (
      data: ReturnRefundRequestData
    ) => {
      if (!returnOrder) {
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/orders/${returnOrder._id}/return-refund`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                itemIds:
                  data.itemIds || [],

                customerNote:
                  data.customerNote || "",

                reason:
                  data.reason || "",

                refundMethod:
                  data.refundMethod || "",

                refundAmount:
                  data.refundAmount ??
                  returnOrder.total,
              }),
            }
          );

        const result =
          await response
            .json()
            .catch(() => null);

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to submit return/refund request"
          );
        }

        setReturnOrder(null);

        await fetchOrders();

        alert(
          "Return/refund request submitted successfully."
        );
      } catch (err) {
        console.error(
          "Return/refund request failed:",
          err
        );

        alert(
          err instanceof Error
            ? err.message
            : "Failed to submit return/refund request."
        );
      }
    };

  /* =========================================================
     REVIEW RETURN / REFUND
  ========================================================= */

  const handleReviewReturnRefund = (
    order: Order
  ) => {
    setReviewReturnOrder(order);
  };

  /* =========================================================
     RETURN / REFUND STATUS UPDATE
  ========================================================= */

  const handleReturnRefundStatusUpdate =
    async (
      orderId: string,
      newStatus: ReturnRefundStatus
    ) => {
      /*
       * Supported backend flow:
       *
       * requested -> approved
       * requested -> rejected
       * approved  -> refunded
       *
       * "processing" is NOT supported.
       */

      if (
        newStatus === "none"
      ) {
        return;
      }

      if (
        newStatus === "processing"
      ) {
        console.error(
          "Processing is not supported by backend."
        );

        return;
      }

      try {
        let reviewNote =
          "Return/refund request updated by admin.";

        if (
          newStatus === "approved"
        ) {
          reviewNote =
            "Return request approved by admin.";
        }

        if (
          newStatus === "rejected"
        ) {
          reviewNote =
            "Return/refund request rejected by admin.";
        }

        if (
          newStatus === "refunded"
        ) {
          reviewNote =
            "Refund completed successfully.";
        }

        const response =
          await fetch(
            `${API_URL}/orders/${orderId}/return-refund`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                status: newStatus,
                reviewNote,
              }),
            }
          );

        const result =
          await response
            .json()
            .catch(() => null);

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to update return/refund status"
          );
        }

        setReviewReturnOrder(null);

        await fetchOrders();

        if (
          newStatus === "approved"
        ) {
          alert(
            "Return request approved."
          );
        } else if (
          newStatus === "rejected"
        ) {
          alert(
            "Return request rejected."
          );
        } else if (
          newStatus === "refunded"
        ) {
          alert(
            "Refund completed successfully."
          );
        } else {
          alert(
            "Return/refund updated."
          );
        }
      } catch (err) {
        console.error(
          "Return/refund status update failed:",
          err
        );

        alert(
          err instanceof Error
            ? err.message
            : "Failed to update return/refund status."
        );
      }
    };

  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(() => {
    const pending =
      orders.filter(
        (order) =>
          order.status === "pending"
      ).length;

    const processing =
      orders.filter(
        (order) =>
          order.status === "processing"
      ).length;

    const shipped =
      orders.filter(
        (order) =>
          order.status === "shipped"
      ).length;

    const delivered =
      orders.filter(
        (order) =>
          order.status === "delivered"
      ).length;

    const cancelled =
      orders.filter(
        (order) =>
          order.status === "cancelled"
      ).length;

    const requestedReturns =
      orders.filter(
        (order) =>
          order.returnRefundStatus ===
          "requested"
      ).length;

    return {
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      requestedReturns,
    };
  }, [orders]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (
    loading &&
    orders.length === 0
  ) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-xl bg-slate-100" />

        <div className="h-20 animate-pulse rounded-xl bg-slate-100" />

        <div className="h-96 animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      <div className="space-y-6">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Orders
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage customer orders,
            payments, shipping, returns
            and refunds.
          </p>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

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
          status={statusFilter}
          payment={paymentFilter}
          paymentStatus={
            paymentStatusFilter
          }
          setSearch={
            handleSearchChange
          }
          setStatus={
            handleStatusChange
          }
          setPayment={
            handlePaymentChange
          }
          setPaymentStatus={
            handlePaymentStatusChange
          }
        />

        {/* =====================================================
            ORDER TABLE
        ===================================================== */}

        <OrderTable
          orders={orders}
          currentPage={currentPage}
          onView={handleView}
          selectedOrders={
            selectedOrders
          }
          onSelectionChange={
            setSelectedOrders
          }
          onPrintInvoice={
            handlePrintInvoice
          }
          onChangeStatus={
            handleChangeStatus
          }
          onCancelOrder={
            handleCancelOrder
          }
          onReturnRefund={
            handleReturnRefund
          }
          onReviewReturnRefund={
            handleReviewReturnRefund
          }
        />

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={
            itemsPerPage
          }
          totalItems={
            totalOrders
          }
          onPageChange={
            handlePageChange
          }
          onItemsPerPageChange={
            handleItemsPerPageChange
          }
        />
      </div>

      {/* =======================================================
          ORDER DETAILS
      ======================================================= */}

      <OrderDetailsDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() =>
          setSelectedOrder(null)
        }
        onStatusUpdate={
          handleStatusUpdate
        }
        onPrintInvoice={
          handlePrintInvoice
        }
        onReturnRefund={
          handleReturnRefund
        }
      />

      {/* =======================================================
          CHANGE STATUS
      ======================================================= */}

      <ChangeStatusDialog
        order={statusOrder}
        open={!!statusOrder}
        onClose={() =>
          setStatusOrder(null)
        }
        onStatusUpdate={
          handleStatusUpdate
        }
      />

      {/* =======================================================
          CANCEL ORDER
      ======================================================= */}

      <CancelOrderDialog
        order={cancelOrder}
        open={!!cancelOrder}
        onClose={() =>
          setCancelOrder(null)
        }
        onConfirm={(order) =>
          handleConfirmCancel(order._id)
        }
      />

      {/* =======================================================
          RETURN / REFUND REQUEST
      ======================================================= */}

      <ReturnRefundDialog
        order={returnOrder}
        open={!!returnOrder}
        onClose={() =>
          setReturnOrder(null)
        }
        onSubmit={
          handleReturnRefundSubmit
        }
      />

      {/* =======================================================
          RETURN / REFUND REVIEW
      ======================================================= */}

      <ReturnRefundReviewDialog
        order={
          reviewReturnOrder
        }
        open={
          !!reviewReturnOrder
        }
        onClose={() =>
          setReviewReturnOrder(null)
        }
        onStatusUpdate={
          handleReturnRefundStatusUpdate
        }
      />

      {/* =======================================================
          INVOICE
      ======================================================= */}

      {invoiceOrder && (
        <Invoice
          order={invoiceOrder}
          onClose={() =>
            setInvoiceOrder(null)
          }
        />
      )}
    </>
  );
}