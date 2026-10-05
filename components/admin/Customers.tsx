
"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import {
  Search,
  Eye,
  X,
  Mail,
  User,
  Calendar,
  Users,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Phone,
  ShieldCheck,
  Copy,
  Check,
} from "lucide-react";

type Role = {
  _id: string;
  name: string;
};

type Customer = {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role?: Role;
  createdAt?: string;
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, itemsPerPage]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users");

      const users: Customer[] = response.data;

      const customerUsers = users.filter(
        (user) =>
          user.role?.name?.toLowerCase() === "customer"
      );

      setCustomers(customerUsers);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (username?: string) => {
    if (!username) return "U";

    return username
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const filteredCustomers = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return customers.filter((customer) => {
      const matchesSearch =
        customer.username?.toLowerCase().includes(searchText) ||
        customer.email?.toLowerCase().includes(searchText) ||
        customer.phone?.toLowerCase().includes(searchText);

      const matchesRole =
        roleFilter === "all" ||
        customer.role?.name?.toLowerCase() === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [customers, search, roleFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / itemsPerPage)
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const firstItem =
    filteredCustomers.length === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  const lastItem = Math.min(
    currentPage * itemsPerPage,
    filteredCustomers.length
  );

  const newCustomers = customers.filter((customer) => {
    if (!customer.createdAt) return false;

    const createdDate = new Date(customer.createdAt);
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return createdDate >= thirtyDaysAgo;
  }).length;

  const copyCustomerId = async () => {
    if (!selectedCustomer) return;

    await navigator.clipboard.writeText(selectedCustomer._id);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl border bg-gray-100"
            />
          ))}
        </div>

        <div className="h-96 animate-pulse rounded-xl border bg-gray-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-xl border bg-white">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <Users className="text-red-500" size={24} />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Unable to load customers
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchCustomers}
            className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Customers
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and view your registered customers.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-gray-600 shadow-sm">
          <Users size={17} />
          <span>
            {customers.length} total customers
          </span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Customers */}
        <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Customers
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {customers.length}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Registered customer accounts
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <Users
                size={21}
                className="text-blue-600"
              />
            </div>
          </div>
        </div>

        {/* New Customers */}
        <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                New Customers
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {newCustomers}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Joined in the last 30 days
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
              <UserPlus
                size={21}
                className="text-green-600"
              />
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Showing
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {filteredCustomers.length}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Customers matching current filters
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
              <Filter
                size={21}
                className="text-purple-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
            </select>

            <select
              value={itemsPerPage}
              onChange={(e) =>
                setItemsPerPage(Number(e.target.value))
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {(search || roleFilter !== "all") && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <Filter size={14} />

            <span>
              Showing {filteredCustomers.length} of{" "}
              {customers.length} customers
            </span>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
              }}
              className="font-medium text-gray-900 underline hover:no-underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Contact
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Role
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Joined
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                      <Search
                        size={24}
                        className="text-gray-400"
                      />
                    </div>

                    <h3 className="mt-4 font-semibold text-gray-900">
                      No customers found
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="border-b last:border-b-0 transition hover:bg-gray-50"
                  >
                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {customer.profileImage ? (
                          <img
                            src={customer.profileImage}
                            alt={customer.username}
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                            {getInitials(
                              customer.username
                            )}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900">
                            {customer.username}
                          </p>

                          <p className="mt-0.5 max-w-40 truncate text-xs text-gray-500">
                            ID: {customer._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail
                            size={15}
                            className="text-gray-400"
                          />
                          <span className="max-w-52 truncate">
                            {customer.email}
                          </span>
                        </div>

                        {customer.phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Phone
                              size={14}
                              className="text-gray-400"
                            />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                        <ShieldCheck size={13} />
                        Customer
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar
                          size={15}
                          className="text-gray-400"
                        />
                        {formatDate(customer.createdAt)}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedCustomer(customer)
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {paginatedCustomers.length === 0 ? (
          <div className="rounded-xl border bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Search
                size={24}
                className="text-gray-400"
              />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No customers found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          paginatedCustomers.map((customer) => (
            <div
              key={customer._id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {customer.profileImage ? (
                    <img
                      src={customer.profileImage}
                      alt={customer.username}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                      {getInitials(customer.username)}
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-gray-900">
                      {customer.username}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      {customer.email}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  Customer
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4">
                <div>
                  <p className="text-xs text-gray-500">
                    Joined
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {formatDate(customer.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {customer.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedCustomer(customer)
                }
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <Eye size={16} />
                View Customer
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredCustomers.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {firstItem}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-900">
              {lastItem}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">
              {filteredCustomers.length}
            </span>{" "}
            customers
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(1, page - 1)
                )
              }
              className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-black px-3 text-sm font-medium text-white">
              {currentPage}
            </div>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
              className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-gray-950 px-6 pb-16 pt-6">
              <button
                type="button"
                onClick={() =>
                  setSelectedCustomer(null)
                }
                className="absolute right-4 top-4 rounded-lg p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>

              <p className="text-sm font-medium text-gray-400">
                Customer Profile
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                Customer Details
              </h2>
            </div>

            {/* Profile */}
            <div className="relative px-6">
              <div className="-mt-10 flex items-end gap-4">
                {selectedCustomer.profileImage ? (
                  <img
                    src={selectedCustomer.profileImage}
                    alt={selectedCustomer.username}
                    className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-md"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gray-900 text-xl font-bold text-white shadow-md">
                    {getInitials(
                      selectedCustomer.username
                    )}
                  </div>
                )}

                <div className="pb-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedCustomer.username}
                  </h3>

                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    <ShieldCheck size={12} />
                    Customer
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border bg-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    <Mail
                      size={17}
                      className="text-gray-500"
                    />

                    <p className="text-xs font-medium text-gray-500">
                      Email
                    </p>
                  </div>

                  <p className="mt-2 break-all text-sm font-semibold text-gray-900">
                    {selectedCustomer.email}
                  </p>
                </div>

                <div className="rounded-xl border bg-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    <Phone
                      size={17}
                      className="text-gray-500"
                    />

                    <p className="text-xs font-medium text-gray-500">
                      Phone
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    {selectedCustomer.phone ||
                      "Not provided"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border bg-gray-50 p-4">
                <div className="flex items-center gap-2">
                  <Calendar
                    size={17}
                    className="text-gray-500"
                  />

                  <p className="text-xs font-medium text-gray-500">
                    Joined
                  </p>
                </div>

                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {formatDate(
                    selectedCustomer.createdAt
                  )}
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">
                      Customer ID
                    </p>

                    <p className="mt-1 break-all text-sm text-gray-800">
                      {selectedCustomer._id}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={copyCustomerId}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t bg-gray-50 p-4">
              <button
                type="button"
                onClick={() =>
                  setSelectedCustomer(null)
                }
                className="rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

