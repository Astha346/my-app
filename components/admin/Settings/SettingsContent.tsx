"use client";

import { useEffect, useState } from "react";
import {
User,
Bell,
Shield,
Palette,
Settings,
Save,
Monitor,
CheckCircle2,
} from "lucide-react";

import { toast } from "sonner";
import api from "@/lib/api";

import SecuritySettings from "./SecuritySettings";
import AppearanceSettings from "./AppearanceSettings";
import SystemSettings from "./SystemSettings";

const settingsMenu = [
{
name: "General",
description: "Account and basic preferences",
icon: User,
color: "from-pink-500 to-rose-500",
bg: "bg-pink-500/10",
text: "text-pink-400",
},
{
name: "Notifications",
description: "Manage alerts and updates",
icon: Bell,
color: "from-amber-400 to-orange-500",
bg: "bg-amber-500/10",
text: "text-amber-400",
},
{
name: "Security",
description: "Password and login protection",
icon: Shield,
color: "from-red-500 to-pink-500",
bg: "bg-red-500/10",
text: "text-red-400",
},
{
name: "Appearance",
description: "Customize dashboard appearance",
icon: Palette,
color: "from-slate-400 to-slate-600",
bg: "bg-slate-700/50",
text: "text-slate-300",
},
{
name: "System",
description: "Store and system preferences",
icon: Monitor,
color: "from-cyan-500 to-blue-500",
bg: "bg-cyan-500/10",
text: "text-cyan-400",
},
];

const inputClass =
"w-full rounded-xl border border-slate-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20";

const fieldLabel =
"mb-2 block text-sm font-medium text-slate-300";

const sectionHeader =
"border-b border-slate-800 bg-black/40 px-6 py-6";

