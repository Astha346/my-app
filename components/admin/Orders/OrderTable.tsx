"use client";

import {
  Eye,
  MoreHorizontal,
  Printer,
  RotateCcw,
  XCircle,
  CheckCircle,
} from "lucide-react";

import type { Order, ReturnRefundStatus } from "@/types/order";

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
}

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
}: Props) {
  const allSelected =
    orders.length > 0 &&
    orders.every((order) => selectedOrders.includes(order._id));

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange(
        selectedOrders.filter(
          (id) => !orders.some((order) => order._id === id)
        )
      );
    } else {
      const newIds = orders
        .map((order) => order._id)
        .filter((id) => !selectedOrders.includes(id));

      onSelectionChange([...selectedOrders, ...newIds]);
    }
  };

  const toggleOrder = (id: string) => {
    if (selectedOrders.includes(id)) {
      onSelectionChange(
        selectedOrders.filter((selectedId) => selectedId !== id)
      );
    } else {
      onSelectionChange([...selectedOrders, id]);
    }
  };

  const canReturnRefund = (order: Order) => {
    return (
      order.status === "delivered" &&
      (!order.returnRefundStatus ||
        order.returnRefundStatus === "none" ||
        order.returnRefundStatus === "rejected")
    );
  };

  const canReviewReturnRefund = (order: Order) => {
    return order.returnRefundStatus === "requested";
  };

  const getReturnRefundLabel = (
    status?: ReturnRefundStatus
  ): string | null => {
    switch (status) {
      case "requested":
        return "Return Requested";

      case "approved":
        return "Return Approved";

      case "refunded":
        return "Refunded";

      case "rejected":
        return "Return Rejected";

      default:
        return null;
    }
  };

  const getReturnRefundClass = (
    status?: ReturnRefundStatus
  ): string => {
    switch (status) {
      case "requested":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "approved":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "refunded":
        return "bg-green-50 text-green-700 border-green-200";

      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "";
    }
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">
          No orders found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          {/* ================= HEADER ================= */}
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-slate-300"
                />
              </th>

              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Order
              </th>

              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Customer
              </th>

              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Items
              </th>

              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Total
              </th>

              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Payment
              </th>

              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Status
              </th>

              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Date
              </th>

              <th className="w-16 px-4 py-3 text-center font-semibold text-slate-600">
                Action
              </th>
            </tr>
          </thead>

          {/* ================= BODY ================= */}
          <tbody className="divide-y divide-slate-100">
            {orders.map((order, index) => {
              /*
               * Special dropdown positioning:
               *
               * Only the LAST ROW of PAGE 2 opens upward.
               *
               * This prevents the dropdown from going outside
               * the table/container.
               */
              const isLastRowOfPage2 =
                currentPage === 2 &&
                index === orders.length - 1;

              const returnRefundLabel = getReturnRefundLabel(
                order.returnRefundStatus
              );

              return (
                <tr
                  key={order._id}
                  className="group hover:bg-slate-50"
                >
                  {/* ================= CHECKBOX ================= */}
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => toggleOrder(order._id)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                  </td>

                  {/* ================= ORDER ================= */}
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">
                        #{order.orderNumber}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {order._id}
                      </p>
                    </div>
                  </td>

                  {/* ================= CUSTOMER ================= */}
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-slate-800">
                        {order.customer?.name || "Unknown Customer"}
                      </p>

                      <p className="text-xs text-slate-500">
                        {order.customer?.email || "-"}
                      </p>

                      {order.customer?.phone && (
                        <p className="text-xs text-slate-400">
                          {order.customer.phone}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* ================= ITEMS ================= */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      {order.items?.slice(0, 2).map((item) => (
                        <div
                          key={`${order._id}-${item.productId}`}
                          className="flex items-center gap-2"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-8 w-8 rounded-md object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-400">
                              IMG
                            </div>
                          )}

                          <div className="max-w-[180px]">
                            <p className="truncate text-xs font-medium text-slate-700">
                              {item.name}
                            </p>

                            <p className="text-[11px] text-slate-400">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}

                      {order.items && order.items.length > 2 && (
                        <p className="text-xs text-slate-400">
                          +{order.items.length - 2} more item
                          {order.items.length - 2 > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* ================= TOTAL ================= */}
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-800">
                      ${Number(order.total || 0).toFixed(2)}
                    </p>
                  </td>

                  {/* ================= PAYMENT ================= */}
                  <td className="px-4 py-4">
                    <div>
                      <p className="capitalize font-medium text-slate-700">
                        {order.paymentMethod}
                      </p>

                      <span
                        className={`
                          mt-1 inline-flex rounded-full border px-2 py-0.5
                          text-[11px] font-medium
                          ${
                            order.paymentStatus === "paid"
                              ? "border-green-200 bg-green-50 text-green-700"
                              : order.paymentStatus === "failed"
                              ? "border-red-200 bg-red-50 text-red-700"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                          }
                        `}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>

                  {/* ================= STATUS ================= */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <span
                        className={`
                          inline-flex rounded-full px-2.5 py-1
                          text-xs font-medium capitalize
                          ${
                            order.status === "delivered"
                              ? "bg-green-50 text-green-700"
                              : order.status === "cancelled"
                              ? "bg-red-50 text-red-700"
                              : order.status === "shipped"
                              ? "bg-blue-50 text-blue-700"
                              : order.status === "processing"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-amber-50 text-amber-700"
                          }
                        `}
                      >
                        {order.status}
                      </span>

                      {returnRefundLabel && (
                        <div>
                          <span
                            className={`
                              inline-flex rounded-full border px-2 py-0.5
                              text-[10px] font-medium
                              ${getReturnRefundClass(
                                order.returnRefundStatus
                              )}
                            `}
                          >
                            {returnRefundLabel}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* ================= DATE ================= */}
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-700">
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </p>

                    <p className="text-xs text-slate-400">
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </p>
                  </td>

                  {/* ================= ACTION ================= */}
                  <td className="px-4 py-4 text-center">
                    <div className="group relative inline-block">
                      {/* More button */}
                      <button
                        type="button"
                        className="
                          inline-flex h-9 w-9 items-center
                          justify-center rounded-lg
                          border border-transparent
                          text-slate-500
                          transition
                          hover:border-slate-200
                          hover:bg-white
                          hover:text-slate-800
                        "
                        aria-label="Order actions"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>

                      {/* ================= DROPDOWN ================= */}
                      <div
                        className={`
                          invisible
                          absolute
                          right-0
                          z-[100]
                          w-56
                          rounded-xl
                          border
                          border-slate-200
                          bg-white
                          p-1.5
                          text-left
                          opacity-0
                          shadow-xl
                          transition-all
                          duration-150
                          group-hover:visible
                          group-hover:opacity-100

                          ${
                            isLastRowOfPage2
                              ? "bottom-10"
                              : "top-10"
                          }
                        `}
                      >
                        {/* View Order */}
                        <button
                          type="button"
                          onClick={() => onView(order)}
                          className="
                            flex w-full items-center gap-3
                            rounded-lg px-3 py-2.5
                            text-sm text-slate-700
                            hover:bg-slate-100
                          "
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Order</span>
                        </button>

                        {/* Print Invoice */}
                        <button
                          type="button"
                          onClick={() => onPrintInvoice(order)}
                          className="
                            flex w-full items-center gap-3
                            rounded-lg px-3 py-2.5
                            text-sm text-slate-700
                            hover:bg-slate-100
                          "
                        >
                          <Printer className="h-4 w-4" />
                          <span>Print Invoice</span>
                        </button>

                        {/* Change Status */}
                        {order.status !== "cancelled" &&
                          order.status !== "delivered" && (
                            <button
                              type="button"
                              onClick={() => onChangeStatus(order)}
                              className="
                                flex w-full items-center gap-3
                                rounded-lg px-3 py-2.5
                                text-sm text-slate-700
                                hover:bg-slate-100
                              "
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Change Status</span>
                            </button>
                          )}

                        {/* Cancel Order */}
                        {order.status !== "cancelled" &&
                          order.status !== "delivered" && (
                            <button
                              type="button"
                              onClick={() => onCancelOrder(order)}
                              className="
                                flex w-full items-center gap-3
                                rounded-lg px-3 py-2.5
                                text-sm text-red-600
                                hover:bg-red-50
                              "
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Cancel Order</span>
                            </button>
                          )}

                        {/* Divider */}
                        {(canReturnRefund(order) ||
                          canReviewReturnRefund(order)) && (
                          <div className="my-1 border-t border-slate-100" />
                        )}

                        {/* Return / Refund */}
                        {canReturnRefund(order) && (
                          <button
                            type="button"
                            onClick={() => onReturnRefund(order)}
                            className="
                              flex w-full items-center gap-3
                              rounded-lg px-3 py-2.5
                              text-sm text-orange-600
                              hover:bg-orange-50
                            "
                          >
                            <RotateCcw className="h-4 w-4" />
                            <span>Return / Refund</span>
                          </button>
                        )}

                        {/* Review Return / Refund */}
                        {canReviewReturnRefund(order) && (
                          <button
                            type="button"
                            onClick={() =>
                              onReviewReturnRefund(order)
                            }
                            className="
                              flex w-full items-center gap-3
                              rounded-lg px-3 py-2.5
                              text-sm text-blue-600
                              hover:bg-blue-50
                            "
                          >
                            <RotateCcw className="h-4 w-4" />
                            <span>Review Return / Refund</span>
                          </button>
                        )}
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