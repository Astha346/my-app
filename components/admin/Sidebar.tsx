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

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function Sidebar({
  activePage,
  setActivePage,
}: SidebarProps) {
  const [role, setRole] = useState("");

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    setRole(user.role || "");
  }, []);

  return (
    <aside className="w-64 min-h-screen bg-gray-800 text-white flex flex-col">
      <div className="border-b border-blue-800 p-6">
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
                onClick={() =>
                  setActivePage(item.title)
                }
                className={`flex items-center gap-3 w-full rounded-lg px-4 py-3 mb-2 transition
                  ${
                    activePage === item.title
                      ? "bg-blue-800"
                      : "hover:bg-blue-800"
                  }`}
              >
                <Icon size={20} />

                <span>{item.title}</span>
              </button>
            );
          })}
      </div>

      <div className="border-t border-blue-800 p-4">
        <button className="flex items-center gap-3 w-full rounded-lg px-4 py-3 hover:bg-blue-800">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}