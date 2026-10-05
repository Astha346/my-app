
"use client";

import {
  Menu,
  Search,
  Bell,
  Globe,
  ChevronDown,
  User,
  Settings,
  LogOut,
  CircleHelp,
} from "lucide-react";

import { useState } from "react";

type NavbarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
}: NavbarProps) {
  const [profileOpen, setProfileOpen] =
    useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 shadow-sm backdrop-blur-md sm:px-6">

      {/* ================= LEFT ================= */}
      <div className="flex min-w-0 items-center gap-3">

        {/* Sidebar Toggle */}
        <button
          type="button"
          onClick={() =>
            setSidebarOpen((prev) => !prev)
          }
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 active:scale-95"
          aria-label={
            sidebarOpen
              ? "Hide sidebar"
              : "Show sidebar"
          }
        >
          <Menu size={21} />
        </button>

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search products, orders..."
            className="h-10 w-64 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-16 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 lg:w-80"
          />

          {/* Keyboard shortcut */}
          <div className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400 lg:block">
            Ctrl K
          </div>
        </div>

        {/* Mobile Search */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 sm:hidden"
        >
          <Search size={20} />
        </button>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-1 sm:gap-2">

        {/* Language */}
        <button
          type="button"
          className="hidden h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 md:flex"
        >
          <Globe size={18} />

          <span>EN</span>

          <ChevronDown size={14} />
        </button>

        {/* Notification */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell size={20} />

          {/* Notification dot */}
          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="mx-1 hidden h-7 w-px bg-gray-200 sm:block" />

        {/* Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setProfileOpen((prev) => !prev)
            }
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-gray-100 sm:gap-3"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-bold text-white shadow-sm">
                A
              </div>

              {/* Online indicator */}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
            </div>

            {/* User info */}
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-4 text-gray-900">
                Admin
              </p>

              <p className="mt-1 text-[11px] text-gray-500">
                Super Admin
              </p>
            </div>

            <ChevronDown
              size={16}
              className={`hidden text-gray-400 transition-transform sm:block ${
                profileOpen
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <>
              {/* Outside overlay */}
              <div
                className="fixed inset-0 z-40"
                onClick={() =>
                  setProfileOpen(false)
                }
              />

              <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

                {/* Profile Header */}
                <div className="border-b bg-gray-50 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 font-bold text-white">
                      A
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        Admin
                      </p>

                      <p className="text-xs text-gray-500">
                        Super Administrator
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu */}
                <div className="p-2">

                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                  >
                    <User size={17} />
                    My Profile
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                  >
                    <Settings size={17} />
                    Settings
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                  >
                    <CircleHelp size={17} />
                    Help & Support
                  </button>

                  <div className="my-2 border-t" />

                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>

                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

