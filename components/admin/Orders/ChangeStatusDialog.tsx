"use client";

import {
  PackageCheck,
  X,
} from "lucide-react";

import React from "react";

import {
  Order,
  OrderStatus,
} from "@/types/order";

interface Props {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (
    orderId: string,
    status: OrderStatus
  ) => void;
}

const statuses: {
  value: OrderStatus;
  label: string;
}[] = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "confirmed",
    label: "Confirmed",
  },
  {
    value: "processing",
    label: "Processing",
  },
  {
    value: "shipped",
    label: "Shipped",
  },
  {
    value: "delivered",
    label: "Delivered",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

export default function ChangeStatusDialog({
  order,
  open,
  onClose,
  onConfirm,
}: Props) {
  const [status, setStatus] =
    React.useState<OrderStatus>(
      order?.status ?? "pending"
    );

  React.useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  if (!open || !order) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
              <PackageCheck className="h-5 w-5 text-indigo-600" />
            </div>

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Change Order Status
              </h2>

              <p className="text-xs text-slate-500">
                {order.orderNumber}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* BODY */}

        <div className="px-6 py-6">

          <label className="text-sm font-medium text-slate-700">
            Order Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as OrderStatus
              )
            }
            className="
              mt-2
              h-11
              w-full
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3
              text-sm
              outline-none
              focus:border-indigo-400
              focus:ring-2
              focus:ring-indigo-100
            "
          >

            {statuses.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}

          </select>

        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              border
              border-slate-200
              px-4
              py-2
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
            onClick={() =>
              onConfirm(
                order._id,
                status
              )
            }
            className="
              rounded-lg
              bg-slate-900
              px-4
              py-2
              text-sm
              font-medium
              text-white
              hover:bg-slate-800
            "
          >
            Save Status
          </button>

        </div>

      </div>

    </div>
  );
}