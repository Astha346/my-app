"use client";

import axios from "axios";
import {
  Eye,
  Pencil,
  Trash2,
  ArrowUpRight,
} from "lucide-react";

interface RecentOrdersProps {
  orders: any[];
  setSelectedOrder: (order: any) => void;
  setDeleteOrder: (order: any) => void;
  setOrders: (orders: any[]) => void;
}

export default function RecentOrders({
  orders,
  setSelectedOrder,
  setDeleteOrder,
}: RecentOrdersProps) {
  return (
    <div className="lg:col-span-2 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Recent Orders
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest orders from your customers
          </p>
        </div>

        <button className="group flex items-center gap-1 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100">
          View All
          <ArrowUpRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full min-w-[750px]">

          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Order
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Customer
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Amount
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {orders.map((order: any) => (

              <tr
                key={order._id}
                className="border-b border-slate-100 transition-colors duration-200 hover:bg-slate-50/70"
              >

                {/* Order */}
                <td className="px-6 py-5">

                  <span className="font-semibold text-slate-800">
                    #{order._id.slice(-6)}
                  </span>

                </td>

                {/* Customer */}
                <td className="px-6 py-5">

                  <span className="font-medium text-slate-700">
                    {order.customerName}
                  </span>

                </td>

                {/* Amount */}
                <td className="px-6 py-5">

                  <span className="font-semibold text-slate-900">
                    Rs {order.total.toFixed(2)}
                  </span>

                </td>

                {/* Status */}
                <td className="px-6 py-5">

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold
                    ${
                      order.status === "Pending"
                        ? "bg-yellow-50 text-yellow-700"
                        : order.status === "Processing"
                        ? "bg-blue-50 text-blue-700"
                        : order.status === "Completed"
                        ? "bg-green-50 text-green-700"
                        : order.status === "Cancelled"
                        ? "bg-red-50 text-red-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >

                    <span
                      className={`h-2 w-2 rounded-full
                      ${
                        order.status === "Pending"
                          ? "bg-yellow-500"
                          : order.status === "Processing"
                          ? "bg-blue-500"
                          : order.status === "Completed"
                          ? "bg-green-500"
                          : order.status === "Cancelled"
                          ? "bg-red-500"
                          : "bg-slate-400"
                      }`}
                    />

                    {order.status}

                  </span>

                </td>

                {/* Actions */}
                <td className="px-6 py-5">

                  <div className="flex items-center gap-2">

                    {/* View */}
                    <button
                      title="View order"
                      className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                      onClick={() =>
                        setSelectedOrder(order)
                      }
                    >
                      <Eye size={17} />
                    </button>

                    {/* Edit */}
                    <button
                      title="Edit order"
                      className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
                      onClick={async () => {

                        const status = prompt(
                          "Enter status:\nPending\nProcessing\nCompleted\nCancelled"
                        );

                        if (!status) return;

                        await axios.patch(
                          `http://localhost:3001/orders/${order._id}/status`,
                          {
                            status,
                          }
                        );

                        window.location.reload();

                      }}
                    >
                      <Pencil size={17} />
                    </button>

                    {/* Delete */}
                    <button
                      title="Delete order"
                      className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                      onClick={() =>
                        setDeleteOrder(order)
                      }
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}