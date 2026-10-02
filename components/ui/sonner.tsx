
"use client";

import { Toaster as Sonner } from "sonner";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  X,
} from "lucide-react";

export function Toaster(
  props: React.ComponentProps<typeof Sonner>
) {
  return (
    <Sonner
      {...props}
      position="top-right"
      duration={3500}
      closeButton
      expand={false}
      visibleToasts={4}
      gap={12}
      icons={{
        success: (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        ),

        error: (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-100">
            <XCircle className="h-5 w-5" />
          </div>
        ),

        warning: (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-100">
            <AlertTriangle className="h-5 w-5" />
          </div>
        ),

        info: (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
            <Info className="h-5 w-5" />
          </div>
        ),

        loading: (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-600 ring-1 ring-slate-200">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group relative flex w-[380px] items-center gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.10)]",

          title:
            "text-[14px] font-semibold leading-5 text-slate-900",

          description:
            "mt-0.5 text-[12px] leading-5 text-slate-500",

          closeButton:
            "!right-3 !top-3 flex h-6 w-6 items-center justify-center rounded-full border-0 bg-transparent text-slate-400 opacity-0 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100",
        },

        className: "font-sans",
      }}
    />
  );
}

