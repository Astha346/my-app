"use client";

import { Search } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  payment: string;
  setPayment: (value: string) => void;
}

export default function OrderFilters({
  search,
  setSearch,
  status,
  setStatus,
  payment,
  setPayment,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Search */}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search order or customer..."
            className="h-10 w-full rounded-lg border pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Status */}

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="h-10 rounded-lg border px-3 text-sm outline-none"
        >
          <option value="all">
            All Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="confirmed">
            Confirmed
          </option>

          <option value="processing">
            Processing
          </option>

          <option value="shipped">
            Shipped
          </option>

          <option value="delivered">
            Delivered
          </option>

          <option value="cancelled">
            Cancelled
          </option>
        </select>

        {/* Payment */}

        <select
          value={payment}
          onChange={(e) =>
            setPayment(e.target.value)
          }
          className="h-10 rounded-lg border px-3 text-sm outline-none"
        >
          <option value="all">
            All Payments
          </option>

          <option value="cod">
            Cash on Delivery
          </option>

          <option value="esewa">
            eSewa
          </option>

          <option value="khalti">
            Khalti
          </option>
        </select>
      </div>
    </div>
  );
}