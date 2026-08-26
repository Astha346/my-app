"use client";

import { useEffect, useState } from "react";

import {
  Check,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Truck,
  User,
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

import { Order } from "@/types/order";
import OrderStatusBadge from "./OrderStatusBadge";

interface Props {
  order: Order | null;
  open: boolean;
  onClose: () => void;

  // Frontend-only status update
  onStatusUpdate: (
    orderId: string,
    status: Order["status"]
  ) => void;
}

export default function OrderDetailsDialog({
  order,
  open,
  onClose,
  onStatusUpdate,
}: Props) {
  const [status, setStatus] =
    useState<Order["status"]>("pending");

  // Set status whenever a different order is opened
  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  if (!order) return null;

  const timeline = [
    {
      label: "Order Placed",
      completed: true,
      icon: Clock,
    },
    {
      label: "Confirmed",
      completed: [
        "confirmed",
        "processing",
        "shipped",
        "delivered",
      ].includes(status),
      icon: Check,
    },
    {
      label: "Processing",
      completed: [
        "processing",
        "shipped",
        "delivered",
      ].includes(status),
      icon: Package,
    },
    {
      label: "Shipped",
      completed: [
        "shipped",
        "delivered",
      ].includes(status),
      icon: Truck,
    },
    {
      label: "Delivered",
      completed: status === "delivered",
      icon: Check,
    },
  ];

  // FRONTEND-ONLY UPDATE
  const handleUpdateStatus = () => {
    console.log("Order:", order.orderNumber);
    console.log("New order status:", status);

    // Update status in parent Orders component
    onStatusUpdate(order._id, status);

    // Close dialog
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <div>
              <DialogTitle className="text-2xl">
                {order.orderNumber}
              </DialogTitle>

              <p className="mt-1 text-sm text-gray-500">
                {new Date(
                  order.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

            <OrderStatusBadge status={status} />
          </div>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* LEFT SIDE */}

          <div className="space-y-6 lg:col-span-2">

            {/* Customer Information */}

            <div className="rounded-xl border p-5">
              <div className="mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />

                <h3 className="font-semibold">
                  Customer Information
                </h3>
              </div>

              <div className="space-y-2">
                <p className="font-medium">
                  {order.customer.name}
                </p>

                <p className="text-sm text-gray-500">
                  {order.customer.email}
                </p>

                {order.customer.phone && (
                  <p className="text-sm text-gray-500">
                    {order.customer.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Order Items */}

            <div className="rounded-xl border p-5">
              <div className="mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />

                <h3 className="font-semibold">
                  Order Items
                </h3>
              </div>

              <div className="divide-y">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between py-4"
                  >
                    <div>
                      <p className="font-medium">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Rs.{" "}
                        {item.price.toLocaleString()} ×{" "}
                        {item.quantity}
                      </p>
                    </div>

                    <p className="font-medium">
                      Rs.{" "}
                      {(
                        item.price * item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}

            <div className="rounded-xl border p-5">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />

                <h3 className="font-semibold">
                  Shipping Address
                </h3>
              </div>

              <p className="text-sm text-gray-600">
                {order.shippingAddress.address}
              </p>

              <p className="text-sm text-gray-600">
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="space-y-6">

            {/* Order Summary */}

            <div className="rounded-xl border p-5">
              <h3 className="mb-4 font-semibold">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span>
                    Rs.{" "}
                    {order.subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span>
                    Rs.{" "}
                    {order.shipping.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Discount
                  </span>

                  <span className="text-red-500">
                    - Rs.{" "}
                    {order.discount.toLocaleString()}
                  </span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>

                    <span>
                      Rs.{" "}
                      {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Payment */}

            <div className="rounded-xl border p-5">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />

                <h3 className="font-semibold">
                  Payment
                </h3>
              </div>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Method
                  </span>

                  <span className="font-medium uppercase">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Status
                  </span>

                  <span
                    className={
                      order.paymentStatus === "paid"
                        ? "font-medium text-green-600"
                        : order.paymentStatus === "failed"
                        ? "font-medium text-red-600"
                        : "font-medium text-yellow-600"
                    }
                  >
                    {order.paymentStatus
                      .charAt(0)
                      .toUpperCase() +
                      order.paymentStatus.slice(1)}
                  </span>
                </div>

              </div>
            </div>

            {/* Order Timeline */}

            <div className="rounded-xl border p-5">
              <h3 className="mb-5 font-semibold">
                Order Timeline
              </h3>

              <div className="space-y-5">

                {timeline.map(
                  (step, index) => {
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.label}
                        className="relative flex items-center gap-3"
                      >
                        {index <
                          timeline.length - 1 && (
                          <div
                            className={`absolute left-2.75 top-7 h-7 w-px ${
                              step.completed
                                ? "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          />
                        )}

                        <div
                          className={`z-10 flex h-6 w-6 items-center justify-center rounded-full ${
                            step.completed
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>

                        <span
                          className={
                            step.completed
                              ? "text-sm font-medium"
                              : "text-sm text-gray-400"
                          }
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  }
                )}

              </div>
            </div>

            {/* Update Order Status */}

            <div className="rounded-xl border p-5">
              <h3 className="mb-4 font-semibold">
                Update Order Status
              </h3>

              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(
                    value as Order["status"]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="pending">
                    Pending
                  </SelectItem>

                  <SelectItem value="confirmed">
                    Confirmed
                  </SelectItem>

                  <SelectItem value="processing">
                    Processing
                  </SelectItem>

                  <SelectItem value="shipped">
                    Shipped
                  </SelectItem>

                  <SelectItem value="delivered">
                    Delivered
                  </SelectItem>

                  <SelectItem value="cancelled">
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>

              <button
                onClick={handleUpdateStatus}
                className="mt-4 w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Update Status
              </button>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}