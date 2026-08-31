
"use client";

import {
  Check,
  ClipboardCheck,
  Eye,
  MoreHorizontal,
  PackageCheck,
  Printer,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { Order } from "@/types/order";
import OrderStatusBadge from "./OrderStatusBadge";
import ReturnRefundStatusBadge from "./ReturnRefundStatus";

interface Props {
  orders: Order[];

  onView: (order: Order) => void;

  selectedOrders: string[];

  onSelectionChange: (orderIds: string[]) => void;

  onPrintInvoice?: (order: Order) => void;

  onChangeStatus?: (order: Order) => void;

  onCancelOrder?: (order: Order) => void;

  onReturnRefund?: (order: Order) => void;

  onReviewReturnRefund?: (order: Order) => void;
}

const PAYMENT_METHOD_LABELS = {
  cod: "Cash on Delivery",
  esewa: "eSewa",
  khalti: "Khalti",
} as const;

const PAYMENT_STATUS_LABELS = {
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
} as const;

export default function OrderTable({
  orders,
  onView,
  selectedOrders,
  onSelectionChange,
  onPrintInvoice,
  onChangeStatus,
  onCancelOrder,
  onReturnRefund,
  onReviewReturnRefund,
}: Props) {
  /* =========================================================
     SELECTION
  ========================================================= */

  const allSelected =
    orders.length > 0 &&
    orders.every((order) =>
      selectedOrders.includes(order._id)
    );

  const someSelected =
    orders.some((order) =>
      selectedOrders.includes(order._id)
    ) && !allSelected;

  /* =========================================================
     SELECT ALL
  ========================================================= */

  const handleSelectAll = () => {
    const visibleIds = orders.map(
      (order) => order._id
    );

    if (allSelected) {
      onSelectionChange(
        selectedOrders.filter(
          (id) => !visibleIds.includes(id)
        )
      );

      return;
    }

    const newSelection = [
      ...selectedOrders,
      ...visibleIds.filter(
        (id) => !selectedOrders.includes(id)
      ),
    ];

    onSelectionChange(newSelection);
  };

  /* =========================================================
     SELECT ONE
  ========================================================= */

  const handleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      onSelectionChange(
        selectedOrders.filter(
          (id) => id !== orderId
        )
      );

      return;
    }

    onSelectionChange([
      ...selectedOrders,
      orderId,
    ]);
  };

  /* =========================================================
     PRICE
  ========================================================= */

  const formatPrice = (value: number) => {
    return `Rs. ${value.toLocaleString("en-IN")}`;
  };

  /* =========================================================
     DATE
  ========================================================= */

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     PAYMENT STATUS
  ========================================================= */

  const getPaymentStatusClass = (
    paymentStatus: Order["paymentStatus"]
  ) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-emerald-50 text-emerald-700";

      case "pending":
        return "bg-amber-50 text-amber-700";

      case "failed":
        return "bg-red-50 text-red-700";

      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  /* =========================================================
     RETURN / REFUND
  ========================================================= */

  const canReturnRefund = (order: Order) => {
    return (
      order.status === "delivered" &&
      (!order.returnRefundStatus ||
        order.returnRefundStatus === "none" ||
        order.returnRefundStatus === "rejected")
    );
  };

  /* =========================================================
     REVIEW RETURN / REFUND
  ========================================================= */

  const canReviewReturnRefund = (order: Order) => {
    return (
      order.returnRefundStatus === "requested"
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="w-full min-w-[1200px] text-sm">

          {/* =====================================================
              HEADER
          ====================================================== */}

          <thead className="border-b border-slate-200 bg-slate-50">

            <tr>

              {/* SELECT */}

              <th className="w-14 px-5 py-4">

                <button
                  type="button"
                  onClick={handleSelectAll}
                  aria-label="Select all orders"
                  className={`
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded
                    border
                    ${
                      allSelected || someSelected
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 bg-white"
                    }
                  `}
                >
                  {allSelected && (
                    <Check className="h-3.5 w-3.5" />
                  )}

                  {someSelected &&
                    !allSelected && (
                      <div className="h-0.5 w-2.5 rounded bg-white" />
                    )}
                </button>

              </th>

              {/* ORDER */}

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                Order
              </th>

              {/* CUSTOMER */}

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                Customer
              </th>

              {/* DATE */}

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                Date
              </th>

              {/* ITEMS */}

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase text-slate-500">
                Items
              </th>

              {/* AMOUNT */}

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                Amount
              </th>

              {/* PAYMENT */}

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                Payment
              </th>

              {/* ORDER STATUS */}

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                Status
              </th>

              {/* RETURN / REFUND STATUS */}

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                Return / Refund
              </th>

              {/* ACTION */}

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase text-slate-500">
                Action
              </th>

            </tr>

          </thead>

          {/* =====================================================
              BODY
          ====================================================== */}

          <tbody className="divide-y divide-slate-100">

            {orders.map((order) => {

              const isSelected =
                selectedOrders.includes(
                  order._id
                );

              const totalItems =
                order.items.reduce(
                  (sum, item) =>
                    sum + item.quantity,
                  0
                );

              const showReturnRefund =
                canReturnRefund(order);

              const showReviewReturnRefund =
                canReviewReturnRefund(order);

              return (
                <tr
                  key={order._id}
                  className={
                    isSelected
                      ? "bg-slate-50"
                      : "hover:bg-slate-50/70"
                  }
                >

                  {/* =================================================
                      CHECKBOX
                  ================================================== */}

                  <td className="px-5 py-4">

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectOrder(
                          order._id
                        )
                      }
                      aria-label={`Select ${order.orderNumber}`}
                      className={`
                        flex
                        h-5
                        w-5
                        items-center
                        justify-center
                        rounded
                        border
                        ${
                          isSelected
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-300 bg-white"
                        }
                      `}
                    >
                      {isSelected && (
                        <Check className="h-3.5 w-3.5" />
                      )}
                    </button>

                  </td>

                  {/* =================================================
                      ORDER
                  ================================================== */}

                  <td className="px-5 py-4">

                    <button
                      type="button"
                      onClick={() =>
                        onView(order)
                      }
                      className="font-semibold text-slate-900 hover:text-blue-600"
                    >
                      {order.orderNumber}
                    </button>

                    <p className="mt-1 text-xs text-slate-400">
                      ID: {order._id}
                    </p>

                  </td>

                  {/* =================================================
                      CUSTOMER
                  ================================================== */}

                  <td className="px-5 py-4">

                    <p className="font-medium text-slate-900">
                      {order.customer.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {order.customer.email}
                    </p>

                    {order.customer.phone && (
                      <p className="mt-1 text-xs text-slate-400">
                        {order.customer.phone}
                      </p>
                    )}

                  </td>

                  {/* =================================================
                      DATE
                  ================================================== */}

                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">

                    {formatDate(
                      order.createdAt
                    )}

                  </td>

                  {/* =================================================
                      ITEMS
                  ================================================== */}

                  <td className="px-5 py-4 text-center">

                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs">
                      {totalItems}
                    </span>

                  </td>

                  {/* =================================================
                      AMOUNT
                  ================================================== */}

                  <td className="whitespace-nowrap px-5 py-4 text-right">

                    <span className="font-semibold">
                      {formatPrice(
                        order.total
                      )}
                    </span>

                  </td>

                  {/* =================================================
                      PAYMENT
                  ================================================== */}

                  <td className="px-5 py-4">

                    <p className="font-medium text-slate-900">
                      {
                        PAYMENT_METHOD_LABELS[
                          order.paymentMethod
                        ]
                      }
                    </p>

                    <span
                      className={`
                        mt-1
                        inline-flex
                        rounded-full
                        px-2
                        py-0.5
                        text-[10px]
                        font-semibold
                        ${getPaymentStatusClass(
                          order.paymentStatus
                        )}
                      `}
                    >
                      {
                        PAYMENT_STATUS_LABELS[
                          order.paymentStatus
                        ]
                      }
                    </span>

                  </td>

                  {/* =================================================
                      ORDER STATUS
                  ================================================== */}

                  <td className="px-5 py-4">

                    <OrderStatusBadge
                      status={order.status}
                    />

                  </td>

                  {/* =================================================
                      RETURN / REFUND STATUS
                  ================================================== */}

                  <td className="px-5 py-4">

                    <ReturnRefundStatusBadge
                      status={
                        order.returnRefundStatus
                      }
                    />

                  </td>

                  {/* =================================================
                      ACTION
                  ================================================== */}

                  <td className="px-5 py-4">

                    <div className="flex justify-center gap-1">

                      {/* VIEW */}

                      <button
                        type="button"
                        onClick={() =>
                          onView(order)
                        }
                        title="View order"
                        aria-label="View order"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          text-slate-500
                          hover:bg-blue-50
                          hover:text-blue-600
                        "
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* MORE */}

                      <div className="group relative">

                        <button
                          type="button"
                          title="More actions"
                          aria-label="More actions"
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-500
                            hover:bg-slate-100
                            hover:text-slate-900
                          "
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>

                        {/* =================================================
                            DROPDOWN
                        ================================================== */}

                        <div
                          className="
                            invisible
                            absolute
                            right-0
                            top-10
                            z-50
                            w-56
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-1.5
                            opacity-0
                            shadow-xl
                            transition-all
                            duration-150
                            group-hover:visible
                            group-hover:opacity-100
                          "
                        >

                          {/* VIEW DETAILS */}

                          <button
                            type="button"
                            onClick={() =>
                              onView(order)
                            }
                            className="
                              flex
                              w-full
                              items-center
                              gap-3
                              rounded-lg
                              px-3
                              py-2.5
                              text-left
                              text-sm
                              hover:bg-slate-50
                            "
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </button>

                          {/* CHANGE STATUS */}

                          <button
                            type="button"
                            onClick={() =>
                              onChangeStatus?.(
                                order
                              )
                            }
                            className="
                              flex
                              w-full
                              items-center
                              gap-3
                              rounded-lg
                              px-3
                              py-2.5
                              text-left
                              text-sm
                              hover:bg-slate-50
                            "
                          >
                            <PackageCheck className="h-4 w-4" />
                            Change Status
                          </button>

                          {/* PRINT INVOICE */}

                          <button
                            type="button"
                            onClick={() =>
                              onPrintInvoice?.(
                                order
                              )
                            }
                            className="
                              flex
                              w-full
                              items-center
                              gap-3
                              rounded-lg
                              px-3
                              py-2.5
                              text-left
                              text-sm
                              hover:bg-slate-50
                            "
                          >
                            <Printer className="h-4 w-4" />
                            Print Invoice
                          </button>

                          {/* RETURN / REFUND */}

                          {showReturnRefund && (
                            <button
                              type="button"
                              onClick={() =>
                                onReturnRefund?.(
                                  order
                                )
                              }
                              className="
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-lg
                                px-3
                                py-2.5
                                text-left
                                text-sm
                                text-orange-600
                                hover:bg-orange-50
                              "
                            >
                              <RotateCcw className="h-4 w-4" />

                              Return / Refund
                            </button>
                          )}

                          {/* REVIEW RETURN / REFUND */}

                          {showReviewReturnRefund && (
                            <button
                              type="button"
                              onClick={() =>
                                onReviewReturnRefund?.(
                                  order
                                )
                              }
                              className="
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-lg
                                px-3
                                py-2.5
                                text-left
                                text-sm
                                font-medium
                                text-blue-600
                                hover:bg-blue-50
                              "
                            >
                              <ClipboardCheck className="h-4 w-4" />

                              Review Return / Refund
                            </button>
                          )}

                          <div className="my-1 border-t border-slate-100" />

                          {/* CANCEL */}

                          {order.status !== "cancelled" &&
                            order.status !== "delivered" && (

                              <button
                                type="button"
                                onClick={() =>
                                  onCancelOrder?.(
                                    order
                                  )
                                }
                                className="
                                  flex
                                  w-full
                                  items-center
                                  gap-3
                                  rounded-lg
                                  px-3
                                  py-2.5
                                  text-left
                                  text-sm
                                  text-red-600
                                  hover:bg-red-50
                                "
                              >
                                <XCircle className="h-4 w-4" />

                                Cancel Order
                              </button>

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

      {/* =========================================================
          EMPTY STATE
      ========================================================== */}

      {orders.length === 0 && (

        <div className="p-16 text-center">

          <Eye className="mx-auto h-8 w-8 text-slate-300" />

          <h3 className="mt-4 font-semibold">
            No orders found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            There are no orders matching your filters.
          </p>

        </div>

      )}

    </div>
  );
}

