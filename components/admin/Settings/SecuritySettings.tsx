"use client";

import { useEffect, useState } from "react";
import { Shield, Lock, KeyRound, Mail, Save } from "lucide-react";
import api from "@/lib/api";

export default function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [savingTwoFactor, setSavingTwoFactor] = useState(false);

  const [twoFactorMessage, setTwoFactorMessage] = useState("");
  const [twoFactorMessageType, setTwoFactorMessageType] = useState<
    "success" | "error"
  >("success");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  // Load the saved two-factor authentication setting.
  useEffect(() => {
    const loadSecuritySettings = async () => {
      try {
        setSettingsLoading(true);

        const response = await api.get("/settings");

        setTwoFactorEnabled(response.data?.twoFactorEnabled ?? true);
      } catch (error) {
        console.error("Failed to load security settings:", error);

        setTwoFactorMessageType("error");
        setTwoFactorMessage(
          "Unable to load the saved OTP setting. Please refresh and try again.",
        );
      } finally {
        setSettingsLoading(false);
      }
    };

    loadSecuritySettings();
  }, []);

  // Save the new two-factor authentication setting.
  const handleToggleTwoFactor = async () => {
    if (settingsLoading || savingTwoFactor) return;

    const previousValue = twoFactorEnabled;
    const newValue = !previousValue;

    setTwoFactorEnabled(newValue);
    setSavingTwoFactor(true);
    setTwoFactorMessage("");

    try {
      const response = await api.patch("/settings", {
        twoFactorEnabled: newValue,
      });

      setTwoFactorEnabled(
        response.data?.twoFactorEnabled ?? newValue,
      );

      setTwoFactorMessageType("success");
      setTwoFactorMessage(
        newValue
          ? "Two-factor authentication enabled successfully."
          : "Two-factor authentication disabled successfully.",
      );
    } catch (error) {
      console.error("Failed to update OTP setting:", error);

      // Restore the previous value if saving fails.
      setTwoFactorEnabled(previousValue);
      setTwoFactorMessageType("error");
      setTwoFactorMessage(
        "Unable to save the OTP setting. Please try again.",
      );
    } finally {
      setSavingTwoFactor(false);
    }
  };

  // Change the current user's password.
  const handleChangePassword = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessageType("error");
      setMessage("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setMessageType("error");
      setMessage("New password must be at least 8 characters long.");
      return;
    }

    if (currentPassword === newPassword) {
      setMessageType("error");
      setMessage(
        "Your new password must be different from your current password.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessageType("error");
      setMessage("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.patch("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setMessageType("success");
      setMessage("Password changed successfully. Redirecting to login...");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      setTimeout(() => {
        window.location.replace("/login");
      }, 1500);
    } catch (error: unknown) {
      const err = error as {
        response?: {
          data?: {
            message?: string | string[];
          };
        };
      };

      const backendMessage = err.response?.data?.message;

      setMessageType("error");
      setMessage(
        Array.isArray(backendMessage)
          ? backendMessage.join(", ")
          : backendMessage ||
              "Unable to change password. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Security heading */}
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Shield size={21} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Security Settings
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage your password and login security.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {/* Change password */}
        <form
          onSubmit={handleChangePassword}
          className="space-y-5 px-6 py-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Lock size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Change Password
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Choose a strong password with at least 8 characters.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Current Password
              </label>

              <input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                New Password
              </label>

              <input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Confirm New Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
              />
            </div>
          </div>

          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`rounded-xl border px-4 py-3 text-sm ${
                messageType === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Change Password
                </>
              )}
            </button>
          </div>
        </form>

        {/* Two-factor authentication */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-between gap-6">
            <div className="flex min-w-0 gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Mail size={19} />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">
                  Two-Factor Authentication
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Require an OTP sent to the user's email during login.
                </p>

                <span
                  className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                    twoFactorEnabled
                      ? "bg-green-50 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {settingsLoading
                    ? "Loading setting..."
                    : savingTwoFactor
                      ? "Saving..."
                      : twoFactorEnabled
                        ? "Enabled"
                        : "Disabled"}
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={twoFactorEnabled}
              aria-label="Two-Factor Authentication"
              disabled={settingsLoading || savingTwoFactor}
              onClick={handleToggleTwoFactor}
              className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${
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

          {twoFactorMessage && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                twoFactorMessageType === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {twoFactorMessage}
            </div>
          )}
        </div>

        {/* Additional security information */}
        <div className="flex items-start gap-3 bg-slate-50 px-6 py-5">
          <KeyRound
            size={19}
            className="mt-0.5 shrink-0 text-slate-500"
          />

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Keep your account secure
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Never share your password or email verification codes with
              anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}