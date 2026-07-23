import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Area,
} from "recharts";

interface SalesOverviewProps {
  salesData: any[];
}

export default function SalesOverview({
  salesData,
}: SalesOverviewProps) {

  return (
    <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow">

      <h2 className="font-bold text-xl mb-5">
        Sales Overview
      </h2>

      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart data={salesData}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
            />

            <YAxis />

            <Tooltip />

            <Area
              dataKey="sales"
              fill="#6366f1"
              fillOpacity={0.1}
            />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="#4f46e5"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}