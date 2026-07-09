"use client";

import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  BarChart3,
  TicketPercent,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    icon: Package,
  },
  {
    title: "Categories",
    icon: FolderTree,
  },
  {
    title: "Orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    icon: Users,
  },
  {
    title: "Analytics",
    icon: BarChart3,
  },
  {
    title: "Coupons",
    icon: TicketPercent,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

      <div className="border-b border-slate-700 p-6">
        <h1 className="text-2xl font-bold">
          ShopAdmin
        </h1>
      </div>

      <div className="flex-1 px-3 py-5">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className="flex items-center gap-3 w-full rounded-lg px-4 py-3 hover:bg-slate-800 transition mb-2"
            >
              <Icon size={20} />

              <span>{item.title}</span>
            </button>
          );
        })}

      </div>

      <div className="border-t border-slate-700 p-4">
        <button className="flex items-center gap-3 w-full rounded-lg px-4 py-3 hover:bg-slate-800">
          <LogOut size={20} />
          Logout
        </button>
      </div>

    </aside>
  );
}