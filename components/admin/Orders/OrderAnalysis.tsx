"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const monthlyData = [
  {
    month: "Jan",
    fulfilled: 6200,
    cancelled: 3500,
    orders: 120,
  },
  {
    month: "Feb",
    fulfilled: 8500,
    cancelled: 3300,
    orders: 180,
  },
  {
    month: "Mar",
    fulfilled: 5800,
    cancelled: 3900,
    orders: 145,
  },
  {
    month: "Apr",
    fulfilled: 6400,
    cancelled: 3600,
    orders: 170,
  },
  {
    month: "May",
    fulfilled: 8200,
    cancelled: 4200,
    orders: 210,
  },
  {
    month: "Jun",
    fulfilled: 7800,
    cancelled: 4700,
    orders: 235,
  },
  {
    month: "Jul",
    fulfilled: 9400,
    cancelled: 5000,
    orders: 250,
  },
  {
    month: "Aug",
    fulfilled: 8600,
    cancelled: 5500,
    orders: 220,
  },
];

const weeklyData = [
  {
    month: "Mon",
    fulfilled: 5200,
    cancelled: 2800,
    orders: 110,
  },
  {
    month: "Tue",
    fulfilled: 6100,
    cancelled: 3100,
    orders: 125,
  },
  {
    month: "Wed",
    fulfilled: 5800,
    cancelled: 2900,
    orders: 118,
  },
  {
    month: "Thu",
    fulfilled: 7200,
    cancelled: 3500,
    orders: 145,
  },
  {
    month: "Fri",
    fulfilled: 6800,
    cancelled: 3300,
    orders: 138,
  },
  {
    month: "Sat",
    fulfilled: 8100,
    cancelled: 3900,
    orders: 165,
  },
  {
    month: "Sun",
    fulfilled: 7600,
    cancelled: 3600,
    orders: 155,
  },
];

const dailyData = [
  {
    month: "8 AM",
    fulfilled: 2500,
    cancelled: 1100,
    orders: 45,
  },
  {
    month: "10 AM",
    fulfilled: 3800,
    cancelled: 1600,
    orders: 70,
  },
  {
    month: "12 PM",
    fulfilled: 5200,
    cancelled: 2100,
    orders: 95,
  },
  {
    month: "2 PM",
    fulfilled: 6800,
    cancelled: 2900,
    orders: 125,
  },
  {
    month: "4 PM",
    fulfilled: 5900,
    cancelled: 2500,
    orders: 110,
  },
  {
    month: "6 PM",
    fulfilled: 8200,
    cancelled: 3400,
    orders: 150,
  },
  {
    month: "8 PM",
    fulfilled: 7600,
    cancelled: 3100,
    orders: 140,
  },
];

export default function OrderAnalysis() {
  const [interval, setInterval] = useState<"Monthly" | "Weekly" | "Daily">(
    "Monthly"
  );

  const [chartType, setChartType] = useState<"Line" | "Bar">("Line");

  const data =
    interval === "Monthly"
      ? monthlyData
      : interval === "Weekly"
        ? weeklyData
        : dailyData;

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-semibold">
            Order Analysis
          </CardTitle>

          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span>Fulfilled</span>

            <span className="ml-4 h-2 w-2 rounded-full bg-gray-400" />
            <span>Cancelled</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border p-1">
            {(["Monthly", "Weekly", "Daily"] as const).map((item) => (
              <Button
                key={item}
                variant={interval === item ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setInterval(item)}
              >
                {item}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-md border p-1">
            <Button
              variant={chartType === "Line" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setChartType("Line")}
            >
              Line
            </Button>

            <Button
              variant={chartType === "Bar" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setChartType("Bar")}
            >
              Bar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="h-[330px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "Line" ? (
              <LineChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#eeeeee"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#999",
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={45}
                  tick={{
                    fontSize: 11,
                    fill: "#999",
                  }}
                  tickFormatter={(value) => `$${value / 1000}K`}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #eee",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString()}`,
                    name === "fulfilled" ? "Fulfilled" : "Cancelled",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="fulfilled"
                  stroke="#f2643b"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 5,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="cancelled"
                  stroke="#b8b8b8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 5,
                  }}
                />
              </LineChart>
            ) : (
              <BarChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#eeeeee"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#999",
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={45}
                  tick={{
                    fontSize: 11,
                    fill: "#999",
                  }}
                  tickFormatter={(value) => `$${value / 1000}K`}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #eee",
                  }}
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString()}`,
                    name === "fulfilled" ? "Fulfilled" : "Cancelled",
                  ]}
                />

                <Bar
                  dataKey="fulfilled"
                  fill="#f2643b"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />

                <Bar
                  dataKey="cancelled"
                  fill="#d1d1d1"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <span>
            Total fulfilled:{" "}
            <span className="font-medium text-foreground">
              {data
                .reduce((sum, item) => sum + item.fulfilled, 0)
                .toLocaleString()}
            </span>
          </span>

          <span>
            Total cancelled:{" "}
            <span className="font-medium text-foreground">
              {data
                .reduce((sum, item) => sum + item.cancelled, 0)
                .toLocaleString()}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}