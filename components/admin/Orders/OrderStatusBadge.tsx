import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/order";

interface Props {
  status: OrderStatus;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  },

  confirmed: {
    label: "Confirmed",
    className:
      "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },

  processing: {
    label: "Processing",
    className:
      "bg-purple-100 text-purple-700 hover:bg-purple-100",
  },

  shipped: {
    label: "Shipped",
    className:
      "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
  },

  delivered: {
    label: "Delivered",
    className:
      "bg-green-100 text-green-700 hover:bg-green-100",
  },

  cancelled: {
    label: "Cancelled",
    className:
      "bg-red-100 text-red-700 hover:bg-red-100",
  },
};

export default function OrderStatusBadge({
  status,
}: Props) {
  const config = statusConfig[status];

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
}