"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

interface Props {
  statusData: any[];
}

export default function OrderStatus({
  statusData,
}: Props) {
  const COLORS = [
    "#22C55E",
    "#3B82F6",
    "#A855F7",
    "#F59E0B",
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Order Status
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current order distribution
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
          Overview
        </div>

      </div>

      {/* Chart */}
      <div className="h-80 w-full">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={statusData}
              dataKey="count"
              nameKey="id"
              outerRadius={105}
              innerRadius={65}
              paddingAngle={3}
              label
              labelLine={false}
            >

              {statusData.map(
                (_: any, index: number) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />
                )
              )}

            </Pie>

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.08)",
                padding: "10px 14px",
              }}
            />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}