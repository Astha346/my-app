"use client";

import { MoreHorizontal } from "lucide-react";

import {
  Order,
} from "@/types/order";

import OrderStatusBadge from "./OrderStatusBadge";

interface Props {
  orders: Order[];
  onView: (order: Order) => void;
}

export default function OrderTable({
  orders,
  onView,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-4 text-left">
                Order
              </th>

              <th className="px-5 py-4 text-left">
                Customer
              </th>

              <th className="px-5 py-4 text-left">
                Date
              </th>

              <th className="px-5 py-4 text-center">
                Items
              </th>

              <th className="px-5 py-4 text-left">
                Amount
              </th>

              <th className="px-5 py-4 text-left">
                Payment
              </th>

              <th className="px-5 py-4 text-left">
                Status
              </th>

              <th className="px-5 py-4 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b last:border-0 hover:bg-gray-50"
              >
                <td className="px-5 py-4 font-medium">
                  {order.orderNumber}
                </td>

                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium">
                      {order.customer.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {order.customer.email}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="px-5 py-4 text-center">
                  {order.items.reduce(
                    (sum, item) =>
                      sum + item.quantity,
                    0
                  )}
                </td>

                <td className="px-5 py-4 font-medium">
                  Rs. {order.total.toLocaleString()}
                </td>

                <td className="px-5 py-4 uppercase">
                  {order.paymentMethod}
                </td>

                <td className="px-5 py-4">
                  <OrderStatusBadge
                    status={order.status}
                  />
                </td>

                <td className="px-5 py-4 text-center">
                  <button
                    onClick={() => onView(order)}
                    className="rounded-lg p-2 hover:bg-gray-100"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="p-10 text-center text-gray-500">
          No orders found.
        </div>
      )}
    </div>
  );
}