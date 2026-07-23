import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
} from "lucide-react";

import StatsCard from "../StatsCard";

export default function StatsCards({ stats }: any) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

      <StatsCard
        title="Revenue"
        value={`Rs ${stats.revenue}`}
        icon={
          <DollarSign
            size={40}
            className="text-purple-500"
          />
        }
      />

      <StatsCard
        title="Orders"
        value={stats.totalOrders}
        icon={
          <ShoppingCart
            size={40}
            className="text-green-500"
          />
        }
      />

      <StatsCard
        title="Customers"
        value={stats.totalCustomers}
        icon={
          <Users
            size={40}
            className="text-blue-500"
          />
        }
      />

      <StatsCard
        title="Products"
        value={stats.totalProducts}
        icon={
          <Package
            size={40}
            className="text-orange-500"
          />
        }
      />

    </div>
  );
}