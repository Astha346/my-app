
"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Settings,
  Save,
  Monitor,
} from "lucide-react";

import SecuritySettings from "./SecuritySettings";
import AppearanceSettings from "./AppearanceSettings";
import SystemSettings from "./SystemSettings";

const settingsMenu = [
  {
    title: "General",
    icon: Settings,
  },
  {
    title: "Notifications",
    icon: Bell,
  },
  {
    title: "Security",
    icon: Shield,
  },
  {
    title: "Appearance",
    icon: Palette,
  },
  {
    title: "System",
    icon: Monitor,
  },
];

export default function SettingsContent() {
  const [activeSetting, setActiveSetting] = useState("General");

  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newOrderNotifications, setNewOrderNotifications] = useState(true);
  const [lowStockNotifications, setLowStockNotifications] = useState(true);

  return (
    <div className="min-h-full bg-slate-50 p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your account and dashboard preferences
        </p>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        {/* Settings Navigation */}
        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          {settingsMenu.map((item) => {
            const Icon = item.icon;
            const active = activeSetting === item.title;

            return (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveSetting(item.title)}
                className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={19} />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* ====================================================== */}
          {/* GENERAL SETTINGS */}
          {/* ====================================================== */}

          {activeSetting === "General" && (
            <div>
              {/* Section Header */}
              <div className="border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Settings size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      General Settings
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Manage your admin profile and basic preferences.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Admin Name */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Admin Name
                    </label>

                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        defaultValue="Admin"
                        placeholder="Enter admin name"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    <p className="mt-1.5 text-xs text-slate-400">
                      The name displayed in the admin dashboard.
                    </p>
                  </div>

                  {/* Admin Email */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Admin Email
                    </label>

                    <input
                      type="email"
                      defaultValue="admin@shopease.com"
                      placeholder="Enter admin email"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />

                    <p className="mt-1.5 text-xs text-slate-400">
                      Used for admin account and notification emails.
                    </p>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Language
                    </label>

                    <select
                      defaultValue="English"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="English">English</option>
                      <option value="Nepali">Nepali</option>
                    </select>

                    <p className="mt-1.5 text-xs text-slate-400">
                      Select the language used in your dashboard.
                    </p>
                  </div>

                  {/* Time Zone */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Time Zone
                    </label>

                    <select
                      defaultValue="Asia/Kathmandu"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="Asia/Kathmandu">
                        Kathmandu (GMT +5:45)
                      </option>

                      <option value="Asia/Kolkata">
                        India (GMT +5:30)
                      </option>

                      <option value="UTC">
                        UTC (GMT +0:00)
                      </option>
                    </select>

                    <p className="mt-1.5 text-xs text-slate-400">
                      Used for orders, reports, and dashboard timestamps.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-400">
                  Update your general dashboard preferences.
                </p>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
                >
                  <Save size={17} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* NOTIFICATIONS SETTINGS */}
          {/* ====================================================== */}

          {activeSetting === "Notifications" && (
            <div>
              {/* Section Header */}
              <div className="border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Bell size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Notification Settings
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Manage how you receive important store notifications.
                    </p>
                  </div>
                </div>
              </div>

              {/* Notification Options */}
              <div className="divide-y divide-slate-100">
                {/* Email Notifications */}
                <div className="flex items-center justify-between gap-6 px-6 py-5">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Email Notifications
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Receive important store updates and notifications by
                      email.
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label="Toggle email notifications"
                    onClick={() =>
                      setEmailNotifications(!emailNotifications)
                    }
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      emailNotifications
                        ? "bg-indigo-600"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        emailNotifications ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* New Order Notifications */}
                <div className="flex items-center justify-between gap-6 px-6 py-5">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      New Order Notifications
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Get notified whenever a new order is placed.
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label="Toggle new order notifications"
                    onClick={() =>
                      setNewOrderNotifications(!newOrderNotifications)
                    }
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      newOrderNotifications
                        ? "bg-indigo-600"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        newOrderNotifications ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Low Stock Notifications */}
                <div className="flex items-center justify-between gap-6 px-6 py-5">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Low Stock Notifications
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Get notified when a product has low stock.
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label="Toggle low stock notifications"
                    onClick={() =>
                      setLowStockNotifications(!lowStockNotifications)
                    }
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      lowStockNotifications
                        ? "bg-indigo-600"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        lowStockNotifications ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-400">
                  Update your notification preferences.
                </p>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
                >
                  <Save size={17} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ====================================================== */}
                  {/* SECURITY SETTINGS */}
     {/* ====================================================== */}

      {activeSetting === "Security" && <SecuritySettings />}

      {/* ====================================================== */}
        {/* APPEARANCE SETTINGS */} 
      {/* ====================================================== */}

   {activeSetting === "Appearance" && <AppearanceSettings />}
    {/* ====================================================== */}
        {/* SYSTEM SETTINGS */}
    {/* ====================================================== */}

    {activeSetting === "System" && <SystemSettings />}
        </div>
      </div>
    </div>
  );
}

