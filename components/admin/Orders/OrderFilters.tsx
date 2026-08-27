"use client";

import { Search, X } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  payment: string;
  setPayment: (value: string) => void;

  paymentStatus: string;
  setPaymentStatus: (value: string) => void;
}

export default function OrderFilters({
  search,
  setSearch,
  status,
  setStatus,
  payment,
  setPayment,
  paymentStatus,
  setPaymentStatus,
}: Props) {
  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setPayment("all");
    setPaymentStatus("all");
  };

  const hasFilters =
    search !== "" ||
    status !== "all" ||
    payment !== "all" ||
    paymentStatus !== "all";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* SEARCH */}

        <div className="relative">

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search order or customer..."
            className="
              h-10
              w-full
              rounded-lg
              border
              border-slate-200
              bg-white
              pl-10
              pr-3
              text-sm
              outline-none
              focus:border-slate-400
              focus:ring-2
              focus:ring-slate-100
            "
          />

        </div>

        {/* ORDER STATUS */}

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="
            h-10
            rounded-lg
            border
            border-slate-200
            bg-white
            px-3
            text-sm
            outline-none
          "
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

        {/* PAYMENT METHOD */}

        <select
          value={payment}
          onChange={(e) =>
            setPayment(e.target.value)
          }
          className="
            h-10
            rounded-lg
            border
            border-slate-200
            bg-white
            px-3
            text-sm
            outline-none
          "
        >
          <option value="all">
            All Payment Methods
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

        {/* PAYMENT STATUS */}

        <select
          value={paymentStatus}
          onChange={(e) =>
            setPaymentStatus(e.target.value)
          }
          className="
            h-10
            rounded-lg
            border
            border-slate-200
            bg-white
            px-3
            text-sm
            outline-none
          "
        >
          <option value="all">
            All Payment Status
          </option>

          <option value="paid">
            Paid
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="failed">
            Failed
          </option>
        </select>

      </div>

      {/* FOOTER */}

      <div className="mt-4 flex items-center justify-between">

        <p className="text-xs text-slate-400">
          Search and filter your orders
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              border
              border-slate-200
              px-3
              py-1.5
              text-xs
              font-medium
              text-slate-600
              hover:bg-slate-50
            "
          >
            <X className="h-3.5 w-3.5" />
            Clear Filters
          </button>
        )}

      </div>

    </div>
  );
}