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
  Sparkles,
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
      className={`flex min-h-screen flex-col bg-slate-950 text-white transition-all duration-300 ${
        sidebarOpen
          ? "w-64"
          : "w-0 overflow-hidden"
      }`}
    >
      {/* Logo */}
      <div className="relative overflow-hidden border-b border-white/10 px-5 py-5">
        {/* Decorative background */}
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-pink-500/10 blur-2xl" />
        <div className="absolute -bottom-8 left-10 h-20 w-20 rounded-full bg-purple-500/10 blur-2xl" />

        <div className="relative flex items-center gap-3">
          {/* Logo Icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20">
            <Sparkles size={21} />
          </div>

          {/* Logo Text */}
          <div>
            <h1 className="whitespace-nowrap text-lg font-bold tracking-tight">
              ShopEase
            </h1>

            <p className="whitespace-nowrap text-xs text-slate-400">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 px-3 py-6">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
          Main Menu
        </p>

        <div className="space-y-1.5">
          {menuItems
            .filter((item) =>
              item.roles.includes(role)
            )
            .map((item) => {
              const Icon = item.icon;
              const isActive =
                activePage === item.title;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() =>
                    setActivePage(item.title)
                  }
                  className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-900/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute -left-3 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-pink-400" />
                  )}

                  {/* Icon */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-pink-400"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  {/* Menu Name */}
                  <span className="whitespace-nowrap text-sm font-medium">
                    {item.title}
                  </span>

                  {/* Active Dot */}
                  {isActive && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-white shadow-sm" />
                  )}
                </button>
              );
            })}
        </div>
      </div>

      {/* Logout */}
      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 transition group-hover:bg-red-500/10">
            <LogOut size={18} />
          </div>

          <span className="whitespace-nowrap text-sm font-medium">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}