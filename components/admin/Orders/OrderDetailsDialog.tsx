
"use client";

import React, { useState } from "react";
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
import type { Order } from "@/types/order";
import OrderStatusBadge from "./OrderStatusBadge";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type ReturnRefundMode = "return-refund" | "refund-only";

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
  onPrintInvoice: (order: Order) => void;
  onReturnRefund?: (
    order: Order,
    mode: ReturnRefundMode
  ) => void;
}

const statusFlow: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const formatPrice = (value?: number | null) =>
  `Rs. ${(value ?? 0).toLocaleString("en-IN")}`;

export default function OrderDetailsDialog({
  order,
  open,
  onClose,
  onStatusUpdate,
  onPrintInvoice,
  onReturnRefund,
}: OrderDetailsDialogProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus>("pending");

  const [returnRefundOpen, setReturnRefundOpen] =
    useState(false);

  const [returnRefundMode, setReturnRefundMode] =
    useState<ReturnRefundMode>("return-refund");

  if (!order) return null;

  const orderData = order as any;

  const currentStatus = (orderData.status ??
    "pending") as OrderStatus;

  const currentStatusIndex = statusFlow.indexOf(currentStatus);

  const nextStatus =
    currentStatusIndex >= 0 &&
    currentStatusIndex < statusFlow.length - 1
      ? statusFlow[currentStatusIndex + 1]
      : null;

  const displayOrderNumber =
    orderData.orderNumber ??
    orderData._id ??
    orderData.id ??
    "N/A";

  const customer = orderData.user ?? orderData.customer ?? {};

  const customerName =
    customer.name ??
    customer.username ??
    orderData.customerName ??
    "N/A";

  const customerEmail =
    customer.email ?? orderData.email ?? "N/A";

  const customerPhone =
    customer.phone ?? orderData.phone ?? "N/A";

  const shippingAddress =
    orderData.deliveryAddress ??
    orderData.shippingAddress ??
    orderData.address ??
    {};

  const addressText =
    typeof shippingAddress === "string"
      ? shippingAddress
      : [
          shippingAddress.address,
          shippingAddress.street,
          shippingAddress.city,
          shippingAddress.state,
          shippingAddress.postalCode,
        ]
          .filter(Boolean)
          .join(", ") || "No address provided";

  const items = orderData.items ?? orderData.orderItems ?? [];

  const subtotal =
    orderData.subtotal ??
    items.reduce(
      (total: number, item: any) =>
        total +
        (item.price ?? item.product?.price ?? 0) *
          (item.quantity ?? 1),
      0
    );

  const shippingCost =
    orderData.shippingCost ??
    orderData.deliveryCharge ??
    orderData.shippingFee ??
    0;

  const discount = orderData.discount ?? 0;

  const total =
    orderData.totalAmount ??
    orderData.total ??
    subtotal + shippingCost - discount;

  const paymentMethod =
    orderData.paymentMethod ?? "N/A";

  const paymentStatus =
    orderData.paymentStatus ?? "pending";

  const canReturnRefund =
    currentStatus === "delivered" ||
    currentStatus === "cancelled";

  const handleStatusUpdate = () => {
    if (!selectedStatus || selectedStatus === currentStatus) {
      return;
    }

    onStatusUpdate(
      String(orderData._id ?? orderData.id),
      selectedStatus
    );
  };

  const handleMoveToNextStatus = () => {
    if (!nextStatus) return;

    setSelectedStatus(nextStatus);

    onStatusUpdate(
      String(orderData._id ?? orderData.id),
      nextStatus
    );
  };

  const handleOpenReturnRefund = (
    mode: ReturnRefundMode
  ) => {
    setReturnRefundMode(mode);
    setReturnRefundOpen(true);
  };

  const handleConfirmReturnRefund = () => {
    if (!onReturnRefund) return;

    onReturnRefund(order, returnRefundMode);
    setReturnRefundOpen(false);
  };

  const getItemName = (item: any) =>
    item.product?.name ??
    item.productName ??
    item.name ??
    "Product";

  const getItemPrice = (item: any) =>
    item.price ?? item.product?.price ?? 0;

  const getItemQuantity = (item: any) =>
    item.quantity ?? 1;

  return (
    <>
      <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
        <DialogContent
          showCloseButton={false}
          className="!fixed !left-1/2 !top-1/2 !flex !h-[78vh] !max-h-[78vh] !w-[88vw] !max-w-[1050px] !min-w-0 !-translate-x-1/2 !-translate-y-1/2 !flex-col !gap-0 !overflow-hidden !rounded-xl !border !border-slate-200 !bg-slate-50 !p-0 !shadow-xl dark:!border-slate-700 dark:!bg-slate-950"
        >
          {/* Header */}
          <DialogHeader className="flex shrink-0 flex-row items-center justify-between border-b border-slate-200 px-5 py-3 text-left dark:border-slate-700">
            <div className="min-w-0">
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Order Details
              </DialogTitle>
              <p className="mt-1 truncate text-xs text-slate-500">
                Order #{String(displayOrderNumber)}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close order details"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X size={18} />
            </button>
          </DialogHeader>

          {/* Scrollable content */}
          <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
            <div className="space-y-4 p-4">
              {/* Order status progress */}
              <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Order Progress
                  </h3>

                  <OrderStatusBadge status={currentStatus} />
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {statusFlow.map((status, index) => {
                    const completed =
                      currentStatusIndex >= index &&
                      currentStatus !== "cancelled";

                    const active = currentStatus === status;

                    return (
                      <div
                        key={status}
                        className="flex min-w-0 flex-col items-center text-center"
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            completed
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                          }`}
                        >
                          {completed ? (
                            <Check size={16} />
                          ) : index === 0 ? (
                            <Clock size={16} />
                          ) : index === 1 ? (
                            <Check size={16} />
                          ) : index === 2 ? (
                            <Package size={16} />
                          ) : (
                            <Truck size={16} />
                          )}
                        </div>

                        <span
                          className={`mt-2 break-words text-[11px] ${
                            active
                              ? "font-semibold text-emerald-600"
                              : "text-slate-500"
                          }`}
                        >
                          {statusLabels[status]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {currentStatus === "cancelled" && (
                  <p className="mt-3 text-sm font-medium text-red-500">
                    This order has been cancelled.
                  </p>
                )}
              </section>

              {/* Customer, shipping and payment */}
              <section className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
                <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-3 flex items-center gap-2">
                    <User
                      size={17}
                      className="text-emerald-600"
                    />
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Customer
                    </h3>
                  </div>

                  <p className="break-words text-sm font-medium text-slate-800 dark:text-slate-200">
                    {customerName}
                  </p>
                  <p className="mt-1 break-all text-xs text-slate-500">
                    {customerEmail}
                  </p>
                  <p className="mt-1 break-words text-xs text-slate-500">
                    {customerPhone}
                  </p>
                </div>

                <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin
                      size={17}
                      className="text-emerald-600"
                    />
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Shipping
                    </h3>
                  </div>

                  <p className="break-words text-xs leading-5 text-slate-600 dark:text-slate-300">
                    {addressText}
                  </p>
                </div>

                <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-3 flex items-center gap-2">
                    <CreditCard
                      size={17}
                      className="text-emerald-600"
                    />
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Payment
                    </h3>
                  </div>

                  <p className="break-words text-sm font-medium capitalize text-slate-800 dark:text-slate-200">
                    {String(paymentMethod)}
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-2 py-1 text-[11px] font-medium capitalize ${
                      paymentStatus === "paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : paymentStatus === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {String(paymentStatus)}
                  </span>
                </div>
              </section>

              {/* Order items */}
              <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-3 flex items-center gap-2">
                  <Package
                    size={17}
                    className="text-emerald-600"
                  />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Order Items
                  </h3>
                </div>

                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-700">
                        <th className="py-3 pr-3 font-medium">
                          Product
                        </th>
                        <th className="px-3 py-3 text-center font-medium">
                          Qty
                        </th>
                        <th className="px-3 py-3 text-right font-medium">
                          Price
                        </th>
                        <th className="py-3 pl-3 text-right font-medium">
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.length > 0 ? (
                        items.map((item: any, index: number) => {
                          const price = getItemPrice(item);
                          const quantity = getItemQuantity(item);

                          return (
                            <tr
                              key={
                                item._id ??
                                item.id ??
                                `${getItemName(item)}-${index}`
                              }
                              className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                            >
                              <td className="max-w-[260px] break-words py-3 pr-3 text-slate-800 dark:text-slate-200">
                                {getItemName(item)}
                              </td>

                              <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-300">
                                {quantity}
                              </td>

                              <td className="px-3 py-3 text-right text-slate-600 dark:text-slate-300">
                                {formatPrice(price)}
                              </td>

                              <td className="py-3 pl-3 text-right font-medium text-slate-800 dark:text-slate-200">
                                {formatPrice(price * quantity)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-6 text-center text-sm text-slate-500"
                          >
                            No items found for this order.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Order totals */}
              <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-xs text-slate-500">
                    Subtotal
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                    {formatPrice(subtotal)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-xs text-slate-500">
                    Shipping
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                    {formatPrice(shippingCost)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-xs text-slate-500">
                    Discount
                  </p>
                  <p className="mt-1 text-base font-semibold text-emerald-600">
                    -{formatPrice(discount)}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Total Amount
                  </p>
                  <p className="mt-1 text-base font-bold text-emerald-700 dark:text-emerald-400">
                    {formatPrice(total)}
                  </p>
                </div>
              </section>

              {/* Return and refund */}
              {canReturnRefund && onReturnRefund && (
                <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Return & Refund
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Manage the return or refund for this order.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenReturnRefund("return-refund")
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <RotateCcw size={14} />
                      Return & Refund
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenReturnRefund("refund-only")
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-700"
                    >
                      <Banknote size={14} />
                      Refund Only
                    </button>
                  </div>
                </section>
              )}

              {/* Status update: one action button only */}
              <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                  Update Order Status
                </h3>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <Select
                      value={selectedStatus}
                      onValueChange={(value) =>
                        setSelectedStatus(value as OrderStatus)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>

                      <SelectContent>
                        {statusFlow.map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            disabled={
                              status === currentStatus ||
                              (currentStatusIndex >= 0 &&
                                statusFlow.indexOf(status) <
                                  currentStatusIndex)
                            }
                          >
                            {statusLabels[status]}
                          </SelectItem>
                        ))}

                        <SelectItem
                          value="cancelled"
                          disabled={currentStatus === "cancelled"}
                        >
                          Cancelled
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleStatusUpdate}
                      disabled={
                        selectedStatus === currentStatus ||
                        (currentStatusIndex >= 0 &&
                          statusFlow.indexOf(selectedStatus) >= 0 &&
                          statusFlow.indexOf(selectedStatus) <
                            currentStatusIndex)
                      }
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Update Status
                    </button>

                    {nextStatus && (
                      <button
                        type="button"
                        onClick={handleMoveToNextStatus}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Move to {statusLabels[nextStatus]}
                        <ChevronRight size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <Separator />

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 bg-white px-4 py-3 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => onPrintInvoice(order)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Printer size={15} />
              Print Invoice
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Return/refund confirmation dialog */}
      <Dialog
        open={returnRefundOpen}
        onOpenChange={setReturnRefundOpen}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>
              {returnRefundMode === "return-refund"
                ? "Confirm Return & Refund"
                : "Confirm Refund"}
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            {returnRefundMode === "return-refund"
              ? "Are you sure you want to process the return and refund for this order?"
              : "Are you sure you want to process a refund for this order?"}
          </p>

          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setReturnRefundOpen(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmReturnRefund}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Confirm
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
