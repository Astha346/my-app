"use client";

import { useMemo, useState } from "react";
import { RotateCcw, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Order } from "@/types/order";

type ReturnRefundDialogProps = {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: ReturnRefundData) => void;
};

export type ReturnRefundData = {
  orderId: string;
  itemIds: string[];
  reason: string;
  note: string;
  refundMethod: "original" | "esewa" | "khalti" | "cash";
  refundAmount: number;
};

const RETURN_REASONS = [
  "Product damaged",
  "Wrong product received",
  "Product not as described",
  "Product defective",
  "Changed my mind",
  "Other",
];

export default function ReturnRefundDialog({
  order,
  open,
  onClose,
  onSubmit,
}: ReturnRefundDialogProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [reason, setReason] = useState("");

  const [note, setNote] = useState("");

  const [refundMethod, setRefundMethod] = useState<
    "original" | "esewa" | "khalti" | "cash"
  >("original");

  const [submitted, setSubmitted] = useState(false);

  const refundAmount = useMemo(() => {
    if (!order) return 0;

    return order.items.reduce((total, item) => {
      if (!selectedItems.includes(item.productId)) {
        return total;
      }

      return total + item.price * item.quantity;
    }, 0);
  }, [order, selectedItems]);

  const toggleItem = (productId: string) => {
    setSelectedItems((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId);
      }

      return [...current, productId];
    });
  };

  const handleClose = () => {
    setSelectedItems([]);
    setReason("");
    setNote("");
    setRefundMethod("original");
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = () => {
    if (!order) return;

    if (selectedItems.length === 0) {
      return;
    }

    if (!reason) {
      return;
    }

    const returnData: ReturnRefundData = {
      orderId: order._id,
      itemIds: selectedItems,
      reason,
      note,
      refundMethod,
      refundAmount,
    };

    onSubmit?.(returnData);

    setSubmitted(true);
  };

  if (!order) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100">
              <RotateCcw className="h-5 w-5 text-orange-600" />
            </div>

            Return / Refund
          </DialogTitle>

          <DialogDescription>
            Create a return or refund request for this order.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <RotateCcw className="h-7 w-7 text-green-600" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              Return Request Submitted
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              The return/refund request has been created successfully.
            </p>

            <div className="mt-6 rounded-lg border bg-slate-50 p-4 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Order
                </span>

                <span className="font-medium">
                  {order.orderNumber}
                </span>
              </div>

              <div className="mt-2 flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Refund Amount
                </span>

                <span className="font-semibold">
                  Rs. {refundAmount.toLocaleString()}
                </span>
              </div>

              <div className="mt-2 flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Status
                </span>

                <span className="font-medium text-orange-600">
                  Pending Review
                </span>
              </div>
            </div>

            <Button
              className="mt-6"
              onClick={handleClose}
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* ORDER INFORMATION */}

            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Order
                  </p>

                  <p className="font-semibold">
                    {order.orderNumber}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Customer
                  </p>

                  <p className="font-medium">
                    {order.customer.name}
                  </p>
                </div>
              </div>
            </div>

            {/* SELECT ITEMS */}

            <div className="space-y-3">
              <Label>
                Select items to return
              </Label>

              <div className="space-y-2">
                {order.items.map((item) => {
                  const selected = selectedItems.includes(
                    item.productId
                  );

                  return (
                    <button
                      key={item.productId}
                      type="button"
                      onClick={() =>
                        toggleItem(item.productId)
                      }
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-orange-500 bg-orange-50"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            selected
                              ? "border-orange-500 bg-orange-500 text-white"
                              : "border-slate-300"
                          }`}
                        >
                          {selected && (
                            <span className="text-xs">
                              ✓
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="font-medium">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="font-semibold">
                          Rs.{" "}
                          {(
                            item.price * item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RETURN REASON */}

            <div className="space-y-2">
              <Label htmlFor="return-reason">
                Return reason
              </Label>

              <select
                id="return-reason"
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">
                  Select a reason
                </option>

                {RETURN_REASONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* NOTE */}

            <div className="space-y-2">
              <Label htmlFor="return-note">
                Additional note
              </Label>

              <Textarea
                id="return-note"
                value={note}
                onChange={(e) =>
                  setNote(e.target.value)
                }
                placeholder="Add any additional information..."
                className="min-h-[90px]"
              />
            </div>

            {/* REFUND METHOD */}

            <div className="space-y-3">
              <Label>
                Refund method
              </Label>

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setRefundMethod("original")
                  }
                  className={`rounded-lg border p-3 text-left ${
                    refundMethod === "original"
                      ? "border-orange-500 bg-orange-50"
                      : ""
                  }`}
                >
                  <p className="text-sm font-medium">
                    Original Payment
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Refund to original payment method
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setRefundMethod("esewa")
                  }
                  className={`rounded-lg border p-3 text-left ${
                    refundMethod === "esewa"
                      ? "border-orange-500 bg-orange-50"
                      : ""
                  }`}
                >
                  <p className="text-sm font-medium">
                    eSewa
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Refund through eSewa
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setRefundMethod("khalti")
                  }
                  className={`rounded-lg border p-3 text-left ${
                    refundMethod === "khalti"
                      ? "border-orange-500 bg-orange-50"
                      : ""
                  }`}
                >
                  <p className="text-sm font-medium">
                    Khalti
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Refund through Khalti
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setRefundMethod("cash")
                  }
                  className={`rounded-lg border p-3 text-left ${
                    refundMethod === "cash"
                      ? "border-orange-500 bg-orange-50"
                      : ""
                  }`}
                >
                  <p className="text-sm font-medium">
                    Cash
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Manual cash refund
                  </p>
                </button>
              </div>
            </div>

            {/* REFUND SUMMARY */}

            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Selected items
                </span>

                <span className="text-sm font-medium">
                  {selectedItems.length}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <span className="font-medium">
                  Refund Amount
                </span>

                <span className="text-lg font-bold">
                  Rs. {refundAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>

              <Button
                type="button"
                disabled={
                  selectedItems.length === 0 ||
                  !reason ||
                  refundAmount <= 0
                }
                onClick={handleSubmit}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Submit Request
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}