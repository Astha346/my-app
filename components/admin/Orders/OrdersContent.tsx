"use client";

import { useEffect, useMemo, useState } from "react";

import OrderStats from "./OrderStats";
import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";
import OrderDetailsDialog from "./OrderDetailsDialog";
import ChangeStatusDialog from "./ChangeStatusDialog";
import CancelOrderDialog from "./CancelOrderDialog";
import Invoice from "@/components/admin/Orders/Invoice";
import OrderAnalysis from "./OrderAnalysis";
import ReturnRefundDialog from "./ReturnRefundDialog";
import ReturnRefundReviewDialog from "./ReturnRefundReviewDialog";
import Pagination from "./Pagination";

import {
  Order,
  OrderStatus,
  ReturnRefundStatus,
} from "@/types/order";

/* =========================================================
   BACKEND URL
========================================================= */

const API_URL = "http://localhost:3001";

/* =========================================================
   BACKEND ORDER TYPE
========================================================= */

type BackendOrder = {
  _id: string;
  userId: string;
  customerName: string;

  items: {
    productId: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
  }[];

  total: number;

  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  createdAt?: string;
  updatedAt?: string;
};

/* =========================================================
   PAGINATION RESPONSE
========================================================= */

type OrdersResponse = {
  orders: BackendOrder[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

/* =========================================================
   MAP BACKEND ORDER -> FRONTEND ORDER
========================================================= */

const mapBackendOrderToFrontend = (
  backendOrder: BackendOrder,
  index: number
): Order => {
  const subtotal = backendOrder.items.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  return {
    _id: backendOrder._id,

    /*
     * Your current backend does not have orderNumber.
     * We create a temporary display number from the index/id.
     */
    orderNumber: `#ORD-${1024 + index}`,

    customer: {
      name: backendOrder.customerName || "Unknown Customer",
      email: "",
      phone: "",
    },

    items: backendOrder.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || "",
    })),

    subtotal,

    shipping: 0,

    discount: Math.max(
      subtotal - backendOrder.total,
      0
    ),

    total: backendOrder.total,

    status: backendOrder.status,

    returnRefundStatus: "none",

    /*
     * These values are temporary defaults because
     * the current backend Order schema does not contain
     * payment information yet.
     */
    paymentMethod: "cod",

    paymentStatus: "pending",

    shippingAddress: {
      address: "",
      city: "",
      country: "Nepal",
    },

    createdAt:
      backendOrder.createdAt ||
      new Date().toISOString(),
  };
};

/* =========================================================
   COMPONENT
========================================================= */

