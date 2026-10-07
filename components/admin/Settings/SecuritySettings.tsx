"use client";

import { useState } from "react";
import {
  Shield,
  Lock,
  KeyRound,
  LogOut,
  Mail,
  Smartphone,
  Save,
} from "lucide-react";

export default function SecuritySettings() {
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [loginProtection, setLoginProtection] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div>
      {/* Section Header */}
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Shield size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Security Settings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your account security and login protection.
            </p>
          </div>
        </div>
      </div>

      {/* Security Content */}
      <div className="divide-y divide-slate-100">

        {/* Change Password */}
        <div className="px-6 py-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <KeyRound size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Change Password
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Update your account password regularly to keep your account
                secure.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Current Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Current Password
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                New Password
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm New Password
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Save size={17} />
            Change Password
          </button>
        </div>

        {/* Session Security */}
        <div className="px-6 py-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Smartphone size={19} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Session Security
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Automatically expire your login session after a period of
                  inactivity.
                </p>
              </div>
            </div>

            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="w-36 shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
              <option value="120">2 hours</option>
              <option value="240">4 hours</option>
            </select>
          </div>

          <button
            type="button"
            className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={17} />
            Logout from all devices
          </button>
        </div>

        {/* Login Protection */}
        <div className="flex items-center justify-between gap-6 px-6 py-6">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Shield size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Login Protection
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Protect accounts against repeated unsuccessful login attempts.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLoginProtection(!loginProtection)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              loginProtection ? "bg-indigo-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                loginProtection ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Two Factor Authentication */}
        <div className="flex items-center justify-between gap-6 px-6 py-6">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Mail size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Two-Factor Authentication
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Require an OTP sent to the user's email during login.
              </p>

              <span className="mt-2 inline-block rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
                Coming next
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              twoFactorEnabled ? "bg-indigo-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                twoFactorEnabled ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-400">
          Security changes will be connected to the backend later.
        </p>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
        >
          <Save size={17} />
          Save Security Settings
        </button>
      </div>
    </div>
  );
}