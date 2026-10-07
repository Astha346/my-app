import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
} from "lucide-react";

import StatsCard from "../StatsCard";

export default function StatsCards({ stats }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

      {/* Revenue */}
      <div className="rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <StatsCard
          title="Revenue"
          value={`Rs ${Math.ceil(stats.revenue)}`}
          icon={
            <DollarSign
              size={36}
              className="text-purple-500"
            />
          }
        />
      </div>

      {/* Orders */}
      <div className="rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <StatsCard
          title="Orders"
          value={stats.totalOrders}
          icon={
            <ShoppingCart
              size={36}
              className="text-green-500"
            />
          }
        />
      </div>

      {/* Customers */}
      <div className="rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <StatsCard
          title="Customers"
          value={stats.totalCustomers}
          icon={
            <Users
              size={36}
              className="text-blue-500"
            />
          }
        />
      </div>

      {/* Products */}
      <div className="rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <StatsCard
          title="Products"
          value={stats.totalProducts}
          icon={
            <Package
              size={36}
              className="text-orange-500"
            />
          }
        />
      </div>

    </div>
  );
}