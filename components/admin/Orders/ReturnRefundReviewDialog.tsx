"use client";

import {
  CheckCircle2,
  Clock,
  RotateCcw,
  XCircle,
  Banknote,
  PackageCheck,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  Order,
  ReturnRefundStatus,
} from "@/types/order";

interface Props {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (
    orderId: string,
    status: ReturnRefundStatus
  ) => void;
}

export default function ReturnRefundReviewDialog({
  order,
  open,
  onClose,
  onStatusUpdate,
}: Props) {
  if (!order) {
    return null;
  }

  const status =
    order.returnRefundStatus ?? "none";

  const isPending =
    status === "requested";

  const isApproved =
    status === "approved";

  const isProcessing =
    status === "processing";

  const isRefunded =
    status === "refunded";

  const isRejected =
    status === "rejected";

  const handleApprove = () => {
    onStatusUpdate(
      order._id,
      "approved"
    );
  };

  const handleReject = () => {
    onStatusUpdate(
      order._id,
      "rejected"
    );
  };

  const handleProcessing = () => {
    onStatusUpdate(
      order._id,
      "processing"
    );
  };

  const handleRefund = () => {
    onStatusUpdate(
      order._id,
      "refunded"
    );
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
      <DialogContent
        className="
          w-[95vw]
          max-w-3xl
          max-h-[90vh]
          overflow-hidden
          p-0
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <RotateCcw className="h-5 w-5" />

            Return / Refund Review
          </DialogTitle>

          <DialogDescription>
            Review the customer's return or refund request.
          </DialogDescription>
        </DialogHeader>

        {/* =====================================================
            SCROLLABLE CONTENT
        ====================================================== */}

        <div
          className="
            max-h-[calc(90vh-90px)]
            overflow-y-auto
            px-6
            py-6
          "
        >
          <div className="space-y-6">

            {/* =================================================
                ORDER SUMMARY
            ================================================== */}

            <div className="rounded-xl border bg-slate-50 p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs font-medium uppercase text-slate-500">
                    Order
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {order.orderNumber}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Order ID: {order._id}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs font-medium uppercase text-slate-500">
                    Order Total
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    Rs.{" "}
                    {order.total.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

              </div>
            </div>

            {/* =================================================
                CUSTOMER
            ================================================== */}

            <div className="rounded-xl border bg-white p-5">

              <h3 className="mb-4 font-semibold text-slate-900">
                Customer Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <p className="text-xs text-slate-500">
                    Customer
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {order.customer.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 break-all font-medium text-slate-900">
                    {order.customer.email}
                  </p>
                </div>

                {order.customer.phone && (
                  <div>
                    <p className="text-xs text-slate-500">
                      Phone
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {order.customer.phone}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-slate-500">
                    Payment
                  </p>

                  <p className="mt-1 font-medium capitalize text-slate-900">
                    {order.paymentMethod}
                  </p>
                </div>

              </div>
            </div>

            {/* =================================================
                RETURN STATUS
            ================================================== */}

            <div className="rounded-xl border bg-white p-5">

              <h3 className="mb-4 font-semibold text-slate-900">
                Return / Refund Status
              </h3>

              <div className="flex items-center gap-3">

                {status === "requested" && (
                  <>
                    <Clock className="h-5 w-5 text-amber-600" />

                    <span className="font-semibold text-amber-700">
                      Return / Refund Requested
                    </span>
                  </>
                )}

                {status === "approved" && (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />

                    <span className="font-semibold text-blue-700">
                      Request Approved
                    </span>
                  </>
                )}

                {status === "processing" && (
                  <>
                    <RotateCcw className="h-5 w-5 text-purple-600" />

                    <span className="font-semibold text-purple-700">
                      Refund Processing
                    </span>
                  </>
                )}

                {status === "refunded" && (
                  <>
                    <Banknote className="h-5 w-5 text-emerald-600" />

                    <span className="font-semibold text-emerald-700">
                      Refunded
                    </span>
                  </>
                )}

                {status === "rejected" && (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />

                    <span className="font-semibold text-red-700">
                      Request Rejected
                    </span>
                  </>
                )}

                {status === "none" && (
                  <>
                    <Clock className="h-5 w-5 text-slate-400" />

                    <span className="font-semibold text-slate-500">
                      No Return / Refund Request
                    </span>
                  </>
                )}

              </div>
            </div>

            {/* =================================================
                ORDER ITEMS
            ================================================== */}

            <div className="rounded-xl border bg-white">

              <div className="border-b px-5 py-4">
                <h3 className="font-semibold text-slate-900">
                  Order Items
                </h3>
              </div>

              <div className="divide-y">

                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="
                      flex
                      flex-col
                      gap-3
                      px-5
                      py-4
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >

                    <div>
                      <p className="font-medium text-slate-900">
                        {item.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold text-slate-900">
                      Rs.{" "}
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>
                ))}

              </div>
            </div>

            {/* =================================================
                SHIPPING ADDRESS
            ================================================== */}

            <div className="rounded-xl border bg-white p-5">

              <h3 className="mb-4 font-semibold text-slate-900">
                Shipping Address
              </h3>

              <div className="flex gap-3">

                <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

                <div>
                  <p className="font-medium text-slate-900">
                    {order.shippingAddress.address}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.country}
                  </p>
                </div>

              </div>
            </div>

            {/* =================================================
                ACTIONS
            ================================================== */}

            {isPending && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">

                <h3 className="font-semibold text-slate-900">
                  Review Request
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Choose whether to approve or reject this
                  return/refund request.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReject}
                    className="
                      border-red-200
                      text-red-600
                      hover:bg-red-50
                    "
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>

                  <Button
                    type="button"
                    onClick={handleApprove}
                    className="
                      bg-emerald-600
                      text-white
                      hover:bg-emerald-700
                    "
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve
                  </Button>

                </div>
              </div>
            )}

            {/* =================================================
                APPROVED ACTION
            ================================================== */}

            {isApproved && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">

                <h3 className="font-semibold text-slate-900">
                  Return Approved
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  The return has been approved. You can now
                  start the refund process.
                </p>

                <div className="mt-5 flex justify-end">

                  <Button
                    type="button"
                    onClick={handleProcessing}
                    className="
                      bg-purple-600
                      text-white
                      hover:bg-purple-700
                    "
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Start Refund
                  </Button>

                </div>
              </div>
            )}

            {/* =================================================
                PROCESSING ACTION
            ================================================== */}

            {isProcessing && (
              <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">

                <h3 className="font-semibold text-slate-900">
                  Refund Processing
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Mark the refund as completed after the money
                  has been returned to the customer.
                </p>

                <div className="mt-5 flex justify-end">

                  <Button
                    type="button"
                    onClick={handleRefund}
                    className="
                      bg-emerald-600
                      text-white
                      hover:bg-emerald-700
                    "
                  >
                    <Banknote className="mr-2 h-4 w-4" />
                    Mark as Refunded
                  </Button>

                </div>
              </div>
            )}

            {/* =================================================
                COMPLETED
            ================================================== */}

            {isRefunded && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">

                <div className="flex items-center gap-3">

                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />

                  <div>
                    <h3 className="font-semibold text-emerald-800">
                      Refund Completed
                    </h3>

                    <p className="mt-1 text-sm text-emerald-700">
                      The refund has been successfully completed.
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* =================================================
                REJECTED
            ================================================== */}

            {isRejected && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-5">

                <div className="flex items-center gap-3">

                  <XCircle className="h-6 w-6 text-red-600" />

                  <div>
                    <h3 className="font-semibold text-red-800">
                      Request Rejected
                    </h3>

                    <p className="mt-1 text-sm text-red-700">
                      This return/refund request has been rejected.
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* =================================================
                CLOSE
            ================================================== */}

            <div className="flex justify-end border-t pt-5">

              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>

            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}