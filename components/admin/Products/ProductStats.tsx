"use client";

import {
  Package,
  Tags,
  AlertTriangle,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

const stats = [
  {
    title: "Total Products",
    value: 120,
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Categories",
    value: 12,
    icon: Tags,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    title: "Low Stock",
    value: 8,
    icon: AlertTriangle,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
  },
  {
    title: "Out of Stock",
    value: 3,
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-100",
  },
];

export default function ProductStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title}>
            <CardContent className="flex items-center justify-between p-6">

              <div>
                <p className="text-sm text-muted-foreground">
                  {item.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {item.value}
                </h2>
              </div>

              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center ${item.bg}`}
              >
                <Icon
                  className={`h-6 w-6 ${item.color}`}
                />
              </div>

            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}