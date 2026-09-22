"use client";

import {
  Eye,
  MoreHorizontal,
  Printer,
  RotateCcw,
  XCircle,
  CheckCircle,
  ChevronDown,
  Loader2,
} from "lucide-react";

import React from "react";

import { Order } from "@/types/order";

interface Props {
  orders: Order[];
  currentPage: number;

  onView: (order: Order) => void;
  selectedOrders: string[];
  onSelectionChange: (ids: string[]) => void;

  onPrintInvoice: (order: Order) => void;
  onChangeStatus: (order: Order) => void;
  onCancelOrder: (order: Order) => void;

  onReturnRefund: (order: Order) => void;
  onReviewReturnRefund: (order: Order) => void;

  // PAYMENT
  onPaymentMethodChange?: (
    order: Order,
    value: PaymentMethod
  ) => void | Promise<void>;

  onPaymentStatusChange?: (
    order: Order,
    value: PaymentStatus
  ) => void | Promise<void>;
}

type PaymentMethod = "cod" | "esewa" | "khalti";
type PaymentStatus = "paid" | "pending" | "failed";

const PAYMENT_METHODS: {
  value: PaymentMethod;
  label: string;
}[] = [
  {
    value: "cod",
    label: "COD",
  },
  {
    value: "esewa",
    label: "eSewa",
  },
  {
    value: "khalti",
    label: "Khalti",
  },
];

const PAYMENT_STATUSES: {
  value: PaymentStatus;
  label: string;
}[] = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "paid",
    label: "Paid",
  },
  {
    value: "failed",
    label: "Failed",
  },
];

const paymentStatusClasses: Record<PaymentStatus, string> = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  cod: "COD",
  esewa: "eSewa",
  khalti: "Khalti",
};

