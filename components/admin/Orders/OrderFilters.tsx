"use client";

import { Search, X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  search: string;
  status: string;
  payment: string;
  paymentStatus: string;

  setSearch?: (value: string) => void;
  setStatus?: (value: string) => void;
  setPayment?: (value: string) => void;
  setPaymentStatus?: (value: string) => void;

  onSearchChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onPaymentChange?: (value: string) => void;
  onPaymentStatusChange?: (value: string) => void;

  dateFrom?: Date;
  dateTo?: Date;

  setDateFrom?: (value: Date | undefined) => void;
  setDateTo?: (value: Date | undefined) => void;

  onApplyFilters?: () => void;
}

export default function OrderFilters({
  search,
  status,
  payment,
  paymentStatus,

  setSearch,
  setStatus,
  setPayment,
  setPaymentStatus,

  onSearchChange,
  onStatusChange,
  onPaymentChange,
  onPaymentStatusChange,

  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,

  onApplyFilters,
}: Props) {
  const handleSearch = (value: string) => {
    setSearch?.(value);
    onSearchChange?.(value);
  };

  const handleStatus = (value: string) => {
    setStatus?.(value);
    onStatusChange?.(value);
  };

  const handlePayment = (value: string) => {
    setPayment?.(value);
    onPaymentChange?.(value);
  };

  const handlePaymentStatus = (value: string) => {
    setPaymentStatus?.(value);
    onPaymentStatusChange?.(value);
  };

  const handleDateFrom = (date: Date | undefined) => {
    setDateFrom?.(date);
  };

  const handleDateTo = (date: Date | undefined) => {
    setDateTo?.(date);
  };

  const clearFilters = () => {
    setSearch?.("");
    setStatus?.("");
    setPayment?.("");
    setPaymentStatus?.("");

    setDateFrom?.(undefined);
    setDateTo?.(undefined);

    onApplyFilters?.();
  };

  const hasFilters =
    search !== "" ||
    status !== "" ||
    payment !== "" ||
    paymentStatus !== "" ||
    !!dateFrom ||
    !!dateTo;

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Search
          </label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search orders..."
              className="h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />
          </div>
        </div>

        {/* Order Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Order Status
          </label>

          <select
            value={status}
            onChange={(e) => handleStatus(e.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Payment Method
          </label>

          <select
            value={payment}
            onChange={(e) => handlePayment(e.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          >
            <option value="">All Methods</option>
            <option value="cod">COD</option>
            <option value="esewa">eSewa</option>
            <option value="khalti">Khalti</option>
          </select>
        </div>

        {/* Payment Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Payment Status
          </label>

          <select
            value={paymentStatus}
            onChange={(e) => handlePaymentStatus(e.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          >
            <option value="">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Date From */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Date From
          </label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />

                {dateFrom ? (
                  format(dateFrom, "dd/MM/yyyy")
                ) : (
                  <span className="text-gray-500">
                    Select date
                  </span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={handleDateFrom}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date To */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Date To
          </label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />

                {dateTo ? (
                  format(dateTo, "dd/MM/yyyy")
                ) : (
                  <span className="text-gray-500">
                    Select date
                  </span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={handleDateTo}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex items-center justify-end gap-3 border-t pt-4">
        {hasFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}

        <Button
          type="button"
          onClick={onApplyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}