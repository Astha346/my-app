"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Order, OrderStatus } from "@/types/order";

interface Props {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (
    orderId: string,
    newStatus: OrderStatus
  ) => void | Promise<void>;
}

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function ChangeStatusDialog({
  order,
  open,
  onClose,
  onStatusUpdate,
}: Props) {
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  if (!open || !order) {
    return null;
  }

  const handleUpdate = async () => {
    if (status === order.status) {
      onClose();
      return;
    }

    try {
      setLoading(true);

      await onStatusUpdate(order._id, status);

      onClose();
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Change Order Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Order #{order.orderNumber || order._id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <label
            htmlFor="order-status"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Order Status
          </label>

          <select
            id="order-status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as OrderStatus)
            }
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {STATUS_LABELS[option]}
              </option>
            ))}
          </select>

          {status !== order.status && (
            <div className="mt-4 rounded-lg bg-purple-50 p-3 text-sm text-purple-700">
              Change status from{" "}
              <strong>{STATUS_LABELS[order.status]}</strong>{" "}
              to{" "}
              <strong>{STATUS_LABELS[status]}</strong>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading || status === order.status}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}