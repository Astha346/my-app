
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
  MapPin,
  HelpCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getCart } from "@/lib/cart";
import { getWishlist } from "@/lib/wishlist";

type NavbarProps = {
  email?: string;
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
  suggestions?: string[];
  onLogout?: () => void;
};

export default function Navbar({
  email,
  searchTerm,
  setSearchTerm,
  suggestions,
  onLogout,
}: NavbarProps) {
  const [openProfile, setOpenProfile] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const searchValue = searchTerm ?? "";
  const setSearchValue =
    setSearchTerm ?? (() => {});

  const profileRef = useRef<HTMLDivElement>(null);

  // ================================
  // CART COUNT
  // ================================
  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();

      const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartCount(totalItems);
    };

    updateCartCount();

    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );
    };
  }, []);

  // ================================
  // WISHLIST COUNT
  // ================================
  useEffect(() => {
    const updateWishlistCount = () => {
      const wishlist = getWishlist();

      setWishlistCount(wishlist.length);
    };

    updateWishlistCount();

    window.addEventListener(
      "wishlistUpdated",
      updateWishlistCount
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        updateWishlistCount
      );
    };
  }, []);

  // ================================
  // CLOSE PROFILE DROPDOWN
  // WHEN CLICKING OUTSIDE
  // ================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenProfile(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ================================
  // LOGOUT
  // ================================
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      window.location.href = "/";
    }

    setOpenProfile(false);
    setOpenMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      {/* ================================
          MAIN NAVBAR
      ================================= */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">

        {/* ================================
            LOGO
        ================================= */}
        <Link
          href="/"
          className="flex shrink-0 items-center"
        >
          <span className="text-2xl font-extrabold tracking-tight text-pink-600">
            Shop
          </span>

          <span className="text-2xl font-extrabold tracking-tight text-gray-900">
            Ease
          </span>
        </Link>

        {/* ================================
            DESKTOP SEARCH
        ================================= */}
        <div className="hidden flex-1 md:block">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
          />
        </div>

        {/* ================================
            DESKTOP ACTIONS
        ================================= */}
        <div className="hidden items-center gap-2 md:flex">

          {/* CART */}
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-pink-50 hover:text-pink-600"
          >
            <ShoppingCart size={21} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* ================================
              PROFILE DROPDOWN
          ================================= */}
          <div
            ref={profileRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setOpenProfile((prev) => !prev)
              }
              className="flex items-center gap-2 rounded-full px-3 py-2 text-gray-700 transition hover:bg-gray-100"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                <User size={19} />
              </div>

              <span className="hidden text-sm font-semibold lg:block">
                My Account
              </span>

              <ChevronDown
                size={16}
                className={`transition-transform ${
                  openProfile
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* ================================
                ACCOUNT DROPDOWN
            ================================= */}
            {openProfile && (
              <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border bg-white p-2 shadow-xl">

                {/* ACCOUNT HEADER */}
                <div className="mb-2 rounded-xl bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                      <User size={21} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        My Account
                      </p>

                      <p className="text-xs text-gray-500">
                        {email || "Manage your account"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* MY PROFILE */}
                <Link
                  href="/profile"
                  onClick={() =>
                    setOpenProfile(false)
                  }
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
                      View and edit your profile
                    </p>
                  </div>
                </Link>

                {/* MY ORDERS */}
                <Link
                  href="/orders"
                  onClick={() =>
                    setOpenProfile(false)
                  }
                  className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition group-hover:bg-blue-100 group-hover:text-blue-600">
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

                {/* WISHLIST */}
                <Link
                  href="/wishlist"
                  onClick={() =>
                    setOpenProfile(false)
                  }
                  className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition group-hover:bg-pink-100 group-hover:text-pink-600">
                    <Heart size={17} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800">
                        Wishlist
                      </p>

                      {wishlistCount > 0 && (
                        <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-600">
                          {wishlistCount}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-400">
                      Your saved products
                    </p>
                  </div>
                </Link>

                {/* MY CART */}
                <Link
                  href="/cart"
                  onClick={() =>
                    setOpenProfile(false)
                  }
                  className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition group-hover:bg-green-100 group-hover:text-green-600">
                    <ShoppingCart size={17} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800">
                        My Cart
                      </p>

                      {cartCount > 0 && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-600">
                          {cartCount}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-400">
                      View items in your cart
                    </p>
                  </div>
                </Link>

                {/* SAVED ADDRESSES */}
                <Link
                  href="/addresses"
                  onClick={() =>
                    setOpenProfile(false)
                  }
                  className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition group-hover:bg-orange-100 group-hover:text-orange-600">
                    <MapPin size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Saved Addresses
                    </p>

                    <p className="text-xs text-gray-400">
                      Manage delivery addresses
                    </p>
                  </div>
                </Link>

                {/* SETTINGS */}
                <Link
                  href="/settings"
                  onClick={() =>
                    setOpenProfile(false)
                  }
                  className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition group-hover:bg-gray-200 group-hover:text-gray-800">
                    <Settings size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Settings
                    </p>

                    <p className="text-xs text-gray-400">
                      Manage account settings
                    </p>
                  </div>
                </Link>

                {/* HELP & SUPPORT */}
                <Link
                  href="/help"
                  onClick={() =>
                    setOpenProfile(false)
                  }
                  className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition group-hover:bg-blue-100 group-hover:text-blue-600">
                    <HelpCircle size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Help & Support
                    </p>

                    <p className="text-xs text-gray-400">
                      Get help with your account
                    </p>
                  </div>
                </Link>

                {/* DIVIDER */}
                <div className="my-2 border-t" />

                {/* LOGOUT */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-red-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition group-hover:bg-red-100 group-hover:text-red-600">
                    <LogOut size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-red-600">
                      Logout
                    </p>

                    <p className="text-xs text-gray-400">
                      Sign out of your account
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================================
            MOBILE ACTIONS
        ================================= */}
        <div className="ml-auto flex items-center gap-2 md:hidden">

          {/* MOBILE CART */}
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-pink-50 hover:text-pink-600"
          >
            <ShoppingCart size={21} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() =>
              setOpenMobileMenu(
                (prev) => !prev
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
          >
            {openMobileMenu ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>
      </div>

      {/* ================================
          MOBILE SEARCH
      ================================= */}
      <div className="border-t px-4 py-3 md:hidden">
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
        />
      </div>

      {/* ================================
          MOBILE MENU
      ================================= */}
      {openMobileMenu && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <div className="space-y-1">

            {/* PROFILE */}
            <Link
              href="/profile"
              onClick={() =>
                setOpenMobileMenu(false)
              }
              className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-gray-50"
            >
              <User size={18} />

              <span className="text-sm font-medium">
                My Profile
              </span>
            </Link>

            {/* ORDERS */}
            <Link
              href="/orders"
              onClick={() =>
                setOpenMobileMenu(false)
              }
              className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-gray-50"
            >
              <Package size={18} />

              <span className="text-sm font-medium">
                My Orders
              </span>
            </Link>

            {/* WISHLIST */}
            <Link
              href="/wishlist"
              onClick={() =>
                setOpenMobileMenu(false)
              }
              className="flex items-center justify-between rounded-xl px-3 py-3 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Heart size={18} />

                <span className="text-sm font-medium">
                  Wishlist
                </span>
              </div>

              {wishlistCount > 0 && (
                <span className="rounded-full bg-pink-100 px-2 py-1 text-xs font-bold text-pink-600">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* CART */}
            <Link
              href="/cart"
              onClick={() =>
                setOpenMobileMenu(false)
              }
              className="flex items-center justify-between rounded-xl px-3 py-3 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} />

                <span className="text-sm font-medium">
                  My Cart
                </span>
              </div>

              {cartCount > 0 && (
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-600">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ADDRESSES */}
            <Link
              href="/addresses"
              onClick={() =>
                setOpenMobileMenu(false)
              }
              className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-gray-50"
            >
              <MapPin size={18} />

              <span className="text-sm font-medium">
                Saved Addresses
              </span>
            </Link>

            {/* SETTINGS */}
            <Link
              href="/settings"
              onClick={() =>
                setOpenMobileMenu(false)
              }
              className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-gray-50"
            >
              <Settings size={18} />

              <span className="text-sm font-medium">
                Settings
              </span>
            </Link>

            {/* HELP */}
            <Link
              href="/help"
              onClick={() =>
                setOpenMobileMenu(false)
              }
              className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-gray-50"
            >
              <HelpCircle size={18} />

              <span className="text-sm font-medium">
                Help & Support
              </span>
            </Link>

            {/* DIVIDER */}
            <div className="my-2 border-t" />

            {/* LOGOUT */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />

              <span className="text-sm font-medium">
                Logout
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

