
"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  ShieldCheck,
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
     title: "Permissions",
     icon: ShieldCheck,
     roles: ["admin"],
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
    <aside className="flex min-h-screen w-64 flex-col bg-gray-800 text-white">

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
                type="button"
                onClick={() => setActivePage(item.title)}
                className={`mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition
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
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-blue-800">
          <LogOut size={20} />
          Logout
        </button>
      </div>

    </aside>
  );
}

