
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
import { Order, OrderStatus } from "@/types/order";
import OrderStatusBadge from "./OrderStatusBadge";

interface Props {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
  onPrintInvoice: (order: Order) => void;
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

const panel =
  "min-w-0 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900";

const heading =
  "text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100";

const muted =
  "text-sm leading-5 text-slate-500 dark:text-slate-400";

const label =
  "text-xs font-medium leading-4 text-slate-500 dark:text-slate-400";

export default function OrderDetailsDialog({
  order,
  open,
  onClose,
  onStatusUpdate,
  onPrintInvoice,
  onReturnRefund,
}: Props) {
  const [returnRefundOpen, setReturnRefundOpen] = React.useState(false);

  const [refundMode, setRefundMode] = React.useState<
    "return_refund" | "refund_only"
  >("return_refund");

  if (!order) return null;

  const backendOrder = order as Order & {
    orderNumber?: string;
    customerName?: string;
    customer?: {
      name?: string;
      email?: string;
      phone?: string;
    };
    deliveryAddress?: string;
    latitude?: number | null;
    longitude?: number | null;
    shippingAddress?: {
      address?: string;
      city?: string;
      country?: string;
    };
    subtotal?: number;
    shipping?: number;
    discount?: number;
  };

  const displayOrderNumber = backendOrder.orderNumber || order._id;

  const customerName =
    backendOrder.customerName ||
    backendOrder.customer?.name ||
    "Unknown Customer";

  const customerEmail =
    backendOrder.customer?.email || "Not available";

  const customerPhone = backendOrder.customer?.phone || "";

  const deliveryAddress =
    backendOrder.deliveryAddress ||
    backendOrder.shippingAddress?.address ||
    "Address not available";

  const locationText =
    backendOrder.shippingAddress?.city ||
    backendOrder.shippingAddress?.country ||
    (backendOrder.latitude != null &&
    backendOrder.longitude != null
      ? `${backendOrder.latitude}, ${backendOrder.longitude}`
      : "Location not available");

  const calculatedSubtotal =
    order.items?.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) * Number(item.quantity || 0),
      0
    ) || 0;

  const subtotal = backendOrder.subtotal ?? calculatedSubtotal;
  const shipping = backendOrder.shipping ?? 0;
  const discount = backendOrder.discount ?? 0;

  const currentStatusIndex = STATUS_FLOW.indexOf(order.status);

  let nextStatus: OrderStatus | null = null;

  if (
    order.status !== "cancelled" &&
    order.status !== "delivered" &&
    currentStatusIndex >= 0
  ) {
    nextStatus = STATUS_FLOW[currentStatusIndex + 1] ?? null;
  }

  const canReturnRefund =
    order.status === "delivered" || order.status === "cancelled";

  const handleOpenReturnRefund = () => {
    setRefundMode("return_refund");
    setReturnRefundOpen(true);
  };

  const handleConfirmReturnRefund = () => {
    if (!onReturnRefund) {
      setReturnRefundOpen(false);
      return;
    }

    onReturnRefund(order, refundMode);
    setReturnRefundOpen(false);
  };

  const handleStatusUpdate = () => {
    if (!nextStatus) return;

    onStatusUpdate(order._id, nextStatus);
    onClose();
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString(
    "en-US",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  const formatPrice = (value?: number | null) =>
    `Rs. ${(value ?? 0).toLocaleString("en-IN")}`;

  const paymentMethodLabel = {
    cod: "Cash on Delivery",
    esewa: "eSewa",
    khalti: "Khalti",
  }[order.paymentMethod];

  const paymentStatusClass = {
    paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    pending:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    failed:
      "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  }[order.paymentStatus];

  const iconBox =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

  const actionButton =
    "inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium leading-5 transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:px-4";

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!value) onClose();
        }}
      >
        <DialogContent className="fixed left-1/2 top-1/2 z-50 flex h-[88vh] max-h-[88vh] w-[94vw] min-w-0 max-w-[1400px] -translate-x-1/2 -translate-y-1/2 flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-0 shadow-xl dark:border-slate-700 dark:bg-slate-950 sm:!w-[94vw] sm:!max-w-[1400px]">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
            <DialogHeader className="min-w-0 flex-1 space-y-0 text-left">
              <div className="flex min-w-0 items-center gap-3">
                <div className={iconBox}>
                  <Package className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
                    <DialogTitle className="min-w-0 break-all text-lg font-semibold leading-6 text-slate-900 dark:text-white">
                      Order #{displayOrderNumber}
                    </DialogTitle>

                    <OrderStatusBadge status={order.status} />
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Placed on {formattedDate}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close order details"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain">
            <div className="mx-auto w-full min-w-0 max-w-none space-y-5 p-6">
              {/* Order progress */}
              <section className={`${panel} p-5`}>
                <div className="flex min-w-0 items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className={heading}>Order Progress</h3>
                    <p className={`mt-1 ${muted}`}>
                      Track the current fulfillment status.
                    </p>
                  </div>

                  <span className="shrink-0 text-right text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">
                    {order.status === "cancelled"
                      ? "Cancelled"
                      : order.status === "delivered"
                        ? "Completed"
                        : `Step ${currentStatusIndex + 1} of ${STATUS_FLOW.length}`}
                  </span>
                </div>

                {order.status === "cancelled" ? (
                  <div className="mt-5 flex min-w-0 items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40">
                    <X className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />

                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-5 text-red-700 dark:text-red-300">
                        Order Cancelled
                      </p>
                      <p className="mt-1 text-sm leading-5 text-red-600 dark:text-red-400">
                        This order cannot be progressed further.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-7 w-full min-w-0 pb-2">
                    <div className="relative w-full min-w-0 px-1">
                      <div className="absolute left-[10%] right-[10%] top-4 h-0.5 bg-slate-200 dark:bg-slate-700" />

                      {currentStatusIndex > 0 && (
                        <div
                          className="absolute left-[10%] top-4 h-0.5 bg-emerald-500"
                          style={{
                            width: `${(currentStatusIndex / (STATUS_FLOW.length - 1)) * 80}%`,
                          }}
                        />
                      )}

                      <div className="relative grid w-full min-w-0 grid-cols-5">
                        {STATUS_FLOW.map((step, index) => {
                          const completed = index <= currentStatusIndex;
                          const active = index === currentStatusIndex;

                          return (
                            <div
                              key={step}
                              className="flex min-w-0 flex-col items-center text-center"
                            >
                              <div
                                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                                  completed
                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                    : "border-slate-300 bg-white text-slate-400 dark:border-slate-600 dark:bg-slate-900"
                                } ${
                                  active
                                    ? "ring-4 ring-emerald-100 dark:ring-emerald-900/50"
                                    : ""
                                }`}
                              >
                                {completed ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-500" />
                                )}
                              </div>

                              <span
                                className={`mt-3 w-full min-w-0 px-1 text-center text-xs leading-5 ${
                                  completed
                                    ? "font-semibold text-slate-900 dark:text-slate-100"
                                    : "font-medium text-slate-400 dark:text-slate-500"
                                }`}
                              >
                                {STATUS_LABELS[step]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Customer, shipping and payment */}
              <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-4 min-[1200px]:grid-cols-3">
                {/* Customer */}
                <section className={`${panel} flex min-w-0 flex-col p-5`}>
                  <div className="mb-5 flex min-h-14 min-w-0 items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div className={iconBox}>
                      <User className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <h3 className={heading}>Customer</h3>
                      <p className={`mt-1 ${muted}`}>
                        Customer information
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-5">
                    <div className="min-w-0">
                      <p className={label}>Name</p>
                      <p className="mt-1 break-words text-sm font-medium leading-5 text-slate-900 dark:text-slate-100">
                        {customerName}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className={label}>Email</p>
                      <p className="mt-1 break-all text-sm leading-5 text-slate-600 dark:text-slate-300">
                        {customerEmail}
                      </p>
                    </div>

                    {customerPhone && (
                      <div className="min-w-0">
                        <p className={label}>Phone</p>
                        <p className="mt-1 break-words text-sm leading-5 text-slate-600 dark:text-slate-300">
                          {customerPhone}
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Shipping */}
                <section className={`${panel} flex min-w-0 flex-col p-5`}>
                  <div className="mb-5 flex min-h-14 min-w-0 items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div className={iconBox}>
                      <MapPin className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <h3 className={heading}>Shipping Address</h3>
                      <p className={`mt-1 ${muted}`}>
                        Delivery information
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="break-words text-sm font-medium leading-6 text-slate-900 dark:text-slate-100">
                      {deliveryAddress}
                    </p>
                    <p className="mt-3 break-words text-sm leading-5 text-slate-500 dark:text-slate-400">
                      {locationText}
                    </p>
                  </div>
                </section>

                {/* Payment */}
                <section className={`${panel} flex min-w-0 flex-col p-5`}>
                  <div className="mb-5 flex min-h-14 min-w-0 items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div className={iconBox}>
                      <CreditCard className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <h3 className={heading}>Payment</h3>
                      <p className={`mt-1 ${muted}`}>
                        Payment information
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-5">
                    <div className="min-w-0">
                      <p className={label}>Payment Method</p>
                      <p className="mt-1 break-words text-sm font-medium leading-5 text-slate-900 dark:text-slate-100">
                        {paymentMethodLabel}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className={label}>Payment Status</p>
                      <span
                        className={`mt-2 inline-flex max-w-full flex-wrap rounded-full px-3 py-1 text-xs font-medium capitalize leading-5 ${paymentStatusClass}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Order items */}
              <section className={`${panel} overflow-hidden`}>
                <div className="flex min-w-0 items-center gap-3 px-5 py-4">
                  <div className={iconBox}>
                    <Package className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <h3 className={heading}>Order Items</h3>
                    <p className={`mt-1 ${muted}`}>
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"} in this order
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="block w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain">
                  <table className="w-full min-w-[620px] table-auto text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/70">
                      <tr className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                        <th className="w-[45%] px-5 py-3 font-medium">
                          Product
                        </th>
                        <th className="w-[15%] px-3 py-3 text-center font-medium">
                          Quantity
                        </th>
                        <th className="w-[20%] px-3 py-3 text-right font-medium">
                          Unit Price
                        </th>
                        <th className="w-[20%] px-5 py-3 text-right font-medium">
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {order.items.map((item, index) => {
                        const itemTotal = item.price * item.quantity;

                        return (
                          <tr
                            key={`${item.productId}-${index}`}
                            className="border-t border-slate-100 dark:border-slate-800"
                          >
                            <td className="px-5 py-4">
                              <div className="flex min-w-0 items-center gap-3">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-11 w-11 shrink-0 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
                                  />
                                ) : (
                                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                    <Package className="h-5 w-5 text-slate-400" />
                                  </div>
                                )}

                                <div className="min-w-0">
                                  <p className="break-words text-sm font-medium leading-5 text-slate-900 dark:text-slate-100">
                                    {item.name}
                                  </p>
                                  <p className="mt-1 break-all text-xs leading-4 text-slate-400">
                                    ID: {item.productId}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-3 py-4 text-center">
                              <span className="inline-flex min-w-8 items-center justify-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium leading-5 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                {item.quantity}
                              </span>
                            </td>

                            <td className="whitespace-nowrap px-3 py-4 text-right text-sm leading-5 text-slate-600 dark:text-slate-300">
                              {formatPrice(item.price)}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-right text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">
                              {formatPrice(itemTotal)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Order totals */}
              <section className="grid w-full min-w-0 grid-cols-1 gap-4 min-[900px]:grid-cols-4">
                {[
                  { title: "Subtotal", value: formatPrice(subtotal) },
                  { title: "Shipping", value: formatPrice(shipping) },
                  { title: "Discount", value: `- ${formatPrice(discount)}` },
                ].map((item) => (
                  <div
                    key={item.title}
                    className={`${panel} min-w-0 p-4`}
                  >
                    <p className={label}>{item.title}</p>
                    <p className="mt-2 break-words text-base font-semibold leading-6 text-slate-900 dark:text-slate-100">
                      {item.value}
                    </p>
                  </div>
                ))}

                <div className="min-w-0 rounded-xl bg-slate-900 p-4 text-white dark:bg-slate-800">
                  <p className="text-xs font-medium leading-5 text-slate-300">
                    Grand Total
                  </p>
                  <p className="mt-2 break-words text-lg font-bold leading-6">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </section>

              {/* Return / refund */}
              {canReturnRefund && (
                <section className="flex min-w-0 items-center justify-between gap-4 rounded-xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-900 dark:bg-orange-950/30">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                      <RotateCcw className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className={heading}>Return / Refund</h3>
                      <p className={`mt-1 ${muted}`}>
                        {order.status === "delivered"
                          ? "This order is eligible for return or refund."
                          : "This cancelled order can be refunded."}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenReturnRefund}
                    className={`${actionButton} shrink-0 bg-orange-600 text-white hover:bg-orange-700`}
                  >
                    <RotateCcw className="h-4 w-4 shrink-0" />
                    Return / Refund
                  </button>
                </section>
              )}

              {/* Update order status */}
              <section className="flex min-w-0 items-center justify-between gap-6 rounded-xl bg-slate-900 p-5 text-white dark:bg-slate-800">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Truck className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-5">
                      Update Order Status
                    </h3>

                    {nextStatus ? (
                      <p className="mt-1 flex items-center text-xs leading-5 text-slate-300">
                        {STATUS_LABELS[order.status]}
                        <ChevronRight className="mx-1 h-3 w-3 shrink-0" />
                        {STATUS_LABELS[nextStatus]}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs leading-5 text-slate-300">
                        {order.status === "delivered"
                          ? "This order has been delivered."
                          : "This order cannot be progressed further."}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex min-w-0 shrink-0 flex-row items-center gap-3">
                  <Select
                    value={nextStatus ?? ""}
                    disabled={!nextStatus}
                    onValueChange={(value) => {
                      if (!nextStatus || value !== nextStatus) return;

                      onStatusUpdate(order._id, nextStatus);
                      onClose();
                    }}
                  >
                    <SelectTrigger className="h-10 w-52 shrink-0 border-slate-600 bg-slate-800 text-white dark:border-slate-600 dark:bg-slate-900">
                      <SelectValue
                        placeholder={
                          nextStatus
                            ? `Move to ${STATUS_LABELS[nextStatus]}`
                            : STATUS_LABELS[order.status]
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {nextStatus ? (
                        <SelectItem value={nextStatus}>
                          Move to {STATUS_LABELS[nextStatus]}
                        </SelectItem>
                      ) : (
                        <SelectItem value={order.status} disabled>
                          {STATUS_LABELS[order.status]}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  <button
                    type="button"
                    onClick={handleStatusUpdate}
                    disabled={!nextStatus}
                    className={`${actionButton} w-auto shrink-0 whitespace-nowrap bg-white text-slate-900 hover:bg-slate-100 disabled:bg-slate-700 disabled:text-slate-400`}
                  >
                    <Check className="h-4 w-4 shrink-0" />
                    {nextStatus
                      ? `Move to ${STATUS_LABELS[nextStatus]}`
                      : "No Further Update"}
                  </button>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-3 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              <Clock className="h-4 w-4 shrink-0" />
              <span>Created {formattedDate}</span>
            </div>

            <div className="ml-auto flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={() => onPrintInvoice(order)}
                className={`${actionButton} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`}
              >
                <Printer className="h-4 w-4 shrink-0" />
                Print Invoice
              </button>

              <button
                type="button"
                onClick={onClose}
                className={`${actionButton} bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600`}
              >
                <X className="h-4 w-4 shrink-0" />
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Return / refund confirmation */}
      <Dialog
        open={returnRefundOpen}
        onOpenChange={setReturnRefundOpen}
      >
        <DialogContent className="flex max-h-[90dvh] w-[calc(100vw-24px)] min-w-0 max-w-md flex-col overflow-x-hidden overflow-y-auto rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <DialogHeader className="min-w-0">
            <DialogTitle className="flex min-w-0 items-center gap-3 text-lg leading-6 text-slate-900 dark:text-white">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300">
                <RotateCcw className="h-5 w-5" />
              </div>
              <span className="min-w-0 break-words">
                Return / Refund Order
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="min-w-0 space-y-4">
            <div className="min-w-0 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
              <p className="break-all text-sm font-medium leading-5 text-slate-900 dark:text-slate-100">
                {displayOrderNumber}
              </p>
              <p className={`mt-3 ${muted}`}>Refund amount</p>
              <p className="mt-1 break-words text-xl font-bold leading-7 text-slate-900 dark:text-white">
                {formatPrice(order.total)}
              </p>
            </div>

            {/* Return and refund */}
            <button
              type="button"
              onClick={() => setRefundMode("return_refund")}
              className={`w-full min-w-0 rounded-lg border p-4 text-left transition-colors ${
                refundMode === "return_refund"
                  ? "border-orange-500 bg-orange-50 ring-1 ring-orange-200 dark:bg-orange-950/30 dark:ring-orange-900"
                  : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    refundMode === "return_refund"
                      ? "border-orange-600 bg-orange-600"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {refundMode === "return_refund" && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">
                    Return &amp; Refund
                  </p>
                  <p className={`mt-1 text-xs leading-5 ${muted}`}>
                    Customer returns the product and receives a refund.
                  </p>
                </div>
              </div>
            </button>

            {/* Refund only */}
            <button
              type="button"
              onClick={() => setRefundMode("refund_only")}
              className={`w-full min-w-0 rounded-lg border p-4 text-left transition-colors ${
                refundMode === "refund_only"
                  ? "border-orange-500 bg-orange-50 ring-1 ring-orange-200 dark:bg-orange-950/30 dark:ring-orange-900"
                  : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    refundMode === "refund_only"
                      ? "border-orange-600 bg-orange-600"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {refundMode === "refund_only" && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">
                    Refund Only
                  </p>
                  <p className={`mt-1 text-xs leading-5 ${muted}`}>
                    Refund the customer without requiring the product to be returned.
                  </p>
                </div>
              </div>
            </button>

            <div className="min-w-0 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
              <p className="text-xs leading-5 text-amber-800 dark:text-amber-300">
                Please verify the customer's request before processing the refund. Only process eligible orders.
              </p>
            </div>

            <div className="flex min-w-0 flex-col-reverse gap-2 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setReturnRefundOpen(false)}
                className={`${actionButton} w-full border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmReturnRefund}
                className={`${actionButton} w-full bg-orange-600 text-white hover:bg-orange-700 sm:w-auto`}
              >
                <Banknote className="h-4 w-4 shrink-0" />
                Confirm Refund
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
