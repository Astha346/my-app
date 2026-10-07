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
  CheckCircle2,
} from "lucide-react";

import SecuritySettings from "./SecuritySettings";
import AppearanceSettings from "./AppearanceSettings";
import SystemSettings from "./SystemSettings";

const settingsMenu = [
  {
    name: "General",
    description: "Account and basic preferences",
    icon: User,
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
    text: "text-pink-600",
  },
  {
    name: "Notifications",
    description: "Manage alerts and updates",
    icon: Bell,
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  {
    name: "Security",
    description: "Password and login protection",
    icon: Shield,
    color: "from-red-500 to-pink-500",
    bg: "bg-red-50",
    text: "text-red-600",
  },
  {
    name: "Appearance",
    description: "Customize dashboard appearance",
    icon: Palette,
    color: "from-purple-500 to-indigo-500",
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  {
    name: "System",
    description: "Store and system preferences",
    icon: Monitor,
    color: "from-cyan-500 to-blue-500",
    bg: "bg-cyan-50",
    text: "text-cyan-600",
  },
];

export default function SettingsContent() {
  const [activeSetting, setActiveSetting] = useState("General");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newOrderNotifications, setNewOrderNotifications] = useState(true);
  const [lowStockNotifications, setLowStockNotifications] = useState(true);

  const activeMenu = settingsMenu.find(
    (item) => item.name === activeSetting
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
    {/* Page Header */}
   <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
  <div className="flex items-center gap-3">
    <Settings
      size={22}
      className="text-slate-600"
    />

    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Settings
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        Manage your account, security, notifications,
        appearance, and system preferences.
      </p>
    </div>
  </div>
  </div>

      {/* Settings Layout */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Settings Menu */}
        <div className="h-fit rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="px-3 pb-3 pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Settings Menu
            </p>
          </div>

          <div className="space-y-2">
            {settingsMenu.map((item) => {
              const Icon = item.icon;
              const isActive = activeSetting === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActiveSetting(item.name)}
                  className={`group relative flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {/* Active color indicator */}
                  {isActive && (
                    <span
                      className={`absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b ${item.color}`}
                    />
                  )}

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                      isActive
                        ? `bg-gradient-to-br ${item.color} text-white shadow-sm`
                        : `${item.bg} ${item.text}`
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-bold ${
                        isActive ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {item.name}
                    </p>

                    <p
                      className={`mt-0.5 truncate text-xs ${
                        isActive ? "text-white/60" : "text-slate-400"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  {isActive && (
                    <CheckCircle2
                      size={17}
                      className="shrink-0 text-white/70"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Info */}
          <div className="mt-4 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm">
              <Settings size={17} />
            </div>

            <p className="text-xs font-semibold text-slate-700">
              ShopEase Admin
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Customize your administration experience from one place.
            </p>
          </div>
        </div>

        {/* Settings Content */}
        <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Active Section Indicator */}
          {activeMenu && (
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-6 py-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${activeMenu.bg} ${activeMenu.text}`}
              >
                <activeMenu.icon size={16} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Current Section
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {activeSetting}
                </p>
              </div>
            </div>
          )}

          {/* GENERAL SETTINGS */}
          {activeSetting === "General" && (
            <div>
              <div className="border-b border-slate-100 bg-gradient-to-r from-pink-50 to-white px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md">
                    <User size={23} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      General Settings
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Manage your basic admin account information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div className="grid gap-5 md:grid-cols-2">
                  {/* Admin Name */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Admin Name
                    </label>

                    <input
                      type="text"
                      defaultValue="Admin"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                    />
                  </div>

                  {/* Admin Email */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Admin Email
                    </label>

                    <input
                      type="email"
                      defaultValue="admin@shopease.com"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                    />
                  </div>

                  {/* Language */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Language
                    </label>

                    <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100">
                      <option>English</option>
                      <option>Nepali</option>
                    </select>
                  </div>

                  {/* Time Zone */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Time Zone
                    </label>

                    <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100">
                      <option>Asia/Kathmandu</option>
                      <option>Asia/Kolkata</option>
                      <option>UTC</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01] hover:shadow-lg"
                  >
                    <Save size={17} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATION SETTINGS */}
          {activeSetting === "Notifications" && (
            <div>
              <div className="border-b border-slate-100 bg-gradient-to-r from-amber-50 to-white px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
                    <Bell size={23} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Notification Settings
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Choose which notifications you want to receive.
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Email Notifications */}
                <div className="flex items-center justify-between gap-5 px-6 py-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Email Notifications
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Receive important system notifications by email.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setEmailNotifications(!emailNotifications)
                    }
                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                      emailNotifications
                        ? "bg-gradient-to-r from-amber-400 to-orange-500"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                        emailNotifications ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* New Order Notifications */}
                <div className="flex items-center justify-between gap-5 px-6 py-6">
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
                    onClick={() =>
                      setNewOrderNotifications(!newOrderNotifications)
                    }
                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                      newOrderNotifications
                        ? "bg-gradient-to-r from-amber-400 to-orange-500"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                        newOrderNotifications ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Low Stock Notifications */}
                <div className="flex items-center justify-between gap-5 px-6 py-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Low Stock Notifications
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Receive alerts when product stock is running low.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setLowStockNotifications(!lowStockNotifications)
                    }
                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                      lowStockNotifications
                        ? "bg-gradient-to-r from-amber-400 to-orange-500"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                        lowStockNotifications ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
                >
                  <Save size={17} />
                  Save Notifications
                </button>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeSetting === "Security" && <SecuritySettings />}

          {/* APPEARANCE */}
          {activeSetting === "Appearance" && <AppearanceSettings />}

          {/* SYSTEM */}
          {activeSetting === "System" && <SystemSettings />}
        </div>
      </div>
    </div>
  );
}