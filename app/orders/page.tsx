
"use client";

import { useEffect, useState } from "react";
import {
  Package,
  MapPin,
  CreditCard,
  CalendarDays,
  ChevronRight,
  ShoppingBag,
  X,
  RotateCcw,
} from "lucide-react";
import api from "@/lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // VIEW DETAILS
  // ================================
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // ================================
  // RETURN / REFUND REQUEST
  // ================================
  const [returnOrder, setReturnOrder] = useState<any | null>(null);
  const [selectedReturnItems, setSelectedReturnItems] = useState<string[]>([]);
  const [returnReason, setReturnReason] = useState("");
  const [returnNote, setReturnNote] = useState("");
  const [refundMethod, setRefundMethod] = useState("cod");
  const [submittingReturn, setSubmittingReturn] = useState(false);

  // ================================
  // FETCH CUSTOMER ORDERS
  // ================================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    console.log("ORDER USER =", user);

    const id = user.id || user._id;

    if (!id) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get(`/orders/${id}`);

        console.log("ORDERS =", res.data);

        setOrders(res.data || []);
      } catch (err) {
        console.log("ORDER ERROR =", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ================================
  // OPEN RETURN / REFUND FORM
  // ================================
  const openReturnRequest = (order: any) => {
    setReturnOrder(order);
    setSelectedReturnItems([]);
    setReturnReason("");
    setReturnNote("");

    const method = String(order.paymentMethod || "").toLowerCase();

    setRefundMethod(
      ["cod", "esewa", "khalti"].includes(method) ? method : "cod"
    );
  };

  // ================================
  // SUBMIT RETURN / REFUND REQUEST
  // ================================
  const submitReturnRequest = async () => {
    if (!returnOrder || submittingReturn) {
      return;
    }

    if (returnOrder.status?.toLowerCase() !== "delivered") {
      alert("Only delivered orders can be returned.");
      return;
    }

    if (selectedReturnItems.length === 0) {
      alert("Please select at least one item.");
      return;
    }

    if (!returnReason.trim()) {
      alert("Please select a return/refund reason.");
      return;
    }

    const selectedItems = (returnOrder.items || []).filter((item: any) =>
    selectedReturnItems.includes(String(item.productId))
     );

    if (selectedItems.length !== selectedReturnItems.length) {
      alert("Some selected items could not be found. Please select them again.");
      return;
    }

    const refundAmount = selectedItems.reduce(
      (total: number, item: any) =>
        total + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );

    if (!Number.isFinite(refundAmount) || refundAmount <= 0) {
      alert("Unable to calculate the refund amount for the selected items.");
      return;
    }

    try {
      setSubmittingReturn(true);

      await api.post(`/orders/${returnOrder._id}/return-refund`, {
        itemIds: selectedReturnItems,
        reason: returnReason,
        customerNote: returnNote.trim(),
        refundMethod,
        refundAmount,
      });

      // Update the displayed order without changing other order information.
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === returnOrder._id
            ? {
                ...order,
                returnRefundStatus: "requested",
              }
            : order
        )
      );

      setReturnOrder(null);
      setSelectedReturnItems([]);
      setReturnReason("");
      setReturnNote("");

      alert("Return/refund request submitted successfully.");
    } catch (error: any) {
      console.error("Failed to submit return/refund request:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to submit return/refund request."
      );
    } finally {
      setSubmittingReturn(false);
    }
  };

  // ================================
  // STATUS STYLE
  // ================================
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";

      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "processing":
        return "bg-purple-100 text-purple-700 border-purple-200";

      case "confirmed":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";

      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  // ================================
  // LOADING
  // ================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="mb-8">
            <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200" />
            <div className="mt-3 h-4 w-64 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="h-5 w-32 rounded bg-gray-200" />
                    <div className="mt-3 h-4 w-48 rounded bg-gray-200" />
                  </div>
                  <div className="h-7 w-20 rounded-full bg-gray-200" />
                </div>

                <div className="mt-6 h-16 rounded-xl bg-gray-100" />
                <div className="mt-5 h-4 w-32 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* =================================
          PAGE HEADER
      ================================= */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
              <Package size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                My Orders
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View and track your recent orders
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =================================
          CONTENT
      ================================= */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* ORDER COUNT */}
        {orders.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Your Orders
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {orders.length} {orders.length === 1 ? "order" : "orders"} placed
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
              {orders.length}
            </div>
          </div>
        )}

        {/* =================================
            EMPTY STATE
        ================================= */}
        {orders.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 text-pink-500">
              <ShoppingBag size={36} />
            </div>

            <h2 className="mt-6 text-xl font-bold text-gray-900">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              You haven&apos;t placed any orders yet. Start shopping and your
              orders will appear here.
            </p>
          </div>
        ) : (
          /* =================================
             ORDER LIST
          ================================= */
          <div className="space-y-5">
            {orders.map((order) => {
              const returnStatus = String(
                order.returnRefundStatus || ""
              ).toLowerCase();

              const hasActiveReturn = [
                "requested",
                "approved",
                "refunded",
              ].includes(returnStatus);

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* ORDER TOP */}
                  <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Package size={17} className="text-pink-600" />

                          <p className="text-sm font-bold text-gray-900">
                            Order #{order._id?.slice(-6)}
                          </p>
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <CalendarDays size={14} />

                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString()
                            : "Date not available"}
                        </div>
                      </div>

                      <span
                        className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* RETURN / REFUND STATUS */}
                    {returnStatus && returnStatus !== "none" && (
                      <div className="mt-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-semibold capitalize text-pink-700">
                          <RotateCcw size={13} />
                          Return / Refund: {returnStatus}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ORDER BODY */}
                  <div className="px-5 py-5 sm:px-6">
                    {/* PRODUCTS */}
                    <div>
                      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
                        Items
                      </p>

                      <div className="space-y-3">
                        {order.items?.map((item: any, index: number) => (
                          <div
                            key={item._id || item.productId || index}
                            className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
                          >
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name || "Product"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Package
                                  size={22}
                                  className="text-gray-300"
                                />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-gray-800">
                                {item.name || "Product"}
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                Quantity: {item.quantity || 1}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ORDER INFORMATION */}
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {/* TOTAL */}
                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs font-medium text-gray-400">
                          Order Total
                        </p>

                        <p className="mt-1 text-lg font-extrabold text-gray-900">
                          ${order.total}
                        </p>
                      </div>

                      {/* PAYMENT */}
                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <div className="flex items-center gap-2">
                          <CreditCard
                            size={16}
                            className="text-gray-400"
                          />

                          <p className="text-xs font-medium text-gray-400">
                            Payment
                          </p>
                        </div>

                        <p className="mt-1 text-sm font-bold capitalize text-gray-800">
                          {order.paymentMethod || "Not available"}
                        </p>

                        {order.paymentStatus && (
                          <p className="mt-1 text-xs capitalize text-gray-500">
                            {order.paymentStatus}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* DELIVERY ADDRESS */}
                    {order.deliveryAddress && (
                      <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <div className="flex items-start gap-2">
                          <MapPin
                            size={17}
                            className="mt-0.5 shrink-0 text-pink-500"
                          />

                          <div>
                            <p className="text-xs font-medium text-gray-400">
                              Delivery Address
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-700">
                              {order.deliveryAddress}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ORDER FOOTER */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">
                    <p className="hidden text-xs text-gray-400 sm:block">
                      Order ID: {order._id}
                    </p>

                    <div className="ml-auto flex flex-wrap items-center gap-2">
                      {/* REQUEST RETURN / REFUND */}
                      {order.status?.toLowerCase() === "delivered" &&
                        !hasActiveReturn && (
                          <button
                            type="button"
                            onClick={() => openReturnRequest(order)}
                            className="flex items-center gap-1.5 rounded-lg border border-pink-200 px-3 py-2 text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
                          >
                            <RotateCcw size={15} />
                            Request Return / Refund
                          </button>
                        )}

                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
                      >
                        View Details
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =================================
          ORDER DETAILS MODAL
      ================================= */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-lg font-bold text-gray-900">
                  Order Details
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  #{selectedOrder._id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="space-y-5 p-5 sm:p-6">
              {/* STATUS */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-xs text-gray-400">Order Status</p>

                  <p className="mt-1 text-sm font-semibold capitalize text-gray-800">
                    {selectedOrder.status}
                  </p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>

              {/* ORDER DATE */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">Order Date</p>

                  <p className="text-sm font-semibold text-gray-800">
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleString()
                      : "Date not available"}
                  </p>
                </div>
              </div>

              {/* PRODUCTS */}
              <div>
                <h3 className="mb-3 text-sm font-bold text-gray-900">
                  Ordered Items
                </h3>

                <div className="space-y-3">
                  {selectedOrder.items?.map(
                    (item: any, index: number) => (
                      <div
                        key={item._id || item.productId || index}
                        className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
                      >
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name || "Product"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package
                              size={22}
                              className="text-gray-300"
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-800">
                            {item.name || "Product"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Quantity: {item.quantity || 1}
                          </p>
                        </div>

                        {item.price !== undefined && (
                          <p className="text-sm font-bold text-gray-800">
                            ${item.price}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* PAYMENT */}
              <div className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <CreditCard size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Payment Method</p>

                    <p className="mt-1 text-sm font-bold capitalize text-gray-800">
                      {selectedOrder.paymentMethod || "Not available"}
                    </p>

                    {selectedOrder.paymentStatus && (
                      <p className="mt-1 text-xs capitalize text-gray-500">
                        Status: {selectedOrder.paymentStatus}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* DELIVERY ADDRESS */}
              {selectedOrder.deliveryAddress && (
                <div className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                      <MapPin size={18} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Delivery Address
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {selectedOrder.deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TOTAL */}
              <div className="rounded-xl bg-gray-900 p-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">
                    Total Amount
                  </span>

                  <span className="text-2xl font-extrabold">
                    ${selectedOrder.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================
          RETURN / REFUND REQUEST MODAL
      ================================= */}
      {returnOrder && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            if (!submittingReturn) {
              setReturnOrder(null);
            }
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Request Return / Refund
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Order #{returnOrder._id?.slice(-6)}
                </p>
              </div>

              <button
                type="button"
                disabled={submittingReturn}
                onClick={() => setReturnOrder(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <p className="text-sm leading-6 text-gray-500">
                Select the items you want to return and tell us why you are
                requesting a return or refund.
              </p>

              {/* SELECT ITEMS */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-gray-800">
                  Select items
                </label>

                <div className="space-y-3">
                  {returnOrder.items?.map((item: any, index: number) => {
                    const itemId = item.productId ? String(item.productId) : "";
                    const checked =
                      !!itemId && selectedReturnItems.includes(itemId);

                    return (
                      <label
                        key={itemId || item.productId || index}
                        className={`flex gap-3 rounded-xl border p-3 ${
                          checked
                            ? "border-pink-400 bg-pink-50"
                            : "border-gray-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!itemId || submittingReturn}
                          onChange={(event) => {
                            if (!itemId) return;

                            setSelectedReturnItems((previous) =>
                              event.target.checked
                                ? previous.includes(itemId)
                                  ? previous
                                  : [...previous, itemId]
                                : previous.filter((id) => id !== itemId)
                            );
                          }}
                          className="mt-1 accent-pink-600"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-800">
                            {item.name || "Product"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Quantity: {item.quantity || 1}
                          </p>

                          <p className="mt-1 text-xs font-medium text-gray-700">
                            Price: Rs.{" "}
                            {Number(item.price || 0).toLocaleString()}
                          </p>

                          {!itemId && (
                            <p className="mt-1 text-xs text-red-500">
                              This item has no item ID and cannot be selected.
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* REASON */}
              <div>
                <label
                  htmlFor="return-reason"
                  className="mb-1.5 block text-sm font-semibold text-gray-800"
                >
                  Reason for return
                </label>

                <select
                  id="return-reason"
                  value={returnReason}
                  onChange={(event) => setReturnReason(event.target.value)}
                  disabled={submittingReturn}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-800 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                >
                  <option value="">Select a reason</option>
                  <option value="Damaged product">Damaged product</option>
                  <option value="Wrong product received">
                    Wrong product received
                  </option>
                  <option value="Product not as described">
                    Product not as described
                  </option>
                  <option value="Missing items">Missing items</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* ADDITIONAL DETAILS */}
              <div>
                <label
                  htmlFor="return-note"
                  className="mb-1.5 block text-sm font-semibold text-gray-800"
                >
                  Additional details (optional)
                </label>

                <textarea
                  id="return-note"
                  value={returnNote}
                  onChange={(event) => setReturnNote(event.target.value)}
                  disabled={submittingReturn}
                  rows={3}
                  placeholder="Describe the problem with your order..."
                  className="w-full resize-y rounded-xl border border-gray-300 px-3 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </div>

              {/* REFUND METHOD */}
              <div>
                <label
                  htmlFor="refund-method"
                  className="mb-1.5 block text-sm font-semibold text-gray-800"
                >
                  Preferred refund method
                </label>

                <select
                  id="refund-method"
                  value={refundMethod}
                  onChange={(event) => setRefundMethod(event.target.value)}
                  disabled={submittingReturn}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-800 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="esewa">eSewa</option>
                  <option value="khalti">Khalti</option>
                </select>
              </div>

              {/* ESTIMATED REFUND */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-500">
                  Estimated refund amount
                </p>

                <p className="mt-1 text-xl font-extrabold text-gray-900">
                  Rs.{" "}
                  {(returnOrder.items || [])
                    .filter((item: any) =>
                    selectedReturnItems.includes(String(item.productId))
                      )
                    .reduce(
                      (total: number, item: any) =>
                        total +
                        Number(item.price || 0) * Number(item.quantity || 1),
                      0
                    )
                    .toLocaleString()}
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  The final refund amount is subject to review. Shipping
                  charges or other adjustments may affect the final amount.
                </p>
              </div>

              {/* SUBMIT */}
              <button
                type="button"
                disabled={submittingReturn}
                onClick={submitReturnRequest}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RotateCcw size={16} />

                {submittingReturn
                  ? "Submitting Request..."
                  : "Submit Return / Refund Request"}
              </button>

              <p className="text-center text-xs leading-5 text-gray-400">
                Your request will be reviewed by the ShopEase team.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
