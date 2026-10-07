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
    <div className="lg:col-span-2 mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Sales Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monthly sales performance
          </p>
        </div>

        <div className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600">
          Sales
        </div>

      </div>

      {/* Chart */}
      <div className="h-80 w-full">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={salesData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#E2E8F0"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              width={55}
            />

            <Tooltip
              cursor={{
                stroke: "#CBD5E1",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                padding: "10px 14px",
              }}
              labelStyle={{
                fontWeight: "600",
                color: "#0F172A",
              }}
              formatter={(value: any) => [
                `Rs ${Number(value).toLocaleString()}`,
                "Sales",
              ]}
            />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="none"
              fill="#6366F1"
              fillOpacity={0.08}
            />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#4F46E5",
                strokeWidth: 2,
                stroke: "#FFFFFF",
              }}
              activeDot={{
                r: 6,
                strokeWidth: 3,
                stroke: "#FFFFFF",
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}