
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

  // GET USER
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

        const userId = decoded.id || decoded.userId || decoded.sub;

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

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    router.push("/");
  };

  // LOADING
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground transition-colors duration-200">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  // ERROR
  if (error || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground transition-colors duration-200">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center text-card-foreground shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <User className="h-7 w-7 text-primary" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-foreground">
            Account unavailable
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error || "Unable to load account information."}
          </p>

          <button
            onClick={() => router.push("/login")}
            className="mt-6 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ROLE
  const role =
    typeof user.role === "object" ? user.role?.name : user.role;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <ShoppingBag className="h-4 w-4" />
            My Account
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Account Settings
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your personal information and account preferences.
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm">

          {/* Banner */}
          <div className="relative h-32 overflow-hidden bg-primary">
            <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-primary-foreground/10" />
            <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-primary-foreground/10" />
          </div>

          {/* Profile information */}
          <div className="px-6 pb-7 sm:px-8">
            <div className="relative z-10 -mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex items-end gap-4">
                {/* Avatar */}
                <div className="relative z-20 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-card bg-muted shadow-lg">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-primary">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Name */}
                <div className="pb-1">
                  <h2 className="text-2xl font-bold text-foreground">
                    {user.username}
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex w-fit items-center gap-2 rounded-full bg-muted px-4 py-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold capitalize text-foreground">
                  {role || "Customer"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* PERSONAL INFORMATION */}
          <div className="rounded-3xl border border-border bg-card text-card-foreground shadow-sm lg:col-span-2">

            <div className="border-b border-border px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <User className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h2 className="font-bold text-foreground">
                    Personal Information
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Your account details
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">

              {/* Username */}
              <div className="rounded-2xl border border-border bg-muted/50 p-4 transition hover:bg-muted">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card">
                    <User className="h-4 w-4 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">
                      Username
                    </p>
                    <p className="mt-1 truncate font-semibold text-foreground">
                      {user.username}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="rounded-2xl border border-border bg-muted/50 p-4 transition hover:bg-muted">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="mt-1 truncate font-semibold text-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="rounded-2xl border border-border bg-muted/50 p-4 transition hover:bg-muted">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Phone
                    </p>
                    <p className="mt-1 font-semibold text-foreground">
                      {user.phone || "Not added"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Type */}
              <div className="rounded-2xl border border-border bg-muted/50 p-4 transition hover:bg-muted">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Account Type
                    </p>
                    <p className="mt-1 font-semibold capitalize text-foreground">
                      {role || "Customer"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACCOUNT SETTINGS */}
          <div className="rounded-3xl border border-border bg-card text-card-foreground shadow-sm">

            <div className="border-b border-border px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <LockKeyhole className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h2 className="font-bold text-foreground">
                    Account Settings
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Manage your account
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4">

              {/* Change Password */}
              <button
                onClick={() => router.push("/change-password")}
                className="group flex w-full items-center justify-between rounded-2xl p-4 text-left transition hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted transition group-hover:bg-background">
                    <LockKeyhole className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Change Password
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Update your password
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </button>

              {/* Delivery Address */}
              <button
                onClick={() => router.push("/address")}
                className="group flex w-full items-center justify-between rounded-2xl p-4 text-left transition hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted transition group-hover:bg-background">
                    <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Delivery Address
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Manage your address
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </button>
            </div>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="mt-6 rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                <LogOut className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h3 className="font-semibold text-foreground">
                  Sign out of your account
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  You can sign in again anytime.
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShoppingBag className="h-4 w-4 text-primary" />
          <span>ShopEase Account</span>
        </div>
      </div>
    </div>
  );
}