export default function SettingsContent() {
const [activeSetting, setActiveSetting] = useState("General");

// GENERAL SETTINGS
const [storeName, setStoreName] = useState("");
const [storeEmail, setStoreEmail] = useState("");
const [storePhone, setStorePhone] = useState("");
const [storeAddress, setStoreAddress] = useState("");
const [language, setLanguage] = useState("English");
const [timeZone, setTimeZone] = useState("Asia/Kathmandu");

const [loadingSettings, setLoadingSettings] = useState(true);
const [savingGeneral, setSavingGeneral] = useState(false);

// NOTIFICATIONS
const [emailNotifications, setEmailNotifications] = useState(true);
const [newOrderNotifications, setNewOrderNotifications] = useState(true);
const [lowStockNotifications, setLowStockNotifications] = useState(true);
const [savingNotifications, setSavingNotifications] = useState(false);

// LOAD SETTINGS
useEffect(() => {
const loadSettings = async () => {
try {
const response = await api.get("/settings");
const settings = response.data;


    setStoreName(settings.storeName || "");
    setStoreEmail(settings.storeEmail || "");
    setStorePhone(settings.storePhone || "");
    setStoreAddress(settings.storeAddress || "");
    setLanguage(settings.language || "English");
    setTimeZone(settings.timeZone || "Asia/Kathmandu");

    setEmailNotifications(settings.emailNotifications ?? true);
    setNewOrderNotifications(settings.newOrderNotifications ?? true);
    setLowStockNotifications(settings.lowStockNotifications ?? true);
  } catch (error) {
    console.error("Failed to load settings:", error);
    toast.error("Failed to load settings");
  } finally {
    setLoadingSettings(false);
  }
};

loadSettings();


}, []);

// SAVE GENERAL SETTINGS
const handleSaveGeneral = async () => {
try {
setSavingGeneral(true);


  await api.patch("/settings", {
    storeName,
    storeEmail,
    storePhone,
    storeAddress,
    language,
    timeZone,
  });

  toast.success("General settings saved successfully");
} catch (error) {
  console.error("Failed to save general settings:", error);
  toast.error("Failed to save general settings");
} finally {
  setSavingGeneral(false);
}


};

// SAVE NOTIFICATION SETTINGS
const handleSaveNotifications = async () => {
try {
setSavingNotifications(true);


  await api.patch("/settings", {
    emailNotifications,
    newOrderNotifications,
    lowStockNotifications,
  });

  toast.success("Notification settings saved successfully");
} catch (error) {
  console.error("Failed to save notification settings:", error);
  toast.error("Failed to save notification settings");
} finally {
  setSavingNotifications(false);
}


};

const activeMenu = settingsMenu.find(
(item) => item.name === activeSetting
);

return ( <div className="min-h-screen bg-black p-4 text-white md:p-6">
{/* Page Header */} <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-950 px-6 py-5 shadow-lg shadow-black/20"> <div className="flex items-center gap-3"> <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-black"> <Settings size={22} className="text-pink-400" /> </div>

```
      <div>
        <h1 className="text-2xl font-bold text-white">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Manage your account, security, notifications, appearance, and system preferences.
        </p>
      </div>
    </div>
  </div>

  {/* Settings Layout */}
  <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
    {/* Settings Menu */}
    <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-950 p-3 shadow-lg shadow-black/20">
      <div className="px-3 pb-3 pt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Settings Menu
        </p>
      </div>

      <div className="space-y-2">
        {settingsMenu.map((item) => {
          const Icon = item.icon;
          const isActive = activeSetting === item.name;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => setActiveSetting(item.name)}
              className={`group relative flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                isActive
                  ? "border-slate-700 bg-slate-800 text-white"
                  : "border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900 hover:text-white"
              }`}
            >
              {isActive && (
                <span
                  className={`absolute bottom-3 left-0 top-3 w-1 rounded-r-full bg-gradient-to-b ${item.color}`}
                />
              )}

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  isActive
                    ? `bg-gradient-to-br ${item.color} text-white`
                    : `${item.bg} ${item.text}`
                }`}
              >
                <Icon size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-semibold ${
                    isActive ? "text-white" : "text-slate-200"
                  }`}
                >
                  {item.name}
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {item.description}
                </p>
              </div>

              {isActive && (
                <CheckCircle2
                  size={17}
                  className="shrink-0 text-pink-400"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-black p-4">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-pink-400">
          <Settings size={17} />
        </div>

        <p className="text-sm font-semibold text-slate-200">
          ShopEase
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Manage your store preferences from one place.
        </p>
      </div>
    </aside>

    {/* Settings Content */}
    <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-lg shadow-black/20">
      {activeMenu && (
        <div className="flex items-center gap-3 border-b border-slate-800 bg-black/40 px-6 py-4">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${activeMenu.bg} ${activeMenu.text}`}
          >
            <activeMenu.icon size={17} />
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Current Section
            </p>

            <p className="mt-0.5 text-sm font-semibold text-white">
              {activeSetting}
            </p>
          </div>
        </div>
      )}

      {/* GENERAL */}
      {activeSetting === "General" && (
        <div>
          <div className={sectionHeader}>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white">
                <User size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  General Settings
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Manage your basic store and account information.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6">
            {loadingSettings ? (
              <div className="py-10 text-center text-sm text-slate-400">
                Loading settings...
              </div>
            ) : (
              <>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className={fieldLabel}>
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={fieldLabel}>
                      Store Email
                    </label>
                    <input
                      type="email"
                      value={storeEmail}
                      onChange={(e) => setStoreEmail(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={fieldLabel}>
                      Store Phone
                    </label>
                    <input
                      type="text"
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={fieldLabel}>
                      Store Address
                    </label>
                    <input
                      type="text"
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={fieldLabel}>
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className={inputClass}
                    >
                      <option value="English" className="bg-slate-950">
                        English
                      </option>
                      <option value="Nepali" className="bg-slate-950">
                        Nepali
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className={fieldLabel}>
                      Time Zone
                    </label>
                    <select
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                      className={inputClass}
                    >
                      <option value="Asia/Kathmandu" className="bg-slate-950">
                        Asia/Kathmandu
                      </option>
                      <option value="Asia/Kolkata" className="bg-slate-950">
                        Asia/Kolkata
                      </option>
                      <option value="UTC" className="bg-slate-950">
                        UTC
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end border-t border-slate-800 pt-5">
                  <button
                    type="button"
                    onClick={handleSaveGeneral}
                    disabled={savingGeneral}
                    className="flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={17} />
                    {savingGeneral ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {activeSetting === "Notifications" && (
        <div>
          <div className={sectionHeader}>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                <Bell size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  Notification Settings
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Choose which notifications you want to receive.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {[
              {
                title: "Email Notifications",
                description: "Receive important system notifications by email.",
                value: emailNotifications,
                setter: setEmailNotifications,
              },
              {
                title: "New Order Notifications",
                description: "Get notified whenever a new order is placed.",
                value: newOrderNotifications,
                setter: setNewOrderNotifications,
              },
              {
                title: "Low Stock Notifications",
                description: "Receive alerts when product stock is running low.",
                value: lowStockNotifications,
                setter: setLowStockNotifications,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between gap-5 px-6 py-6"
              >
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-slate-400">
                    {item.description}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={item.value}
                  aria-label={item.title}
                  onClick={() => item.setter(!item.value)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                    item.value ? "bg-pink-600" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      item.value ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end border-t border-slate-800 bg-black/30 px-6 py-4">
            <button
              type="button"
              onClick={handleSaveNotifications}
              disabled={savingNotifications}
              className="flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />
              {savingNotifications ? "Saving..." : "Save Notifications"}
            </button>
          </div>
        </div>
      )}

      {/* SECURITY */}
      {activeSetting === "Security" && <SecuritySettings />}

      {/* APPEARANCE */}
      {activeSetting === "Appearance" && <AppearanceSettings />}

      {/* SYSTEM */}
      {activeSetting === "System" && <SystemSettings />}
    </div>
  </div>
</div>


);
}
