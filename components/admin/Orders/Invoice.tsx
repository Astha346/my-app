"use client";

import {
  CalendarDays,
  CreditCard,
  MapPin,
  Printer,
  User,
  X,
} from "lucide-react";

import { Order } from "@/types/order";

interface InvoiceProps {
  order: Order;
  onClose: () => void;
}

export default function Invoice({
  order,
  onClose,
}: InvoiceProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const paymentMethod = {
    cod: "Cash on Delivery",
    esewa: "eSewa",
    khalti: "Khalti",
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-3 sm:p-5">

      {/* ================= DIALOG ================= */}

      <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ================= TOP BAR ================= */}

        <div className="flex shrink-0 items-center justify-between border-b bg-white px-5 py-4 sm:px-6">

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Invoice
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              {order.orderNumber}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* ================= SCROLLABLE CONTENT ================= */}

        <div className="overflow-y-auto bg-gray-100 p-3 sm:p-6">

          {/* ================= INVOICE PAPER ================= */}

          <div className="mx-auto w-full max-w-4xl bg-white p-5 shadow-sm sm:p-8 lg:p-10">

            {/* ================= HEADER ================= */}

            <div className="flex flex-col gap-6 border-b pb-7 sm:flex-row sm:items-start sm:justify-between">

              {/* STORE */}

              <div>

                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  MY STORE
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Your trusted online store
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Kathmandu, Nepal
                </p>

                <p className="text-sm text-gray-500">
                  support@mystore.com
                </p>

              </div>

              {/* INVOICE INFO */}

              <div className="sm:text-right">

                <h2 className="text-2xl font-bold uppercase tracking-wide text-gray-900 sm:text-3xl">
                  Invoice
                </h2>

                <div className="mt-3 space-y-1">

                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">
                      Invoice:
                    </span>{" "}
                    {order.orderNumber}
                  </p>

                  <p className="flex items-center gap-2 text-sm text-gray-500 sm:justify-end">
                    <CalendarDays className="h-4 w-4" />
                    {formatDate(order.createdAt)}
                  </p>

                </div>

              </div>

            </div>

            {/* ================= CUSTOMER / SHIPPING ================= */}

            <div className="grid grid-cols-1 gap-4 py-7 sm:grid-cols-2">

              {/* CUSTOMER */}

              <div className="rounded-xl border bg-gray-50 p-5">

                <div className="mb-4 flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Bill To
                    </p>

                    <p className="font-semibold text-gray-900">
                      Customer
                    </p>
                  </div>

                </div>

                <div className="space-y-1">

                  <p className="font-semibold text-gray-900">
                    {order.customer.name}
                  </p>

                  <p className="break-all text-sm text-gray-500">
                    {order.customer.email}
                  </p>

                  {order.customer.phone && (
                    <p className="text-sm text-gray-500">
                      {order.customer.phone}
                    </p>
                  )}

                </div>

              </div>

              {/* SHIPPING */}

              <div className="rounded-xl border bg-gray-50 p-5">

                <div className="mb-4 flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                    <MapPin className="h-4 w-4 text-gray-600" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Ship To
                    </p>

                    <p className="font-semibold text-gray-900">
                      Delivery Address
                    </p>
                  </div>

                </div>

                <div className="space-y-1">

                  <p className="font-medium text-gray-900">
                    {order.shippingAddress.address}
                  </p>

                  <p className="text-sm text-gray-500">
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.country}
                  </p>

                </div>

              </div>

            </div>

            {/* ================= ORDER ITEMS ================= */}

            <div className="overflow-hidden rounded-xl border">

              <div className="border-b bg-gray-900 px-4 py-3 sm:px-5">

                <h3 className="text-sm font-semibold text-white">
                  Order Items
                </h3>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full min-w-[600px] border-collapse">

                  <thead>

                    <tr className="border-b bg-gray-50">

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Product
                      </th>

                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Qty
                      </th>

                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Unit Price
                      </th>

                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Amount
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y">

                    {order.items.map((item) => (

                      <tr key={item.productId}>

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-3">

                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-11 w-11 shrink-0 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                                N/A
                              </div>
                            )}

                            <div className="min-w-0">

                              <p className="font-medium text-gray-900">
                                {item.name}
                              </p>

                              <p className="text-xs text-gray-400">
                                Product ID: {item.productId}
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-4 py-4 text-center text-sm text-gray-600">
                          {item.quantity}
                        </td>

                        <td className="px-4 py-4 text-right text-sm text-gray-600">
                          Rs.{" "}
                          {item.price.toLocaleString()}
                        </td>

                        <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
                          Rs.{" "}
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString()}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

            {/* ================= PAYMENT + TOTAL ================= */}

            <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2">

              {/* PAYMENT */}

              <div className="rounded-xl border p-5">

                <div className="mb-4 flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Payment
                    </p>

                    <p className="font-semibold text-gray-900">
                      Payment Information
                    </p>

                  </div>

                </div>

                <div className="space-y-3">

                  <div className="flex items-center justify-between gap-3">

                    <span className="text-sm text-gray-500">
                      Method
                    </span>

                    <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                      {
                        paymentMethod[
                          order.paymentMethod
                        ]
                      }
                    </span>

                  </div>

                  <div className="flex items-center justify-between gap-3">

                    <span className="text-sm text-gray-500">
                      Status
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.paymentStatus === "paid"
                          ? "bg-green-50 text-green-600"
                          : order.paymentStatus === "failed"
                          ? "bg-red-50 text-red-600"
                          : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      {order.paymentStatus
                        .charAt(0)
                        .toUpperCase() +
                        order.paymentStatus.slice(1)}
                    </span>

                  </div>

                </div>

              </div>

              {/* TOTAL */}

              <div className="rounded-xl border bg-gray-50 p-5">

                <div className="space-y-3">

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="font-medium text-gray-900">
                      Rs.{" "}
                      {order.subtotal.toLocaleString()}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Shipping
                    </span>

                    <span className="font-medium text-gray-900">
                      Rs.{" "}
                      {order.shipping.toLocaleString()}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Discount
                    </span>

                    <span className="font-medium text-red-500">
                      - Rs.{" "}
                      {order.discount.toLocaleString()}
                    </span>

                  </div>

                  <div className="border-t pt-4">

                    <div className="flex items-center justify-between">

                      <span className="font-bold text-gray-900">
                        Grand Total
                      </span>

                      <span className="text-2xl font-bold text-gray-900">
                        Rs.{" "}
                        {order.total.toLocaleString()}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* ================= FOOTER ================= */}

            <div className="mt-8 border-t pt-6 text-center">

              <p className="font-semibold text-gray-900">
                Thank you for your order!
              </p>

              <p className="mt-1 text-sm text-gray-500">
                We appreciate your business.
              </p>

              <p className="mt-2 text-xs text-gray-400">
                This is a computer-generated invoice.
              </p>

            </div>

          </div>

        </div>

        {/* ================= BOTTOM ACTION BAR ================= */}

        <div className="flex shrink-0 items-center justify-end gap-3 border-t bg-white px-5 py-4 sm:px-6">

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <X className="h-4 w-4" />
            Close
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <Printer className="h-4 w-4" />
            Print Invoice
          </button>

        </div>

      </div>
    </div>
  );
}