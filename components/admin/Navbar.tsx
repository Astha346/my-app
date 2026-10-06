
"use client";

import {
  Menu,
  Search,
  Bell,
  Globe,
  ChevronDown,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

type NavbarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
}: NavbarProps) {
  const [profileOpen, setProfileOpen] =
    useState(false);

  const [userRole, setUserRole] = useState("Admin");

  const [profileImage, setProfileImage] =
    useState<string | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  /* ================= USER ROLE ================= */

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        const role = user.role?.toLowerCase();

        if (role === "admin") {
          setUserRole("Admin");
        } else if (role === "manager") {
          setUserRole("Manager");
        } else if (role === "staff") {
          setUserRole("Staff");
        }
      } catch (error) {
        console.error(
          "Failed to read user information:",
          error
        );
      }
    }

    /* ================= PROFILE IMAGE ================= */

    const savedProfileImage =
      localStorage.getItem("profileImage");

    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
  }, []);

  /* ================= CHANGE PROFILE IMAGE ================= */

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageUrl = reader.result as string;

      setProfileImage(imageUrl);

      localStorage.setItem(
        "profileImage",
        imageUrl
      );
    };

    reader.readAsDataURL(file);
  };

  /* ================= OPEN FILE PICKER ================= */

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 shadow-sm backdrop-blur-md sm:px-6">

      {/* ================= LEFT ================= */}

      <div className="flex min-w-0 items-center gap-3">

        {/* Sidebar Toggle */}

        <button
          type="button"
          onClick={() =>
            setSidebarOpen((prev) => !prev)
          }
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 active:scale-95"
          aria-label={
            sidebarOpen
              ? "Hide sidebar"
              : "Show sidebar"
          }
        >
          <Menu size={21} />
        </button>

        {/* Search */}

        <div className="relative hidden sm:block">

          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search products, orders..."
            className="h-10 w-64 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-16 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 lg:w-80"
          />

          {/* Keyboard shortcut */}

          <div className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400 lg:block">
            Ctrl K
          </div>

        </div>

        {/* Mobile Search */}

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 sm:hidden"
        >
          <Search size={20} />
        </button>

      </div>

      {/* ================= RIGHT ================= */}

      <div className="flex items-center gap-1 sm:gap-2">

        {/* Language */}

        <button
          type="button"
          className="hidden h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 md:flex"
        >
          <Globe size={18} />

          <span>EN</span>

          <ChevronDown size={14} />
        </button>

        {/* Notification */}

        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell size={20} />

          {/* Notification dot */}

          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Divider */}

        <div className="mx-1 hidden h-7 w-px bg-gray-200 sm:block" />

        {/* ================= PROFILE ================= */}

        <div className="relative">

          {/* Hidden file input */}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePictureChange}
          />

          {/* Profile Button */}

          <button
            type="button"
            onClick={() =>
              setProfileOpen((prev) => !prev)
            }
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-gray-100 sm:gap-3"
          >

            {/* Avatar */}

            <div
              className="relative cursor-pointer"
              onClick={(event) => {
                event.stopPropagation();
                openFilePicker();
              }}
            >

              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-9 w-9 rounded-full object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-indigo-700 text-sm font-bold text-white shadow-sm">
                  {userRole.charAt(0)}
                </div>
              )}

              {/* Online indicator */}

              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />

            </div>

            {/* User Info */}

            <div className="hidden text-left sm:block">

              <p className="text-sm font-semibold leading-4 text-gray-900">
                {userRole}
              </p>

              <p className="mt-1 text-[11px] text-gray-500">
                {userRole === "Admin"
                  ? "Super Admin"
                  : userRole}
              </p>

            </div>

            {/* Arrow */}

            <ChevronDown
              size={16}
              className={`hidden text-gray-400 transition-transform sm:block ${
                profileOpen
                  ? "rotate-180"
                  : ""
              }`}
            />

          </button>

          {/* ================= PROFILE DROPDOWN ================= */}

          {profileOpen && (
            <>

              {/* Outside Overlay */}

              <div
                className="fixed inset-0 z-40"
                onClick={() =>
                  setProfileOpen(false)
                }
              />

              {/* Dropdown */}

              <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

                <div className="flex flex-col items-center px-4 py-5">

                  {/* Large Profile Picture */}

                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover shadow-sm"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-indigo-700 text-2xl font-bold text-white shadow-sm">
                      {userRole.charAt(0)}
                    </div>
                  )}

                  {/* Change Profile Picture */}

                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="mt-3 rounded-lg px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                  >
                    Change Profile Picture
                  </button>

                </div>

              </div>

            </>
          )}

        </div>

      </div>

    </header>
  );
}

