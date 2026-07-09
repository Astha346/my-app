"use client";

import {
  Menu,
  Search,
  Bell,
  Globe,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">

      {/* Left Section */}
      <div className="flex items-center gap-4">

        <button>
          <Menu size={22} />
        </button>

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search for products, orders, customers..."
            className="w-96 rounded-lg border py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">

        <Bell className="cursor-pointer" />

        <Globe className="cursor-pointer" />

        <div className="flex items-center gap-3 cursor-pointer">

          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
            A
          </div>

          <div>
            <p className="font-medium">
              Admin
            </p>

            <p className="text-sm text-gray-500">
              Super Admin
            </p>
          </div>

          <ChevronDown size={18} />

        </div>

      </div>

    </header>
  );
}