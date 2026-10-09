"use client";

import {
  Menu,
  Search,
  Bell,
  Globe,
  ChevronDown,
  ShoppingBag,
  AlertTriangle,
  CheckCheck,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import  api  from "@/lib/api";

type NavbarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

type Notification = {
  _id: string;
  title: string;
  message: string;
  type:
    | "order"
    | "stock"
    | "payment"
    | "return"
    | "system";
  read: boolean;
  orderId?: string | null;
  createdAt: string;
};

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
}: NavbarProps) {
  const [profileOpen, setProfileOpen] =
    useState(false);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [userRole, setUserRole] = useState("Admin");

  const [profileImage, setProfileImage] =
    useState<string | null>(null);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [loadingNotifications, setLoadingNotifications] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const notificationRef =
    useRef<HTMLDivElement>(null);

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

  /* ================= FETCH NOTIFICATIONS ================= */

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);

      const response =
        await api.get("/notifications");

      setNotifications(response.data || []);
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error
      );
    } finally {
      setLoadingNotifications(false);
    }
  };

  /* ================= FETCH UNREAD COUNT ================= */

  const fetchUnreadCount = async () => {
    try {
      const response =
        await api.get(
          "/notifications/unread-count"
        );

      setUnreadCount(
        Number(response.data?.count || 0)
      );
    } catch (error) {
      console.error(
        "Failed to load notification count:",
        error
      );
    }
  };

  /* ================= INITIAL NOTIFICATION LOAD ================= */

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  /* ================= REFRESH WHEN DROPDOWN OPENS ================= */

  useEffect(() => {
    if (notificationOpen) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [notificationOpen]);

  /* ================= CLOSE NOTIFICATION DROPDOWN ================= */

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target as Node
        )
      ) {
        setNotificationOpen(false);
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

  /* ================= MARK ALL AS READ ================= */

  const markAllAsRead = async () => {
    try {
      await api.patch(
        "/notifications/read-all"
      );

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  };

  /* ================= MARK NOTIFICATION AS READ ================= */

  const handleNotificationClick = async (
    notification: Notification
  ) => {
    try {
      if (!notification.read) {
        await api.patch(
          `/notifications/${notification._id}/read`
        );

        setNotifications((current) =>
          current.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  read: true,
                }
              : item
          )
        );

        setUnreadCount((current) =>
          Math.max(current - 1, 0)
        );
      }

      /*
       * We will connect this orderId
       * to your existing OrderDetailsDialog
       * in the next step.
       */
      if (notification.orderId) {
        window.dispatchEvent(
          new CustomEvent(
            "open-admin-order",
            {
              detail: {
                orderId:
                  notification.orderId,
              },
            }
          )
        );

        setNotificationOpen(false);
      }
    } catch (error) {
      console.error(
        "Failed to handle notification:",
        error
      );
    }
  };

  /* ================= FORMAT TIME ================= */

  const formatNotificationTime = (
    dateString: string
  ) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const now = new Date();

    const difference =
      now.getTime() - date.getTime();

    const seconds =
      Math.floor(difference / 1000);

    if (seconds < 60) {
      return "Just now";
    }

    const minutes =
      Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} minute${
        minutes > 1 ? "s" : ""
      } ago`;
    }

    const hours =
      Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${
        hours > 1 ? "s" : ""
      } ago`;
    }

    const days =
      Math.floor(hours / 24);

    if (days < 7) {
      return `${days} day${
        days > 1 ? "s" : ""
      } ago`;
    }

    return date.toLocaleDateString();
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

        {/* ================= NOTIFICATIONS ================= */}

        <div
          ref={notificationRef}
          className="relative"
        >

          <button
            type="button"
            onClick={() =>
              setNotificationOpen(
                (prev) => !prev
              )
            }
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Notifications"
          >
            <Bell size={20} />

            {/* REAL NOTIFICATION COUNT */}

            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount > 9
                  ? "9+"
                  : unreadCount}
              </span>
            )}

          </button>

          {/* Notification Dropdown */}

          {notificationOpen && (
            <div className="absolute right-0 top-12 z-50 w-[350px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

              {/* Header */}

              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Notifications
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${
                          unreadCount > 1
                            ? "s"
                            : ""
                        }`
                      : "You're all caught up"}
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
                  >
                    <CheckCheck size={14} />
                    Mark all
                  </button>
                )}

              </div>

              {/* Notification List */}

              <div className="max-h-[380px] overflow-y-auto">

                {loadingNotifications ? (
                  <div className="px-4 py-10 text-center">
                    <p className="text-sm text-gray-500">
                      Loading notifications...
                    </p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-10 text-center">

                    <Bell
                      size={30}
                      className="mx-auto mb-2 text-gray-300"
                    />

                    <p className="text-sm font-medium text-gray-600">
                      No notifications
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      You're all caught up.
                    </p>

                  </div>
                ) : (
                  notifications.map(
                    (notification) => (
                      <button
                        key={notification._id}
                        type="button"
                        onClick={() =>
                          handleNotificationClick(
                            notification
                          )
                        }
                        className={`flex w-full gap-3 border-b border-gray-100 px-4 py-3.5 text-left transition hover:bg-gray-50 ${
                          !notification.read
                            ? "bg-blue-50/40"
                            : "bg-white"
                        }`}
                      >

                        {/* Icon */}

                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            notification.type ===
                            "order"
                              ? "bg-blue-100 text-blue-600"
                              : notification.type ===
                                "stock"
                              ? "bg-orange-100 text-orange-600"
                              : notification.type ===
                                "payment"
                              ? "bg-green-100 text-green-600"
                              : notification.type ===
                                "return"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {notification.type ===
                          "order" ? (
                            <ShoppingBag
                              size={17}
                            />
                          ) : (
                            <AlertTriangle
                              size={17}
                            />
                          )}
                        </div>

                        {/* Content */}

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-2">

                            <p
                              className={`text-sm ${
                                notification.read
                                  ? "font-medium text-gray-700"
                                  : "font-semibold text-gray-900"
                              }`}
                            >
                              {notification.title}
                            </p>

                            {!notification.read && (
                              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                            )}

                          </div>

                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {notification.message}
                          </p>

                          <p className="mt-1.5 text-[11px] text-gray-400">
                            {formatNotificationTime(
                              notification.createdAt
                            )}
                          </p>

                        </div>

                      </button>
                    )
                  )
                )}

              </div>

              {/* Footer */}

              <div className="border-t border-gray-100 px-4 py-3 text-center">
                <button
                  type="button"
                  onClick={() =>
                    setNotificationOpen(false)
                  }
                  className="text-xs font-medium text-blue-600 transition hover:text-blue-700"
                >
                  View all notifications
                </button>
              </div>

            </div>
          )}

        </div>

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
            onChange={
              handleProfilePictureChange
            }
          />

          {/* Profile Button */}

          <button
            type="button"
            onClick={() =>
              setProfileOpen(
                (prev) => !prev
              )
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

              <div
                className="fixed inset-0 z-40"
                onClick={() =>
                  setProfileOpen(false)
                }
              />

              <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

                <div className="flex flex-col items-center px-4 py-5">

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

                  <button
                    type="button"
                    onClick={
                      openFilePicker
                    }
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