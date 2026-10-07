"use client";

import { useState } from "react";
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  LayoutDashboard,
  Check,
} from "lucide-react";

export default function AppearanceSettings() {
  const [theme, setTheme] = useState("light");
  const [compactMode, setCompactMode] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Palette size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Appearance Settings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Customize how your admin dashboard looks and feels.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {/* Theme */}
        <div className="px-6 py-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Dashboard Theme
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Choose the appearance of your dashboard.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Light */}
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`rounded-2xl border-2 p-4 text-left transition ${
                theme === "light"
                  ? "border-indigo-500 bg-indigo-50/50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-500 shadow-sm">
                  <Sun size={20} />
                </div>

                {theme === "light" && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Check size={15} />
                  </div>
                )}
              </div>

              <h4 className="text-sm font-semibold text-slate-900">
                Light
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                Use a clean and bright dashboard.
              </p>
            </button>

            {/* Dark */}
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`rounded-2xl border-2 p-4 text-left transition ${
                theme === "dark"
                  ? "border-indigo-500 bg-indigo-50/50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                  <Moon size={20} />
                </div>

                {theme === "dark" && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Check size={15} />
                  </div>
                )}
              </div>

              <h4 className="text-sm font-semibold text-slate-900">
                Dark
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                Use a darker interface for low-light environments.
              </p>
            </button>
          </div>
        </div>

        {/* Sidebar Density */}
        <div className="flex items-center justify-between gap-6 px-6 py-6">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <LayoutDashboard size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Compact Dashboard
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Reduce spacing between dashboard elements to show more
                information on the screen.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCompactMode(!compactMode)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              compactMode ? "bg-indigo-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                compactMode ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Preview */}
        <div className="px-6 py-6">
          <div className="mb-4 flex items-center gap-3">
            <Monitor size={19} className="text-slate-500" />

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Preview
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Preview your selected dashboard appearance.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <div className="flex h-10 items-center gap-2 border-b border-slate-200 bg-white px-4">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            </div>

            <div className="flex gap-3 p-4">
              <div className="hidden h-28 w-20 rounded-xl bg-slate-200 sm:block" />

              <div className="flex-1">
                <div className="mb-3 h-5 w-32 rounded bg-slate-200" />

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="h-20 rounded-xl bg-white shadow-sm" />
                  <div className="h-20 rounded-xl bg-white shadow-sm" />
                  <div className="hidden h-20 rounded-xl bg-white shadow-sm sm:block" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-400">
          Appearance changes are currently preview-only.
        </p>

        <button
          type="button"
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
        >
          Save Appearance
        </button>
      </div>
    </div>
  );
}