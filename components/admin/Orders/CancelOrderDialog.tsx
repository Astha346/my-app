
"use client";

import { AlertTriangle, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Order } from "@/types/order";

interface Props {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (order: Order) => void;
}

export default function CancelOrderDialog({
  order,
  open,
  onClose,
  onConfirm,
}: Props) {
  if (!order) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm(order);
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
      <DialogContent className="max-w-md rounded-xl p-0">
        <DialogHeader className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>

            <div>
              <DialogTitle className="text-lg font-semibold text-slate-900">
                Cancel Order
              </DialogTitle>

              <DialogDescription className="mt-1 text-sm text-slate-500">
                Are you sure you want to cancel this order?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5">
          <div className="rounded-lg border border-red-100 bg-red-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              {order.orderNumber}
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Customer: {order.customer.name}
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Amount: Rs.{" "}
              {Number(order.total || 0).toLocaleString("en-IN")}
            </p>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Once cancelled, this order will be marked as cancelled
            and cannot be moved to another status.
          </p>
        </div>

        <DialogFooter className="border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
            Keep Order
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <AlertTriangle className="h-4 w-4" />
            Cancel Order
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