export default function OrdersContent() {
  /* =======================================================
     ORDERS
  ======================================================= */

  const [orders, setOrders] =
    useState<Order[]>([]);

  /* =======================================================
     LOADING
  ======================================================= */

  const [loading, setLoading] =
    useState(true);

  /* =======================================================
     ERROR
  ======================================================= */

  const [error, setError] =
    useState("");

  /* =======================================================
     FILTERS
  ======================================================= */

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [payment, setPayment] =
    useState("all");

  const [paymentStatus, setPaymentStatus] =
    useState("all");

  /* =======================================================
     DETAILS
  ======================================================= */

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  /* =======================================================
     CHANGE STATUS
  ======================================================= */

  const [statusOrder, setStatusOrder] =
    useState<Order | null>(null);

  /* =======================================================
     CANCEL
  ======================================================= */

  const [cancelOrder, setCancelOrder] =
    useState<Order | null>(null);

  /* =======================================================
     INVOICE
  ======================================================= */

  const [invoiceOrder, setInvoiceOrder] =
    useState<Order | null>(null);

  /* =======================================================
     SELECTED ORDERS
  ======================================================= */

  const [selectedOrders, setSelectedOrders] =
    useState<string[]>([]);

  /* =======================================================
     RETURN / REFUND REQUEST
  ======================================================= */

  const [returnOrder, setReturnOrder] =
    useState<Order | null>(null);

  /* =======================================================
     RETURN / REFUND REVIEW
  ======================================================= */

  const [reviewReturnOrder, setReviewReturnOrder] =
    useState<Order | null>(null);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(5);

  /* =======================================================
     BACKEND PAGINATION INFO
  ======================================================= */

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 5,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });

  /* =======================================================
     FETCH ORDERS
  ======================================================= */

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

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

        if (status !== "all") {
          params.set(
            "status",
            status
          );
        }

        const response = await fetch(
          `${API_URL}/orders?${params.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch orders (${response.status})`
          );
        }

        const data: OrdersResponse =
          await response.json();

        const mappedOrders =
          data.orders.map(
            (order, index) =>
              mapBackendOrderToFrontend(
                order,
                index
              )
          );

        setOrders(mappedOrders);

        setPagination(
          data.pagination
        );

        /*
         * Remove selected orders that are
         * no longer visible on the current page.
         */
        setSelectedOrders([]);
      } catch (err) {
        console.error(
          "Failed to fetch orders:",
          err
        );

        setError(
          "Unable to load orders. Make sure the backend is running."
        );

        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [
    currentPage,
    itemsPerPage,
    search,
    status,
  ]);

  /* =======================================================
     PAYMENT FILTER
     
     Backend does not support payment filters yet,
     so these are still handled on the frontend.
  ======================================================= */

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const paymentMatch =
        payment === "all" ||
        order.paymentMethod === payment;

      const paymentStatusMatch =
        paymentStatus === "all" ||
        order.paymentStatus ===
          paymentStatus;

      return (
        paymentMatch &&
        paymentStatusMatch
      );
    });
  }, [
    orders,
    payment,
    paymentStatus,
  ]);

  /* =======================================================
     RESET PAGE WHEN FILTERS CHANGE
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    status,
    payment,
    paymentStatus,
    itemsPerPage,
  ]);

  /* =======================================================
     SINGLE ORDER STATUS UPDATE
  ======================================================= */

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      setError("");

      const response = await fetch(
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

      if (!response.ok) {
        throw new Error(
          "Failed to update order status"
        );
      }

      /*
       * Update current UI immediately.
       */
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

      /*
       * Also update selected dialog order.
       */
      setSelectedOrder(
        (currentOrder) =>
          currentOrder &&
          currentOrder._id === orderId
            ? {
                ...currentOrder,
                status: newStatus,
              }
            : currentOrder
      );

      setStatusOrder(null);
      setSelectedOrder(null);
    } catch (err) {
      console.error(
        "Status update failed:",
        err
      );

      setError(
        "Failed to update order status."
      );
    }
  };

  /* =======================================================
     OPEN CHANGE STATUS
  ======================================================= */

  const handleChangeStatus = (
    order: Order
  ) => {
    setStatusOrder(order);
  };

  /* =======================================================
     OPEN CANCEL
  ======================================================= */

  const handleCancelOrder = (
    order: Order
  ) => {
    setCancelOrder(order);
  };

  /* =======================================================
     CONFIRM CANCEL
  ======================================================= */

  const confirmCancelOrder = async (
    order: Order
  ) => {
    /*
     * Cancel is implemented using the same
     * backend status endpoint.
     */
    await handleStatusUpdate(
      order._id,
      "cancelled"
    );

    setCancelOrder(null);

    setSelectedOrders((current) =>
      current.filter(
        (id) => id !== order._id
      )
    );
  };

  /* =======================================================
     BULK STATUS UPDATE
  ======================================================= */

  const handleBulkStatusUpdate = async (
    newStatus: OrderStatus
  ) => {
    if (selectedOrders.length === 0) {
      return;
    }

    try {
      setError("");

      /*
       * Update every selected order
       * through the backend.
       */
      await Promise.all(
        selectedOrders.map(
          async (orderId) => {
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
                    status:
                      newStatus,
                  }),
                }
              );

            if (!response.ok) {
              throw new Error(
                `Failed to update order ${orderId}`
              );
            }
          }
        )
      );

      /*
       * Update current page UI.
       */
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          selectedOrders.includes(
            order._id
          )
            ? {
                ...order,
                status:
                  newStatus,
              }
            : order
        )
      );

      setSelectedOrders([]);
    } catch (err) {
      console.error(
        "Bulk status update failed:",
        err
      );

      setError(
        "Failed to update one or more orders."
      );
    }
  };

  /* =======================================================
     OPEN RETURN / REFUND REQUEST
  ======================================================= */

  const handleReturnRefund = (
    order: Order
  ) => {
    setReturnOrder(order);
  };

  /* =======================================================
     SUBMIT RETURN / REFUND REQUEST
  ======================================================= */

  const handleReturnRefundSubmit = (
    data: any
  ) => {
    if (!returnOrder) {
      return;
    }

    console.log(
      "Return / Refund Request:",
      data
    );

    /*
     * Return/refund backend is not implemented yet.
     * Keep this frontend behavior for now.
     */
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order._id ===
        returnOrder._id
          ? {
              ...order,
              returnRefundStatus:
                "requested",
            }
          : order
      )
    );

    setReturnOrder(null);
  };

  /* =======================================================
     OPEN REVIEW RETURN / REFUND
  ======================================================= */

  const handleReviewReturnRefund = (
    order: Order
  ) => {
    setReviewReturnOrder(order);
  };

  /* =======================================================
     UPDATE RETURN / REFUND STATUS
  ======================================================= */

  const handleReturnRefundStatusUpdate = (
    orderId: string,
    newStatus: ReturnRefundStatus
  ) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order._id === orderId
          ? {
              ...order,
              returnRefundStatus:
                newStatus,
            }
          : order
      )
    );

    setSelectedOrder(
      (currentOrder) =>
        currentOrder &&
        currentOrder._id === orderId
          ? {
              ...currentOrder,
              returnRefundStatus:
                newStatus,
            }
          : currentOrder
    );

    setReviewReturnOrder(null);
  };

  /* =======================================================
     CHANGE ITEMS PER PAGE
  ======================================================= */

  const handleItemsPerPageChange = (
    value: string
  ) => {
    setItemsPerPage(
      Number(value)
    );

    setCurrentPage(1);
  };

  /* =======================================================
     CHANGE PAGE
  ======================================================= */

  const handlePageChange = (
    page: number
  ) => {
    if (page < 1) {
      return;
    }

    if (
      pagination.totalPages > 0 &&
      page > pagination.totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  /* =======================================================
     SHOWING RANGE
  ======================================================= */

  const startIndex =
    pagination.total === 0
      ? 0
      : (currentPage - 1) *
          itemsPerPage +
        1;

  const endIndex =
    pagination.total === 0
      ? 0
      : Math.min(
          currentPage *
            itemsPerPage,
          pagination.total
        );

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="space-y-6">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Orders
        </h1>

        <p className="mt-1 text-slate-500">
          Manage and track customer orders
        </p>
      </div>

      {/* ===================================================
          ERROR MESSAGE
      =================================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ===================================================
          STATS
      =================================================== */}

      <OrderStats orders={orders} />

      {/* ===================================================
          ORDER ANALYSIS
      =================================================== */}

      <OrderAnalysis />

      {/* ===================================================
          FILTERS
      =================================================== */}

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

      {/* ===================================================
          RETURN / REFUND REQUEST DIALOG
      =================================================== */}

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

      {/* ===================================================
          RETURN / REFUND REVIEW DIALOG
      =================================================== */}

      <ReturnRefundReviewDialog
        order={reviewReturnOrder}
        open={!!reviewReturnOrder}
        onClose={() =>
          setReviewReturnOrder(null)
        }
        onStatusUpdate={
          handleReturnRefundStatusUpdate
        }
      />

      {/* ===================================================
          BULK ACTION
      =================================================== */}

      {selectedOrders.length > 0 && (
        <div className="rounded-xl bg-slate-900 p-4 text-white">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="font-semibold">
                {selectedOrders.length}{" "}
                {selectedOrders.length ===
                1
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
                onChange={(event) => {
                  const value =
                    event.target.value;

                  if (!value) {
                    return;
                  }

                  handleBulkStatusUpdate(
                    value as OrderStatus
                  );

                  event.target.value = "";
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
                <option
                  value=""
                  disabled
                >
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

      {/* ===================================================
          ORDER TABLE
      =================================================== */}

      {loading ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            Loading orders...
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="font-medium text-slate-700">
            No orders found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <OrderTable
          orders={filteredOrders}
          onView={setSelectedOrder}
          selectedOrders={
            selectedOrders
          }
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
          onReturnRefund={
            handleReturnRefund
          }
          onReviewReturnRefund={
            handleReviewReturnRefund
          }
        />
      )}

      {/* ===================================================
          PAGINATION
      =================================================== */}

      {!loading &&
        pagination.total > 0 && (
          <div
            className="
              flex
              flex-col
              gap-4
              rounded-xl
              border
              bg-white
              p-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            {/* SHOWING INFO */}

            <div className="text-sm text-slate-500">

              Showing{" "}

              <span className="font-medium text-slate-900">
                {startIndex}
              </span>

              {" - "}

              <span className="font-medium text-slate-900">
                {endIndex}
              </span>

              {" of "}

              <span className="font-medium text-slate-900">
                {pagination.total}
              </span>

              {" orders"}

            </div>

            {/* RIGHT SIDE */}

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-4
              "
            >

              {/* ROWS PER PAGE */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <span
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  Rows per page:
                </span>

                <select
                  value={itemsPerPage}
                  onChange={(event) =>
                    handleItemsPerPageChange(
                      event.target.value
                    )
                  }
                  className="
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2
                    text-sm
                    text-slate-700
                    outline-none
                    focus:border-slate-400
                  "
                >
                  <option value={5}>
                    5
                  </option>

                  <option value={10}>
                    10
                  </option>

                  <option value={20}>
                    20
                  </option>

                </select>

              </div>

              {/* PAGINATION */}

              <Pagination
                currentPage={
                  currentPage
                }
                totalPages={
                  pagination.totalPages
                }
                totalItems={
                  pagination.total
                }
                itemsPerPage={
                  itemsPerPage
                }
                onPageChange={
                  handlePageChange
                }
              />

            </div>
          </div>
        )}

      {/* ===================================================
          ORDER DETAILS
      =================================================== */}

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
        onReturnRefund={(order) => {
          setReturnOrder(order);
        }}
      />

      {/* ===================================================
          CHANGE STATUS DIALOG
      =================================================== */}

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

      {/* ===================================================
          CANCEL ORDER DIALOG
      =================================================== */}

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

      {/* ===================================================
          INVOICE
      =================================================== */}

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