"use client";

import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import {
  Bell,
  User,
  ShoppingCart,
  Package,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type NavbarProps = {
  email: string;
  onLogout: () => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
};

export default function Navbar({
  email,
  onLogout,
  searchTerm,
  setSearchTerm,
}: NavbarProps) {
  const router = useRouter();

  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-white dark:bg-zinc-900 shadow gap-4 relative">

      {/* Left */}
      <h1 className="text-xl font-bold">Dashboard</h1>

      {/* Middle */}
      <div className="flex flex-1 items-center gap-2">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
            3
          </span>
        </button>

        {/* Orders */}
        <Link href="/orders">
          <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
            <Package size={20} />
          </button>
        </Link>

        {/* Cart */}
        <Link href="/cart">
          <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
            <ShoppingCart size={20} />
          </button>
        </Link>

        {/* Profile */}
        <div className="relative" ref={profileRef}>

          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <User size={18} />
            <span className="text-sm">{email}</span>
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-zinc-800 border rounded-lg shadow-lg z-50">

              <button
                onClick={() => {
                  router.push("/users");
                  setOpenProfile(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                Users
              </button>

              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                Logout
              </button>

            </div>
          )}

        </div>

        {/* NAV BUTTONS (FIXED) */}

        <Link href="/about">
          <Button className="bg-black text-white">
            About
          </Button>
        </Link>

        <Link href="/users">
          <Button className="bg-black text-white">
            Users
          </Button>
        </Link>

        <Link href="/analytics">
          <Button className="bg-black text-white">
            Analytics
          </Button>
        </Link>

        <Button
          onClick={onLogout}
          className="bg-black text-white"
        >
          Logout
        </Button>

      </div>
    </nav>
  );
}