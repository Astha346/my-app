
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
    <div className="bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
            <Monitor size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground">
              System Settings
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage store status and basic system preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {/* Maintenance Mode */}
        <div className="flex items-center justify-between gap-6 px-6 py-6">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Wrench size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Maintenance Mode
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Temporarily disable customer access while system maintenance
                is being performed.
              </p>

              {maintenanceMode && (
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-500">
                  <Wrench size={12} />
                  Maintenance active
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            aria-label="Toggle maintenance mode"
            aria-pressed={maintenanceMode}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              maintenanceMode ? "bg-indigo-600" : "bg-muted-foreground/40"
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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Store size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Store Status
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Control whether customers can currently access and place
                orders.
              </p>

              <span
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                  storeOpen
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-red-500/10 text-red-500"
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
            aria-label="Toggle store status"
            aria-pressed={storeOpen}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              storeOpen ? "bg-indigo-600" : "bg-muted-foreground/40"
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
            <h3 className="text-sm font-semibold text-foreground">
              System Preferences
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Configure the default settings used throughout the dashboard.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Currency */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <DollarSign size={16} className="text-muted-foreground" />
                Default Currency
              </label>

              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="NPR">NPR - Nepalese Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>

            {/* Store Start Date */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <CalendarDays size={16} className="text-muted-foreground" />
                Store Start Date
              </label>

              <input
                type="date"
                value={storeStartDate}
                onChange={(e) => setStoreStartDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />

              <p className="mt-2 text-xs text-muted-foreground">
                Select the date when your store started operating.
              </p>
            </div>
          </div>
        </div>

        {/* Clear Cache */}
        <div className="flex items-center justify-between gap-6 px-6 py-6">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Trash2 size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Clear System Cache
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Clear temporary cached data used by the application.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="shrink-0 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Clear Cache
          </button>
        </div>

        {/* System Information */}
        <div className="px-6 py-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Server size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                System Information
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Current application information.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Application</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                ShopEase
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Frontend</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                Next.js
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Backend</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                NestJS
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-border bg-muted/30 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
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

