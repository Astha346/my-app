"use client";

import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "manager", "staff"],
  },
  {
    title: "Products",
    icon: Package,
    roles: ["admin", "manager"],
  },
  {
    title: "Categories",
    icon: FolderTree,
    roles: ["admin", "manager"],
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    roles: ["admin", "manager", "staff"],
  },
  {
    title: "Customers",
    icon: Users,
    roles: ["admin", "manager", "staff"],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    roles: ["admin", "manager"],
  },
  {
    title: "Settings",
    icon: Settings,
    roles: ["admin"],
  },
];

export default function Sidebar() {
  const [role, setRole] =
    useState("");

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
     console.log(user);
    setRole(user.role);
  }, []);

  return (
    <aside className="w-64 min-h-screen bg-blue-900 text-white flex flex-col">
      <div className="border-b border-slate-700 p-6">
        <h1 className="text-2xl font-bold">
          ShopAdmin
        </h1>
      </div>

      <div className="flex-1 px-3 py-5">

        {menuItems
          .filter((item) =>
            item.roles.includes(role)
          )
          .map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                className="flex items-center gap-3 w-full rounded-lg px-4 py-3 hover:bg-slate-800 transition mb-2"
              >
                <Icon size={20} />

                <span>
                  {item.title}
                </span>
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