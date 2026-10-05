
"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  ShieldCheck,
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
    title: "Permissions",
    icon: ShieldCheck,
    roles: ["admin"],
  },
  {
    title: "Settings",
    icon: Settings,
    roles: ["admin"],
  },
];

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  sidebarOpen: boolean;
}

export default function Sidebar({
  activePage,
  setActivePage,
  sidebarOpen,
}: SidebarProps) {
  const [role, setRole] = useState("");

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    setRole(user.role || "");
  }, []);

  return (
    <aside
      className={`flex min-h-screen flex-col bg-gray-800 text-white transition-all duration-300 ${
        sidebarOpen
          ? "w-64"
          : "w-0 overflow-hidden"
      }`}
    >
      {/* Logo */}
      <div className="border-b border-blue-800 p-6">
        <h1 className="whitespace-nowrap text-2xl font-bold">
          ShopAdmin
        </h1>
      </div>

      {/* Menu */}
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
                type="button"
                onClick={() =>
                  setActivePage(item.title)
                }
                className={`mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                  activePage === item.title
                    ? "bg-blue-800"
                    : "hover:bg-blue-800"
                }`}
              >
                <Icon size={20} />
                <span className="whitespace-nowrap">
                  {item.title}
                </span>
              </button>
            );
          })}
      </div>

      {/* Logout */}
      <div className="border-t border-blue-800 p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-blue-800"
        >
          <LogOut size={20} />
          <span className="whitespace-nowrap">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

