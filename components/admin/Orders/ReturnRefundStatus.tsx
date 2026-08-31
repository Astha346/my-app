
"use client";

import {
  Clock,
  CheckCircle2,
  RotateCcw,
  Banknote,
  XCircle,
  MinusCircle,
} from "lucide-react";

import type { ElementType } from "react";

export type ReturnRefundStatus =
  | "none"
  | "requested"
  | "approved"
  | "processing"
  | "refunded"
  | "rejected";

interface Props {
  status?: ReturnRefundStatus;
}

const STATUS_CONFIG: Record<
  ReturnRefundStatus,
  {
    label: string;
    className: string;
    icon: ElementType;
  }
> = {
  none: {
    label: "No Request",
    className: "bg-slate-100 text-slate-500",
    icon: MinusCircle,
  },

  requested: {
    label: "Requested",
    className: "bg-amber-50 text-amber-700",
    icon: Clock,
  },

  approved: {
    label: "Approved",
    className: "bg-blue-50 text-blue-700",
    icon: CheckCircle2,
  },

  processing: {
    label: "Processing",
    className: "bg-purple-50 text-purple-700",
    icon: RotateCcw,
  },

  refunded: {
    label: "Refunded",
    className: "bg-emerald-50 text-emerald-700",
    icon: Banknote,
  },

  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700",
    icon: XCircle,
  },
};

export default function ReturnRefundStatusBadge({
  status = "none",
}: Props) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        whitespace-nowrap
        rounded-full
        px-2.5
        py-1
        text-xs
        font-semibold
        ${config.className}
      `}
    >
      <Icon className="h-3.5 w-3.5" />

      {config.label}
    </span>
  );
}

