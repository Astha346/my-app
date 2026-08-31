
"use client";

import React from "react";

import {
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Printer,
  Truck,
  User,
  X,
  RotateCcw,
  Banknote,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";

import {
  Order,
  OrderStatus,
} from "@/types/order";

import OrderStatusBadge from "./OrderStatusBadge";

interface Props {
  order: Order | null;
  open: boolean;
  onClose: () => void;

  onStatusUpdate: (
    orderId: string,
    status: OrderStatus
  ) => void;

  onPrintInvoice: (order: Order) => void;

  /*
   * Called when admin confirms return/refund.
   *
   * mode:
   * "return_refund" = product returned + money refunded
   * "refund_only"   = money refunded without return
   */
  onReturnRefund?: (
    order: Order,
    mode: "return_refund" | "refund_only"
  ) => void;
}

const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderDetailsDialog({
  order,
  open,
  onClose,
  onStatusUpdate,
  onPrintInvoice,
  onReturnRefund,
}: Props) {
  /*
   * Return / Refund dialog state.
   *
   * Hooks are declared before any conditional return.
   * This prevents React Hooks order errors.
   */
  const [returnRefundOpen, setReturnRefundOpen] =
    React.useState(false);

  const [refundMode, setRefundMode] =
    React.useState<
      "return_refund" | "refund_only"
    >("return_refund");

  /*
   * No order selected.
   */
  if (!order) {
    return null;
  }

  /*
   * Find current status index.
   */
  const currentStatusIndex =
    STATUS_FLOW.indexOf(order.status);

  /*
   * Find next status.
   *
   * pending     -> confirmed
   * confirmed   -> processing
   * processing  -> shipped
   * shipped     -> delivered
   * delivered   -> no next status
   * cancelled   -> no next status
   */
  let nextStatus: OrderStatus | null = null;

  if (
    order.status !== "cancelled" &&
    order.status !== "delivered"
  ) {
    if (currentStatusIndex >= 0) {
      nextStatus =
        STATUS_FLOW[currentStatusIndex + 1] ?? null;
    }
  }

  /*
   * Return / Refund is available only after
   * delivery or cancellation.
   */
  const canReturnRefund =
    order.status === "delivered" ||
    order.status === "cancelled";

  /*
   * Open return/refund confirmation dialog.
   */
  const handleOpenReturnRefund = () => {
    setRefundMode("return_refund");
    setReturnRefundOpen(true);
  };

  /*
   * Confirm return/refund.
   */
  const handleConfirmReturnRefund = () => {
    if (!onReturnRefund) {
      setReturnRefundOpen(false);
      return;
    }

    onReturnRefund(
      order,
      refundMode
    );

    setReturnRefundOpen(false);
  };

  /*
   * Update order status.
   */
  const handleStatusUpdate = () => {
    if (!nextStatus) {
      return;
    }

    onStatusUpdate(
      order._id,
      nextStatus
    );

    onClose();
  };

  /*
   * Format date.
   */
  const formattedDate = new Date(
    order.createdAt
  ).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  /*
   * Format price.
   */
  const formatPrice = (value: number) => {
    return `Rs. ${value.toLocaleString("en-IN")}`;
  };

  /*
   * Payment method.
   */
  const paymentMethodLabel = {
    cod: "Cash on Delivery",
    esewa: "eSewa",
    khalti: "Khalti",
  }[order.paymentMethod];

  /*
   * Payment status styling.
   */
  const paymentStatusClass = {
    paid: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    failed: "bg-red-50 text-red-700",
  }[order.paymentStatus];

  return (
    <>
      {/* ====================================================== */}
      {/* ORDER DETAILS DIALOG */}
      {/* ====================================================== */}

      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!value) {
            onClose();
          }
        }}
      >
        <DialogContent
          className="
            w-[96vw]
            max-w-375
            h-[92vh]
            overflow-hidden
            rounded-2xl
            border-0
            bg-white
            p-0
            gap-0
            shadow-2xl
          "
        >
          {/* ====================================================== */}
          {/* HEADER */}
          {/* ====================================================== */}

          <div className="flex shrink-0 items-center justify-between border-b px-8 py-5">
            <DialogHeader className="space-y-0 text-left">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900">
                  <Package className="h-5 w-5 text-white" />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <DialogTitle className="text-xl font-bold text-slate-900">
                      {order.orderNumber}
                    </DialogTitle>

                    <OrderStatusBadge
                      status={order.status}
                    />
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Order placed on {formattedDate}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <button
              type="button"
              onClick={onClose}
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-lg
                border border-slate-200
                text-slate-500
                transition
                hover:bg-slate-100
                hover:text-slate-900
              "
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ====================================================== */}
          {/* SCROLLABLE CONTENT */}
          {/* ====================================================== */}

          <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50">
            <div className="space-y-5 p-6 lg:p-8">

              {/* ================================================== */}
              {/* ORDER PROGRESS */}
              {/* ================================================== */}

              <div className="rounded-xl border border-slate-200 bg-white">
                <div className="px-7 py-6">

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Order Progress
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Current order fulfillment status
                      </p>
                    </div>

                    <span className="text-xs font-medium text-slate-400">
                      {order.status === "cancelled"
                        ? "Cancelled"
                        : order.status === "delivered"
                        ? "Completed"
                        : `Step ${
                            currentStatusIndex + 1
                          } of ${STATUS_FLOW.length}`}
                    </span>
                  </div>

                  {order.status === "cancelled" ? (
                    <div className="mt-6 flex items-center rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                        <X className="h-4 w-4 text-red-600" />
                      </div>

                      <div className="ml-3">
                        <p className="text-sm font-semibold text-red-700">
                          Order Cancelled
                        </p>

                        <p className="text-xs text-red-600">
                          This order can no longer be progressed.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-8">
                      <div className="relative">

                        {/* Base line */}

                        <div className="absolute left-[10%] right-[10%] top-4 h-0.5 bg-slate-200" />

                        {/* Progress line */}

                        {currentStatusIndex > 0 && (
                          <div
                            className="absolute left-[10%] top-4 h-0.5 bg-emerald-500"
                            style={{
                              width: `${
                                (currentStatusIndex /
                                  (STATUS_FLOW.length - 1)) *
                                80
                              }%`,
                            }}
                          />
                        )}

                        {/* Steps */}

                        <div className="relative grid grid-cols-5">
                          {STATUS_FLOW.map(
                            (step, index) => {
                              const completed =
                                index <=
                                currentStatusIndex;

                              const active =
                                index ===
                                currentStatusIndex;

                              return (
                                <div
                                  key={step}
                                  className="flex flex-col items-center"
                                >
                                  <div
                                    className={`
                                      flex h-8 w-8
                                      items-center justify-center
                                      rounded-full
                                      border-2
                                      bg-white
                                      ${
                                        completed
                                          ? "border-emerald-500 bg-emerald-500 text-white"
                                          : "border-slate-200 text-slate-400"
                                      }
                                      ${
                                        active
                                          ? "ring-4 ring-emerald-50"
                                          : ""
                                      }
                                    `}
                                  >
                                    {completed ? (
                                      <Check className="h-3.5 w-3.5" />
                                    ) : (
                                      <span className="h-2 w-2 rounded-full bg-slate-300" />
                                    )}
                                  </div>

                                  <span
                                    className={`
                                      mt-3 text-xs
                                      ${
                                        completed
                                          ? "font-semibold text-slate-900"
                                          : "text-slate-400"
                                      }
                                    `}
                                  >
                                    {
                                      STATUS_LABELS[
                                        step
                                      ]
                                    }
                                  </span>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ================================================== */}
              {/* CUSTOMER / SHIPPING / PAYMENT */}
              {/* ================================================== */}

              <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-slate-200 bg-white lg:grid-cols-3">

                {/* CUSTOMER */}

                <div className="border-b p-6 lg:border-b-0 lg:border-r">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Customer
                      </h3>

                      <p className="text-xs text-slate-500">
                        Customer details
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Name
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {order.customer.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm text-slate-600">
                        {order.customer.email}
                      </p>
                    </div>

                    {order.customer.phone && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Phone
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {order.customer.phone}
                        </p>
                      </div>
                    )}

                  </div>
                </div>

                {/* SHIPPING */}

                <div className="border-b p-6 lg:border-b-0 lg:border-r">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                      <MapPin className="h-4 w-4 text-orange-600" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Shipping Address
                      </h3>

                      <p className="text-xs text-slate-500">
                        Delivery information
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-lg bg-slate-50 p-4">
                    <p className="text-sm font-medium leading-6 text-slate-900">
                      {order.shippingAddress.address}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>

                {/* PAYMENT */}

                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                      <CreditCard className="h-4 w-4 text-emerald-600" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Payment
                      </h3>

                      <p className="text-xs text-slate-500">
                        Payment information
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Method
                      </span>

                      <span className="text-sm font-medium text-slate-900">
                        {paymentMethodLabel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Status
                      </span>

                      <span
                        className={`
                          rounded-full
                          px-2.5 py-1
                          text-xs font-semibold
                          capitalize
                          ${paymentStatusClass}
                        `}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>

                  </div>
                </div>
              </div>

              {/* ================================================== */}
              {/* ORDER ITEMS */}
              {/* ================================================== */}

              <div className="rounded-xl border border-slate-200 bg-white">
                <div className="p-7">

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Order Items
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {order.items.length}{" "}
                        {order.items.length === 1
                          ? "item"
                          : "items"}{" "}
                        in this order
                      </p>
                    </div>

                    <Package className="h-5 w-5 text-slate-300" />
                  </div>

                  <Separator className="my-5" />

                  <div className="overflow-x-auto">
                    <div className="min-w-175">

                      {/* TABLE HEADER */}

                      <div className="grid grid-cols-12 border-b border-slate-100 pb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                        <div className="col-span-6">
                          Product
                        </div>

                        <div className="col-span-2 text-center">
                          Quantity
                        </div>

                        <div className="col-span-2 text-right">
                          Unit Price
                        </div>

                        <div className="col-span-2 text-right">
                          Total
                        </div>

                      </div>

                      {/* TABLE ROWS */}

                      {order.items.map(
                        (item, index) => {
                          const itemTotal =
                            item.price *
                            item.quantity;

                          return (
                            <div
                              key={`${item.productId}-${index}`}
                              className="
                                grid grid-cols-12
                                items-center
                                border-b
                                border-slate-100
                                py-4
                                last:border-0
                              "
                            >

                              {/* PRODUCT */}

                              <div className="col-span-6 flex items-center gap-3">

                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="
                                      h-12
                                      w-12
                                      rounded-lg
                                      border
                                      border-slate-200
                                      object-cover
                                    "
                                  />
                                ) : (
                                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                                    <Package className="h-5 w-5 text-slate-400" />
                                  </div>
                                )}

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium text-slate-900">
                                    {item.name}
                                  </p>

                                  <p className="mt-0.5 text-xs text-slate-400">
                                    ID: {item.productId}
                                  </p>
                                </div>

                              </div>

                              {/* QUANTITY */}

                              <div className="col-span-2 text-center">
                                <span className="inline-flex min-w-8 items-center justify-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                                  {item.quantity}
                                </span>
                              </div>

                              {/* UNIT PRICE */}

                              <div className="col-span-2 text-right text-sm text-slate-600">
                                {formatPrice(
                                  item.price
                                )}
                              </div>

                              {/* TOTAL */}

                              <div className="col-span-2 text-right text-sm font-semibold text-slate-900">
                                {formatPrice(
                                  itemTotal
                                )}
                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>
                  </div>
                </div>
              </div>

              {/* ================================================== */}
              {/* ORDER TOTALS */}
              {/* ================================================== */}

              <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white md:grid-cols-4">

                <div className="border-b p-5 md:border-b-0 md:border-r">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Subtotal
                  </p>

                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {formatPrice(
                      order.subtotal
                    )}
                  </p>
                </div>

                <div className="border-b p-5 md:border-b-0 md:border-r">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Shipping
                  </p>

                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {formatPrice(
                      order.shipping
                    )}
                  </p>
                </div>

                <div className="border-r p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Discount
                  </p>

                  <p className="mt-2 text-lg font-semibold text-red-500">
                    - {formatPrice(
                      order.discount
                    )}
                  </p>
                </div>

                <div className="bg-slate-900 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Grand Total
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    {formatPrice(
                      order.total
                    )}
                  </p>
                </div>

              </div>

              {/* ================================================== */}
              {/* RETURN / REFUND */}
              {/* ================================================== */}

              {canReturnRefund && (
                <div className="overflow-hidden rounded-xl border border-orange-200 bg-orange-50">
                  <div className="flex flex-col gap-5 px-7 py-6 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex items-center gap-4">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                        <RotateCcw className="h-5 w-5 text-orange-600" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          Return / Refund
                        </h3>

                        <p className="mt-1 text-xs text-slate-600">
                          {order.status === "delivered"
                            ? "This order is eligible for return or refund."
                            : "This cancelled order can be refunded."}
                        </p>
                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={handleOpenReturnRefund}
                      className="
                        flex h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-orange-600
                        px-5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-orange-700
                      "
                    >
                      <RotateCcw className="h-4 w-4" />
                      Return / Refund
                    </button>

                  </div>
                </div>
              )}

              {/* ================================================== */}
              {/* STATUS UPDATE */}
              {/* ================================================== */}

              <div className="overflow-hidden rounded-xl bg-slate-900">
                <div className="flex flex-col gap-5 px-7 py-6 lg:flex-row lg:items-center lg:justify-between">

                  {/* LEFT */}

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <Truck className="h-5 w-5 text-white" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Update Order Status
                      </h3>

                      {nextStatus ? (
                        <p className="mt-1 text-xs text-slate-400">

                          Current:{" "}

                          <span className="font-medium text-slate-300">
                            {
                              STATUS_LABELS[
                                order.status
                              ]
                            }
                          </span>

                          <ChevronRight className="mx-1 inline h-3 w-3" />

                          Next:{" "}

                          <span className="font-medium text-white">
                            {
                              STATUS_LABELS[
                                nextStatus
                              ]
                            }
                          </span>

                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-slate-400">

                          {order.status ===
                          "delivered"
                            ? "This order has been delivered."
                            : "This order cannot be progressed further."}

                        </p>
                      )}
                    </div>

                  </div>

                  {/* RIGHT */}

                  <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

                    {/* STATUS DROPDOWN */}

                    <Select
                      value={nextStatus ?? ""}
                      disabled={!nextStatus}
                      onValueChange={(value) => {

                        if (!nextStatus) {
                          return;
                        }

                        if (value !== nextStatus) {
                          return;
                        }

                        onStatusUpdate(
                          order._id,
                          nextStatus
                        );

                        onClose();
                      }}
                    >
                      <SelectTrigger
                        className="
                          h-10
                          w-full
                          border-slate-700
                          bg-slate-800
                          text-white
                          sm:w-55
                          hover:bg-slate-700
                          focus:ring-2
                          focus:ring-white/20
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        <SelectValue
                          placeholder={
                            nextStatus
                              ? `Move to ${STATUS_LABELS[nextStatus]}`
                              : STATUS_LABELS[
                                  order.status
                                ]
                          }
                        />
                      </SelectTrigger>

                      <SelectContent className="z-9999">
                        {nextStatus ? (
                          <SelectItem
                            value={nextStatus}
                            className="cursor-pointer"
                          >
                            Move to{" "}
                            {
                              STATUS_LABELS[
                                nextStatus
                              ]
                            }
                          </SelectItem>
                        ) : (
                          <SelectItem
                            value={order.status}
                            disabled
                          >
                            {
                              STATUS_LABELS[
                                order.status
                              ]
                            }
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>

                    {/* UPDATE BUTTON */}

                    <button
                      type="button"
                      onClick={handleStatusUpdate}
                      disabled={!nextStatus}
                      className="
                        flex h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-white
                        px-5
                        text-sm
                        font-semibold
                        text-slate-900
                        transition
                        hover:bg-slate-100
                        disabled:cursor-not-allowed
                        disabled:bg-slate-700
                        disabled:text-slate-400
                      "
                    >
                      <Check className="h-4 w-4" />

                      {nextStatus
                        ? `Move to ${STATUS_LABELS[nextStatus]}`
                        : "No Further Update"}
                    </button>

                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ====================================================== */}
          {/* FOOTER */}
          {/* ====================================================== */}

          <div className="flex shrink-0 items-center justify-between border-t bg-white px-8 py-4">

            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
              <Clock className="h-3.5 w-3.5" />
              Created {formattedDate}
            </div>

            <div className="ml-auto flex items-center gap-3">

              {/* PRINT */}

              <button
                type="button"
                onClick={() =>
                  onPrintInvoice(order)
                }
                className="
                  flex h-9
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-slate-200
                  px-4
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-50
                "
              >
                <Printer className="h-4 w-4" />
                Print Invoice
              </button>

              {/* CLOSE */}

              <button
                type="button"
                onClick={onClose}
                className="
                  flex h-9
                  items-center
                  gap-2
                  rounded-lg
                  bg-slate-900
                  px-5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-slate-800
                "
              >
                <X className="h-4 w-4" />
                Close
              </button>

            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ====================================================== */}
      {/* RETURN / REFUND CONFIRMATION DIALOG */}
      {/* ====================================================== */}

      <Dialog
        open={returnRefundOpen}
        onOpenChange={setReturnRefundOpen}
      >
        <DialogContent className="max-w-md rounded-2xl">

          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <RotateCcw className="h-5 w-5 text-orange-600" />
              </div>

              Return / Refund Order
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">
                {order.orderNumber}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Refund amount
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {formatPrice(order.total)}
              </p>
            </div>

            {/* OPTIONS */}

            <div className="space-y-3">

              {/* RETURN + REFUND */}

              <button
                type="button"
                onClick={() =>
                  setRefundMode("return_refund")
                }
                className={`
                  w-full
                  rounded-xl
                  border
                  p-4
                  text-left
                  transition
                  ${
                    refundMode === "return_refund"
                      ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                      : "border-slate-200 hover:bg-slate-50"
                  }
                `}
              >
                <div className="flex items-start gap-3">

                  <div
                    className={`
                      mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border
                      ${
                        refundMode ===
                        "return_refund"
                          ? "border-orange-600 bg-orange-600"
                          : "border-slate-300"
                      }
                    `}
                  >
                    {refundMode ===
                      "return_refund" && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Return & Refund
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Customer returns the product and receives a refund.
                    </p>
                  </div>

                </div>
              </button>

              {/* REFUND ONLY */}

              <button
                type="button"
                onClick={() =>
                  setRefundMode("refund_only")
                }
                className={`
                  w-full
                  rounded-xl
                  border
                  p-4
                  text-left
                  transition
                  ${
                    refundMode === "refund_only"
                      ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                      : "border-slate-200 hover:bg-slate-50"
                  }
                `}
              >
                <div className="flex items-start gap-3">

                  <div
                    className={`
                      mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border
                      ${
                        refundMode ===
                        "refund_only"
                          ? "border-orange-600 bg-orange-600"
                          : "border-slate-300"
                      }
                    `}
                  >
                    {refundMode ===
                      "refund_only" && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Refund Only
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Refund the customer without requiring the product to be returned.
                    </p>
                  </div>

                </div>
              </button>

            </div>

            {/* WARNING */}

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs leading-5 text-amber-700">
                Please verify the customer's request before processing the refund. This action should only be performed when the order is eligible.
              </p>
            </div>

            {/* ACTIONS */}

            <div className="flex justify-end gap-3 border-t pt-4">

              <button
                type="button"
                onClick={() =>
                  setReturnRefundOpen(false)
                }
                className="
                  h-10
                  rounded-lg
                  border
                  border-slate-200
                  px-4
                  text-sm
                  font-medium
                  text-slate-700
                  hover:bg-slate-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleConfirmReturnRefund
                }
                className="
                  flex
                  h-10
                  items-center
                  gap-2
                  rounded-lg
                  bg-orange-600
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-orange-700
                "
              >
                <Banknote className="h-4 w-4" />

                Confirm Refund
              </button>

            </div>

          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
