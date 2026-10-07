"use client";

import { useState } from "react";
import {
  Monitor,
  Wrench,
  Store,
  DollarSign,
  CalendarDays,
  Trash2,
  Server,
  CheckCircle2,
} from "lucide-react";

export default function SystemSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [storeOpen, setStoreOpen] = useState(true);
  const [currency, setCurrency] = useState("NPR");
  const [storeStartDate, setStoreStartDate] = useState("");

  return (
    <div>
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Monitor size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              System Settings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage store status and basic system preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {/* Maintenance Mode */}
        <div className="flex items-center justify-between gap-6 px-6 py-6">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Wrench size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Maintenance Mode
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Temporarily disable customer access while system maintenance
                is being performed.
              </p>

              {maintenanceMode && (
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
                  <Wrench size={12} />
                  Maintenance active
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              maintenanceMode ? "bg-indigo-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                maintenanceMode ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Store Status */}
        <div className="flex items-center justify-between gap-6 px-6 py-6">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Store size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Store Status
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Control whether customers can currently access and place
                orders.
              </p>

              <span
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                  storeOpen
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <CheckCircle2 size={12} />
                {storeOpen ? "Store Open" : "Store Closed"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStoreOpen(!storeOpen)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              storeOpen ? "bg-indigo-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                storeOpen ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* System Preferences */}
        <div className="px-6 py-6">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900">
              System Preferences
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Configure the default settings used throughout the dashboard.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Currency */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <DollarSign size={16} className="text-slate-400" />
                Default Currency
              </label>

              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="NPR">NPR - Nepalese Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>

            {/* Store Start Date */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CalendarDays size={16} className="text-slate-400" />
                Store Start Date
              </label>

              <input
                type="date"
                value={storeStartDate}
                onChange={(e) => setStoreStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Select the date when your store started operating.
              </p>
            </div>
          </div>
        </div>

        {/* Clear Cache */}
        <div className="flex items-center justify-between gap-6 px-6 py-6">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Trash2 size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Clear System Cache
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Clear temporary cached data used by the application.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="shrink-0 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Clear Cache
          </button>
        </div>

        {/* System Information */}
        <div className="px-6 py-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Server size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                System Information
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Current application information.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Application</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                ShopEase
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Frontend</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                Next.js
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Backend</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                NestJS
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-400">
          System settings are currently frontend-only.
        </p>

        <button
          type="button"
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
        >
          Save System Settings
        </button>
      </div>
    </div>
  );
}