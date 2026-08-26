import {
  ShoppingCart,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Props {
  orders: any[];
}

export default function OrderStats({
  orders,
}: Props) {
  const total = orders.length;

  const pending = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const processing = orders.filter(
    (order) => order.status === "processing"
  ).length;

  const shipped = orders.filter(
    (order) => order.status === "shipped"
  ).length;

  const delivered = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  const cancelled = orders.filter(
    (order) => order.status === "cancelled"
  ).length;

  const stats = [
    {
      title: "Total Orders",
      value: total,
      icon: ShoppingCart,
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
    },
    {
      title: "Processing",
      value: processing,
      icon: Package,
    },
    {
      title: "Shipped",
      value: shipped,
      icon: Truck,
    },
    {
      title: "Delivered",
      value: delivered,
      icon: CheckCircle,
    },
    {
      title: "Cancelled",
      value: cancelled,
      icon: XCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {stat.title}
              </p>

              <Icon
                className="h-5 w-5 text-gray-400"
              />
            </div>

            <p className="mt-3 text-2xl font-bold">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}