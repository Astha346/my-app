
"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  LockKeyhole,
  MapPin,
  LogOut,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

import api from "@/lib/api";

interface UserData {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  phone?: string;
  role?: string | { name?: string };
  profileImage?: string;
}

interface JwtPayload {
  id?: string;
  userId?: string;
  sub?: string;
  email?: string;
  role?: string;
}

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET USER
  // =====================================================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        const cleanToken = token.replace(/^['"]|['"]$/g, "");

        const decoded = jwtDecode<JwtPayload>(cleanToken);

        const userId =
          decoded.id ||
          decoded.userId ||
          decoded.sub;

        if (!userId) {
          setError("User ID not found.");
          setLoading(false);
          return;
        }

        const response = await api.get(`/users/${userId}`);

        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setError("Unable to load your account.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    router.push("/");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-pink-100 border-t-pink-500" />

          <p className="mt-4 text-sm text-rose-400">
            Loading your account...
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !user) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4">

        <div className="w-full max-w-md rounded-3xl border border-pink-100 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-50">
            <User className="h-7 w-7 text-pink-500" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Account unavailable
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || "Unable to load account information."}
          </p>

          <button
            onClick={() => router.push("/login")}
            className="mt-6 w-full rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-600"
          >
            Go to Login
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // ROLE
  // =====================================================

  const role =
    typeof user.role === "object"
      ? user.role?.name
      : user.role;

  // =====================================================
  // ACCOUNT PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-rose-50">

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-8">

          <div className="flex items-center gap-2 text-sm font-medium text-pink-500">

            <ShoppingBag className="h-4 w-4" />

            My Account

          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Account Settings
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your personal information and account preferences.
          </p>

        </div>

        {/* =================================================
            PROFILE CARD
        ================================================= */}

        <div className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm">

          {/* Pink Banner */}

          <div className="relative h-32 overflow-hidden bg-linear-to-r from-pink-500 via-rose-400 to-pink-300">

            {/* Decorative circles */}

            <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/10" />

            <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-white/10" />

          </div>

          {/* Profile Information */}

          <div className="px-6 pb-7 sm:px-8">

            {/* IMPORTANT:
                z-10 keeps profile above banner
            */}

            <div className="relative z-10 -mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              {/* Profile */}

              <div className="flex items-end gap-4">

                {/* Avatar */}

                <div className="relative z-20 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-pink-50 shadow-lg">

                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-pink-500">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                  )}

                </div>

                {/* Name */}

                <div className="pb-1">

                  <h2 className="text-2xl font-bold text-slate-900">
                    {user.username}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {user.email}
                  </p>

                </div>

              </div>

              {/* Role */}

              <div className="flex w-fit items-center gap-2 rounded-full bg-pink-50 px-4 py-2">

                <ShieldCheck className="h-4 w-4 text-pink-500" />

                <span className="text-sm font-semibold capitalize text-pink-600">
                  {role || "Customer"}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <div className="rounded-3xl border border-pink-100 bg-white shadow-sm lg:col-span-2">

            {/* Header */}

            <div className="border-b border-pink-50 px-6 py-5 sm:px-8">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50">
                  <User className="h-5 w-5 text-pink-500" />
                </div>

                <div>

                  <h2 className="font-bold text-slate-900">
                    Personal Information
                  </h2>

                  <p className="text-xs text-slate-500">
                    Your account details
                  </p>

                </div>

              </div>

            </div>

            {/* Information Cards */}

            <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">

              {/* Username */}

              <div className="rounded-2xl border border-pink-50 bg-rose-50/50 p-4 transition hover:border-pink-100 hover:bg-pink-50">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">

                    <User className="h-4 w-4 text-pink-500" />

                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-medium text-slate-500">
                      Username
                    </p>

                    <p className="mt-1 truncate font-semibold text-slate-900">
                      {user.username}
                    </p>

                  </div>

                </div>

              </div>

              {/* Email */}

              <div className="rounded-2xl border border-pink-50 bg-rose-50/50 p-4 transition hover:border-pink-100 hover:bg-pink-50">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">

                    <Mail className="h-4 w-4 text-pink-500" />

                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-medium text-slate-500">
                      Email
                    </p>

                    <p className="mt-1 truncate font-semibold text-slate-900">
                      {user.email}
                    </p>

                  </div>

                </div>

              </div>

              {/* Phone */}

              <div className="rounded-2xl border border-pink-50 bg-rose-50/50 p-4 transition hover:border-pink-100 hover:bg-pink-50">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">

                    <Phone className="h-4 w-4 text-pink-500" />

                  </div>

                  <div>

                    <p className="text-xs font-medium text-slate-500">
                      Phone
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {user.phone || "Not added"}
                    </p>

                  </div>

                </div>

              </div>

              {/* Account Type */}

              <div className="rounded-2xl border border-pink-50 bg-rose-50/50 p-4 transition hover:border-pink-100 hover:bg-pink-50">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">

                    <ShieldCheck className="h-4 w-4 text-pink-500" />

                  </div>

                  <div>

                    <p className="text-xs font-medium text-slate-500">
                      Account Type
                    </p>

                    <p className="mt-1 font-semibold capitalize text-slate-900">
                      {role || "Customer"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              ACCOUNT SETTINGS
          ================================================= */}

          <div className="rounded-3xl border border-pink-100 bg-white shadow-sm">

            {/* Header */}

            <div className="border-b border-pink-50 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50">

                  <LockKeyhole className="h-5 w-5 text-pink-500" />

                </div>

                <div>

                  <h2 className="font-bold text-slate-900">
                    Account Settings
                  </h2>

                  <p className="text-xs text-slate-500">
                    Manage your account
                  </p>

                </div>

              </div>

            </div>

            <div className="p-4">

              {/* Change Password */}

              <button
                onClick={() => router.push("/change-password")}
                className="group flex w-full items-center justify-between rounded-2xl p-4 text-left transition hover:bg-pink-50"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 transition group-hover:bg-white">

                    <LockKeyhole className="h-4 w-4 text-slate-600 group-hover:text-pink-500" />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-slate-900">
                      Change Password
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Update your password
                    </p>

                  </div>

                </div>

                <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-pink-500" />

              </button>

              {/* Delivery Address */}

              <button
                onClick={() => router.push("/address")}
                className="group flex w-full items-center justify-between rounded-2xl p-4 text-left transition hover:bg-pink-50"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 transition group-hover:bg-white">

                    <MapPin className="h-4 w-4 text-slate-600 group-hover:text-pink-500" />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-slate-900">
                      Delivery Address
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Manage your address
                    </p>

                  </div>

                </div>

                <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-pink-500" />

              </button>

            </div>

          </div>

        </div>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <div className="mt-6 rounded-3xl border border-pink-100 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50">

                <LogOut className="h-5 w-5 text-pink-500" />

              </div>

              <div>

                <h3 className="font-semibold text-slate-900">
                  Sign out of your account
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  You can sign in again anytime.
                </p>

              </div>

            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-600"
            >

              <LogOut className="h-4 w-4" />

              Logout

            </button>

          </div>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">

          <ShoppingBag className="h-4 w-4 text-pink-400" />

          <span>
            ShopEase Account
          </span>

        </div>

      </div>

    </div>
  );
}

