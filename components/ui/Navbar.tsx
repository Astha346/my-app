"use client";

import SearchBar from "./SearchBar";
import {
  User,
  ShoppingCart,
  Heart,
  Package,
  Settings,
  ChevronDown,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type NavbarProps = {
  email: string;
  onLogout: () => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  suggestions: string[];
};

export default function Navbar({
  email,
  onLogout,
  searchTerm,
  setSearchTerm,
  suggestions,
}: NavbarProps) {
  const [openProfile, setOpenProfile] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showSuggestions =
    searchTerm.trim().length > 0 && suggestions.length > 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
      {/* ================================
          TOP NAVBAR
      ================================= */}

      <div className="flex h-18 w-full items-center gap-4 px-4 sm:px-6 lg:px-12">
        {/* Mobile Menu */}

        <button
          type="button"
          onClick={() => setOpenMobileMenu(!openMobileMenu)}
          className="rounded-xl p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
        >
          {openMobileMenu ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo */}

        <Link href="/" className="flex shrink-0 items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-600 text-lg font-bold text-white shadow-sm">
              S
            </div>

            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Shop<span className="text-pink-600">Ease</span>
              </h1>

              <p className="hidden text-[10px] font-medium uppercase tracking-widest text-gray-400 lg:block">
                Shop Smart
              </p>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-base font-semibold text-gray-900 transition hover:text-pink-600"
          >
            Home
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-base font-semibold text-gray-600 transition hover:text-pink-600"
          >
            Categories
            <ChevronDown size={15} />
          </Link>

          <Link
            href="/"
            className="text-base font-semibold text-gray-600 transition hover:text-pink-600"
          >
            Deals
          </Link>

          <Link
            href="/about"
            className="text-base font-semibold text-gray-600 transition hover:text-pink-600"
          >
            About
          </Link>
        </nav>

        {/* ================================
            DESKTOP SEARCH
        ================================= */}

        <div className="ml-auto hidden max-w-md flex-1 md:block lg:max-w-xl">
          <div className="relative">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
            />

            {showSuggestions && (
              <div className="absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                <div className="border-b border-gray-100 px-4 py-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Search Results
                  </p>
                </div>

                <div className="py-1">
                  {suggestions.map((item, index) => (
                    <button
                      key={`${item}-${index}`}
                      type="button"
                      className="flex w-full items-center px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                      onClick={() => {
                        setSearchTerm(item);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================================
            RIGHT SIDE
        ================================= */}

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Cart */}

          <Link
            href="/cart"
            className="group flex h-10 items-center justify-center gap-2 rounded-xl px-2.5 text-gray-600 transition hover:bg-pink-50 hover:text-pink-600 sm:px-3"
            title="Cart"
          >
            <ShoppingCart size={20} strokeWidth={1.8} />

            <span className="hidden text-sm font-medium lg:block">
              Cart
            </span>
          </Link>

          {/* Account */}

          <div
            className="relative"
            ref={profileRef}
          >
            <button
              type="button"
              onClick={() => setOpenProfile(!openProfile)}
              className={`flex h-10 items-center gap-2 rounded-xl px-2.5 transition sm:px-3 ${
                openProfile
                  ? "bg-pink-50 text-pink-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                  openProfile
                    ? "bg-pink-600 text-white"
                    : "bg-pink-100 text-pink-600"
                }`}
              >
                <User size={17} />
              </div>

              <span className="hidden max-w-30 truncate text-sm font-medium lg:block">
                Account
              </span>

              <ChevronDown
                size={15}
                className={`hidden transition-transform duration-200 lg:block ${
                  openProfile ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* ================================
                ACCOUNT DROPDOWN
            ================================= */}

            {openProfile && (
              <div className="absolute right-0 top-full mt-3 w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                {/* Account Header */}

                <div className="bg-gradient-to-r from-pink-50 to-white px-5 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-600 text-white shadow-sm">
                      <User size={21} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-400">
                        Welcome back
                      </p>

                      <p className="mt-0.5 truncate text-sm font-semibold text-gray-900">
                        {email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}

                <div className="p-2">
                  {/* Profile */}

                  <Link
                    href="/users"
                    onClick={() => setOpenProfile(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition group-hover:bg-pink-100 group-hover:text-pink-600">
                      <User size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        My Profile
                      </p>

                      <p className="text-xs text-gray-400">
                        View your profile
                      </p>
                    </div>
                  </Link>

                  {/* Wishlist */}

                  <Link
                    href="#"
                    onClick={() => setOpenProfile(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition group-hover:bg-pink-100 group-hover:text-pink-600">
                      <Heart size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Wishlist
                      </p>

                      <p className="text-xs text-gray-400">
                        Your saved products
                      </p>
                    </div>
                  </Link>

                  {/* Orders */}

                  <Link
                    href="/orders"
                    onClick={() => setOpenProfile(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition group-hover:bg-pink-100 group-hover:text-pink-600">
                      <Package size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        My Orders
                      </p>

                      <p className="text-xs text-gray-400">
                        Track your orders
                      </p>
                    </div>
                  </Link>

                  {/* Settings */}

                  <Link
                    href="#"
                    onClick={() => setOpenProfile(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition group-hover:bg-pink-100 group-hover:text-pink-600">
                      <Settings size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Settings
                      </p>

                      <p className="text-xs text-gray-400">
                        Account preferences
                      </p>
                    </div>
                  </Link>
                </div>

                {/* Logout */}

                <div className="border-t border-gray-100 p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenProfile(false);
                      onLogout();
                    }}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-red-50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition group-hover:bg-red-100">
                      <LogOut size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-red-600">
                        Logout
                      </p>

                      <p className="text-xs text-red-400">
                        Sign out of your account
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================================
          MOBILE SEARCH
      ================================= */}

      <div className="border-t border-gray-50 px-4 py-3 md:hidden">
        <div className="relative">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
          />

          {showSuggestions && (
            <div className="absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              <div className="border-b border-gray-100 px-4 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Search Results
                </p>
              </div>

              <div className="py-1">
                {suggestions.map((item, index) => (
                  <button
                    key={`${item}-${index}`}
                    type="button"
                    className="flex w-full items-center px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                    onClick={() => {
                      setSearchTerm(item);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================================
          MOBILE MENU
      ================================= */}

      {openMobileMenu && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-sm md:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setOpenMobileMenu(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-800 transition hover:bg-pink-50 hover:text-pink-600"
            >
              Home
            </Link>

            <Link
              href="/"
              onClick={() => setOpenMobileMenu(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-800 transition hover:bg-pink-50 hover:text-pink-600"
            >
              Categories
            </Link>

            <Link
              href="/"
              onClick={() => setOpenMobileMenu(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-800 transition hover:bg-pink-50 hover:text-pink-600"
            >
              Deals
            </Link>

            <Link
              href="/about"
              onClick={() => setOpenMobileMenu(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-800 transition hover:bg-pink-50 hover:text-pink-600"
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}