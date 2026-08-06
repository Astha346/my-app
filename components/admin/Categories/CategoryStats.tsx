
"use client";

import {
  FolderTree,
  Layers,
  ListTree,
  Package,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  productCount?: number;
  status?: string;
}

interface CategoryStatsProps {
  categories?: Category[];
}

export default function CategoryStats({
  categories = [],
}: CategoryStatsProps) {
  const safeCategories = Array.isArray(categories)
    ? categories
    : [];

  const totalCategories = safeCategories.length;

  const mainCategories = safeCategories.filter(
    (category) => !category.parentId
  ).length;

  const subCategories = safeCategories.filter(
    (category) => !!category.parentId
  ).length;

  const totalProducts = safeCategories.reduce(
    (total, category) =>
      total + (category.productCount || 0),
    0
  );

  const stats = [
    {
      title: "Total Categories",
      value: totalCategories,
      description: "All categories",
      icon: FolderTree,
      iconClass: "bg-primary/10 text-primary",
    },
    {
      title: "Main Categories",
      value: mainCategories,
      description: "Top-level categories",
      icon: Layers,
      iconClass: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Subcategories",
      value: subCategories,
      description: "Nested categories",
      icon: ListTree,
      iconClass: "bg-violet-500/10 text-violet-600",
    },
    {
      title: "Products Assigned",
      value: totalProducts,
      description: "Products across categories",
      icon: Package,
      iconClass: "bg-orange-500/10 text-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className="border-border/60 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                
                {/* TEXT */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                    {stat.value.toLocaleString()}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>

                {/* ICON */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.iconClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

