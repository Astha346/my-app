import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  Loader2,
  Truck,
  PackageCheck,
  XCircle,
} from "lucide-react";

import { OrderStatus } from "@/types/order";

type Props = {
  status: OrderStatus | string;
};

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    className: string;
    icon: React.ReactNode;
  }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: <Clock className="h-3.5 w-3.5" />,
  },

  confirmed: {
    label: "Confirmed",
    className:
      "bg-blue-100 text-blue-700 border-blue-200",
    icon: (
      <CheckCircle2 className="h-3.5 w-3.5" />
    ),
  },

  processing: {
    label: "Processing",
    className:
      "bg-purple-100 text-purple-700 border-purple-200",
    icon: (
      <Loader2 className="h-3.5 w-3.5" />
    ),
  },

  shipped: {
    label: "Shipped",
    className:
      "bg-indigo-100 text-indigo-700 border-indigo-200",
    icon: (
      <Truck className="h-3.5 w-3.5" />
    ),
  },

  delivered: {
    label: "Delivered",
    className:
      "bg-green-100 text-green-700 border-green-200",
    icon: (
      <PackageCheck className="h-3.5 w-3.5" />
    ),
  },

  cancelled: {
    label: "Cancelled",
    className:
      "bg-red-100 text-red-700 border-red-200",
    icon: (
      <XCircle className="h-3.5 w-3.5" />
    ),
  },
};

export default function OrderStatusBadge({
  status,
}: Props) {
  /*
   * Convert backend status to lowercase.
   * This protects the UI if MongoDB contains
   * "Pending", "PENDING", etc.
   */
  const normalizedStatus =
    String(status || "")
      .trim()
      .toLowerCase();

  const config =
    STATUS_CONFIG[normalizedStatus] ??
    STATUS_CONFIG.pending;

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 ${config.className}`}
    >
      {config.icon}

      {config.label}
    </Badge>
  );
}