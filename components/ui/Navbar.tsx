
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
import ThemeToggle from "@/components/ui/ThemeToggle";

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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const searchValue = searchTerm ?? "";
  const setSearchValue = setSearchTerm ?? (() => {});
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      setCartCount(
        cart.reduce((total, item) => total + item.quantity, 0)
      );
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const updateWishlistCount = () => {
      setWishlistCount(getWishlist().length);
    };

    updateWishlistCount();
    window.addEventListener("wishlistUpdated", updateWishlistCount);

    return () => {
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }

    setShowLogoutConfirm(false);
    setOpenProfile(false);
    setOpenMobileMenu(false);
  };

  const menuLinkClass =
    "group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-50 dark:hover:bg-slate-700";

  const menuTitleClass =
    "text-sm font-semibold text-gray-800 dark:text-slate-100";

  const menuDescriptionClass =
    "text-xs text-gray-500 dark:text-slate-400";

  const iconBoxClass =
    "flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition group-hover:bg-pink-100 group-hover:text-pink-600 dark:bg-slate-700 dark:text-slate-300 dark:group-hover:bg-pink-950 dark:group-hover:text-pink-400";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white text-gray-900 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      {/* MAIN NAVBAR */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link href="/" className="flex shrink-0 items-center">
          <span className="text-2xl font-extrabold tracking-tight text-pink-600">
            Shop
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Ease
          </span>
        </Link>

        {/* DESKTOP SEARCH */}
        <div className="hidden flex-1 md:block">
          <SearchBar value={searchValue} onChange={setSearchValue} />
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-pink-50 hover:text-pink-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-pink-400"
          >
            <ShoppingCart size={21} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <ThemeToggle />

          {/* PROFILE */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setOpenProfile((prev) => !prev)}
              aria-expanded={openProfile}
              className="flex items-center gap-2 rounded-full px-3 py-2 text-gray-700 transition hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400">
                <User size={19} />
              </div>
              <span className="hidden text-sm font-semibold lg:block">
                My Account
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  openProfile ? "rotate-180" : ""
                }`}
              />
            </button>

            {openProfile && (
              <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                {/* ACCOUNT HEADER */}
                <div className="mb-2 rounded-xl bg-gray-50 px-4 py-3 dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400">
                      <User size={21} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        My Account
                      </p>
                      <p className="break-all text-xs text-gray-500 dark:text-slate-400">
                        {email || "Manage your account"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* MY PROFILE */}
                <Link
                  href="/account"
                  onClick={() => setOpenProfile(false)}
                  className={menuLinkClass}
                >
                  <div className={iconBoxClass}>
                    <User size={17} />
                  </div>
                  <div>
                    <p className={menuTitleClass}>My Profile</p>
                    <p className={menuDescriptionClass}>
                      View and edit your profile
                    </p>
                  </div>
                </Link>

                {/* MY ORDERS */}
                <Link
                  href="/orders"
                  onClick={() => setOpenProfile(false)}
                  className={menuLinkClass}
                >
                  <div className={iconBoxClass}>
                    <Package size={17} />
                  </div>
                  <div>
                    <p className={menuTitleClass}>My Orders</p>
                    <p className={menuDescriptionClass}>Track your orders</p>
                  </div>
                </Link>

                {/* WISHLIST */}
                <Link
                  href="/wishlist"
                  onClick={() => setOpenProfile(false)}
                  className={menuLinkClass}
                >
                  <div className={iconBoxClass}>
                    <Heart size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={menuTitleClass}>Wishlist</p>
                      {wishlistCount > 0 && (
                        <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-600 dark:bg-pink-950 dark:text-pink-400">
                          {wishlistCount}
                        </span>
                      )}
                    </div>
                    <p className={menuDescriptionClass}>Your saved products</p>
                  </div>
                </Link>

                {/* MY CART */}
                <Link
                  href="/cart"
                  onClick={() => setOpenProfile(false)}
                  className={menuLinkClass}
                >
                  <div className={iconBoxClass}>
                    <ShoppingCart size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={menuTitleClass}>My Cart</p>
                      {cartCount > 0 && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-950 dark:text-green-400">
                          {cartCount}
                        </span>
                      )}
                    </div>
                    <p className={menuDescriptionClass}>
                      View items in your cart
                    </p>
                  </div>
                </Link>

                {/* SAVED ADDRESSES */}
                <Link
                  href="/addresses"
                  onClick={() => setOpenProfile(false)}
                  className={menuLinkClass}
                >
                  <div className={iconBoxClass}>
                    <MapPin size={17} />
                  </div>
                  <div>
                    <p className={menuTitleClass}>Saved Addresses</p>
                    <p className={menuDescriptionClass}>
                      Manage delivery addresses
                    </p>
                  </div>
                </Link>

                {/* HELP */}
                <Link
                  href="/help"
                  onClick={() => setOpenProfile(false)}
                  className={menuLinkClass}
                >
                  <div className={iconBoxClass}>
                    <HelpCircle size={17} />
                  </div>
                  <div>
                    <p className={menuTitleClass}>Help &amp; Support</p>
                    <p className={menuDescriptionClass}>
                      Get help with your account
                    </p>
                  </div>
                </Link>

                <div className="my-2 border-t border-gray-200 dark:border-slate-700" />

                {/* LOGOUT */}
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition group-hover:bg-red-100 group-hover:text-red-600 dark:bg-slate-700 dark:text-slate-300 dark:group-hover:bg-red-950 dark:group-hover:text-red-400">
                    <LogOut size={17} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-red-600 dark:text-slate-100 dark:group-hover:text-red-400">
                      Logout
                    </p>
                    <p className={menuDescriptionClass}>Sign out of your account</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-pink-50 hover:text-pink-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-pink-400"
          >
            <ShoppingCart size={21} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <ThemeToggle />

          <button
            type="button"
            aria-label={openMobileMenu ? "Close menu" : "Open menu"}
            aria-expanded={openMobileMenu}
            onClick={() => setOpenMobileMenu((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {openMobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div className="border-t border-gray-200 px-4 py-3 dark:border-slate-700 md:hidden">
        <SearchBar value={searchValue} onChange={setSearchValue} />
      </div>

      {/* MOBILE MENU */}
      {openMobileMenu && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 text-gray-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 md:hidden">
          <div className="space-y-1">
            <Link
              href="/account"
              onClick={() => setOpenMobileMenu(false)}
              className={menuLinkClass}
            >
              <User size={18} />
              <span className="text-sm font-medium">My Profile</span>
            </Link>

            <Link
              href="/orders"
              onClick={() => setOpenMobileMenu(false)}
              className={menuLinkClass}
            >
              <Package size={18} />
              <span className="text-sm font-medium">My Orders</span>
            </Link>

            <Link
              href="/wishlist"
              onClick={() => setOpenMobileMenu(false)}
              className={`${menuLinkClass} justify-between`}
            >
              <div className="flex items-center gap-3">
                <Heart size={18} />
                <span className="text-sm font-medium">Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="rounded-full bg-pink-100 px-2 py-1 text-xs font-bold text-pink-600 dark:bg-pink-950 dark:text-pink-400">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              onClick={() => setOpenMobileMenu(false)}
              className={`${menuLinkClass} justify-between`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} />
                <span className="text-sm font-medium">My Cart</span>
              </div>
              {cartCount > 0 && (
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-green-950 dark:text-green-400">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/addresses"
              onClick={() => setOpenMobileMenu(false)}
              className={menuLinkClass}
            >
              <MapPin size={18} />
              <span className="text-sm font-medium">Saved Addresses</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setOpenMobileMenu(false)}
              className={menuLinkClass}
            >
              <Settings size={18} />
              <span className="text-sm font-medium">Settings</span>
            </Link>

            <Link
              href="/help"
              onClick={() => setOpenMobileMenu(false)}
              className={menuLinkClass}
            >
              <HelpCircle size={18} />
              <span className="text-sm font-medium">Help &amp; Support</span>
            </Link>

            <div className="my-2 border-t border-gray-200 dark:border-slate-700" />

            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
            className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
              <LogOut size={24} />
            </div>

            <div className="mt-5 text-center">
              <h2
                id="logout-dialog-title"
                className="text-lg font-bold text-gray-900 dark:text-white"
              >
                Sign out?
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-slate-400">
                Are you sure you want to sign out of your account?
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