export default function OrderTable({
  orders,
  currentPage,
  onView,
  selectedOrders,
  onSelectionChange,
  onPrintInvoice,
  onChangeStatus,
  onCancelOrder,
  onReturnRefund,
  onReviewReturnRefund,
  onPaymentMethodChange,
  onPaymentStatusChange,
}: Props) {
  const [savingPayment, setSavingPayment] =
    React.useState<string | null>(null);

  const allSelected =
    orders.length > 0 &&
    orders.every((order) => selectedOrders.includes(order._id));

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
      return;
    }

    onSelectionChange(orders.map((order) => order._id));
  };

  const handleSelectOne = (id: string) => {
    if (selectedOrders.includes(id)) {
      onSelectionChange(
        selectedOrders.filter((selectedId) => selectedId !== id)
      );
    } else {
      onSelectionChange([...selectedOrders, id]);
    }
  };

  const handlePaymentMethodChange = async (
    order: Order,
    value: PaymentMethod
  ) => {
    if (!onPaymentMethodChange) return;

    try {
      setSavingPayment(`${order._id}-method`);

      await onPaymentMethodChange(order, value);
    } catch (error) {
      console.error("Failed to update payment method:", error);
      alert("Failed to update payment method");
    } finally {
      setSavingPayment(null);
    }
  };

  const handlePaymentStatusChange = async (
    order: Order,
    value: PaymentStatus
  ) => {
    if (!onPaymentStatusChange) return;

    try {
      setSavingPayment(`${order._id}-status`);

      await onPaymentStatusChange(order, value);
    } catch (error) {
      console.error("Failed to update payment status:", error);
      alert("Failed to update payment status");
    } finally {
      setSavingPayment(null);
    }
  };

  const getOrderStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "processing":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getReturnRefundStatus = (order: Order) => {
    if (!order.returnRefundStatus) {
      return null;
    }

    return order.returnRefundStatus;
  };

  const canCancel = (order: Order) => {
    return (
      order.status !== "cancelled" &&
      order.status !== "delivered"
    );
  };

  const canReturnRefund = (order: Order) => {
    return (
      order.status === "delivered" &&
      !order.returnRefundStatus
    );
  };

  const canReviewReturnRefund = (order: Order) => {
    return (
      order.returnRefundStatus === "requested" ||
      order.returnRefundStatus === "approved" ||
      order.returnRefundStatus === "rejected"
    );
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm font-medium text-slate-600">
          No orders found
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="w-full overflow-x-auto">
        <table className="min-w-326.5 w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              {/* SELECT */}
              <th className="w-12.5 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300"
                />
              </th>

              {/* ORDER */}
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Order
              </th>

              {/* CUSTOMER */}
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Customer
              </th>

              {/* ITEMS */}
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Items
              </th>

              {/* TOTAL */}
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Total
              </th>

              {/* PAYMENT METHOD */}
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Payment Method
              </th>

              {/* PAYMENT STATUS */}
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Payment Status
              </th>

              {/* ORDER STATUS */}
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Status
              </th>

              {/* DATE */}
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Date
              </th>

              {/* ACTION */}
              <th className="px-4 py-3 text-right font-semibold text-slate-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {orders.map((order, index) => {
              const paymentMethod: PaymentMethod =
                order.paymentMethod || "cod";

              const paymentStatus: PaymentStatus =
                order.paymentStatus || "pending";

              const isSelected = selectedOrders.includes(order._id);

              const isLastRowOfPage2 =
                currentPage === 2 &&
                index === orders.length - 1;

              const paymentMethodSaving =
                savingPayment === `${order._id}-method`;

              const paymentStatusSaving =
                savingPayment === `${order._id}-status`;

              return (
                <tr
                  key={order._id}
                  className={`transition hover:bg-slate-50 ${
                    isSelected ? "bg-blue-50/40" : ""
                  }`}
                >
                  {/* SELECT */}
                  <td className="px-4 py-4 align-middle">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectOne(order._id)}
                      className="h-4 w-4 cursor-pointer rounded border-slate-300"
                    />
                  </td>

                  {/* ORDER */}
                  <td className="px-4 py-4 align-middle">
                    <div>
                      <p className="font-semibold text-slate-800">
                        #{order.orderNumber}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {order._id}
                      </p>
                    </div>
                  </td>

                  {/* CUSTOMER */}
                  <td className="px-4 py-4 align-middle">
                    <div>
                      <p className="font-medium text-slate-800">
                        {order.customer?.name || "Unknown Customer"}
                      </p>

                      {order.customer?.email && (
                        <p className="mt-1 text-xs text-slate-400">
                          {order.customer.email}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* ITEMS */}
                  <td className="px-4 py-4 align-middle">
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {order.items?.length || 0} items
                    </span>
                  </td>

                  {/* TOTAL */}
                  <td className="px-4 py-4 align-middle">
                    <p className="font-semibold text-slate-800">
                      ${Number(order.total || 0).toFixed(2)}
                    </p>
                  </td>

                  {/* PAYMENT METHOD */}
                  <td className="px-4 py-4 align-middle">
                    <div className="relative w-31.25">
                      <select
                        value={paymentMethod}
                        disabled={
                          !onPaymentMethodChange ||
                          paymentMethodSaving
                        }
                        onChange={(e) =>
                          handlePaymentMethodChange(
                            order,
                            e.target.value as PaymentMethod
                          )
                        }
                        className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {PAYMENT_METHODS.map((method) => (
                          <option
                            key={method.value}
                            value={method.value}
                          >
                            {method.label}
                          </option>
                        ))}
                      </select>

                      {paymentMethodSaving ? (
                        <Loader2 className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-blue-500" />
                      ) : (
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      )}
                    </div>
                  </td>

                  {/* PAYMENT STATUS */}
                  <td className="px-4 py-4 align-middle">
                    <div className="relative w-31.25">
                      <select
                        value={paymentStatus}
                        disabled={
                          !onPaymentStatusChange ||
                          paymentStatusSaving
                        }
                        onChange={(e) =>
                          handlePaymentStatusChange(
                            order,
                            e.target.value as PaymentStatus
                          )
                        }
                        className={`w-full cursor-pointer appearance-none rounded-lg border px-3 py-2 pr-8 text-sm font-medium outline-none transition focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 ${paymentStatusClasses[paymentStatus]}`}
                      >
                        {PAYMENT_STATUSES.map((status) => (
                          <option
                            key={status.value}
                            value={status.value}
                          >
                            {status.label}
                          </option>
                        ))}
                      </select>

                      {paymentStatusSaving ? (
                        <Loader2 className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />
                      ) : (
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2" />
                      )}
                    </div>
                  </td>

                  {/* ORDER STATUS */}
                  <td className="px-4 py-4 align-middle">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getOrderStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="px-4 py-4 align-middle">
                    <p className="text-sm text-slate-600">
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </p>
                  </td>

                  {/* ACTION */}
                  <td className="px-4 py-4 text-right align-middle">
                    <div
                      className={`relative flex justify-end ${
                        isLastRowOfPage2
                          ? "z-50"
                          : "z-10"
                      }`}
                    >
                      <div className="group relative">
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        <div
                          className={`invisible absolute right-0 w-52 rounded-xl border border-slate-200 bg-white p-1.5 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100 ${
                            isLastRowOfPage2
                              ? "bottom-11"
                              : "top-11"
                          }`}
                        >
                          {/* VIEW */}
                          <button
                            type="button"
                            onClick={() => onView(order)}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Eye className="h-4 w-4" />
                            View Order
                          </button>

                          {/* PRINT */}
                          <button
                            type="button"
                            onClick={() => onPrintInvoice(order)}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Printer className="h-4 w-4" />
                            Print Invoice
                          </button>

                          {/* CHANGE STATUS */}
                          <button
                            type="button"
                            onClick={() =>
                              onChangeStatus(order)
                            }
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Change Status
                          </button>

                          {/* CANCEL */}
                          {canCancel(order) && (
                            <button
                              type="button"
                              onClick={() =>
                                onCancelOrder(order)
                              }
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4" />
                              Cancel Order
                            </button>
                          )}

                          {/* RETURN / REFUND */}
                          {canReturnRefund(order) && (
                            <button
                              type="button"
                              onClick={() =>
                                onReturnRefund(order)
                              }
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-orange-600 hover:bg-orange-50"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Return / Refund
                            </button>
                          )}

                          {/* REVIEW RETURN / REFUND */}
                          {canReviewReturnRefund(order) && (
                            <button
                              type="button"
                              onClick={() =>
                                onReviewReturnRefund(order)
                              }
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-purple-600 hover:bg-purple-50"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Review Return / Refund
                            </button>
                          )}

                          {/* RETURN STATUS */}
                          {getReturnRefundStatus(order) && (
                            <div className="mt-1 border-t border-slate-100 pt-1">
                              <div className="px-3 py-2">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                  Return / Refund
                                </p>

                                <p className="mt-1 text-xs font-semibold capitalize text-slate-700">
                                  {getReturnRefundStatus(order)}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}